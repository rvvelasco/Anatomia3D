// Utilidades geométricas para construir el modelo anatómico de forma procedural.
import * as THREE from 'three';
import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';

export const V = (x, y, z) => new THREE.Vector3(x, y, z);
const toV = (p) => (p instanceof THREE.Vector3 ? p.clone() : V(p[0], p[1], p[2]));

// Deja una geometría lista para fusionar: sin UV, no indexada.
function clean(g) {
  g.deleteAttribute('uv');
  if (g.index) g = g.toNonIndexed();
  if (!g.attributes.normal) g.computeVertexNormals();
  return g;
}

export function merge(geoms) {
  const list = geoms.filter(Boolean).map(clean);
  if (list.length === 1) return list[0];
  return mergeGeometries(list, false);
}

// Matriz que lleva el eje Y local a la dirección `dir` situada en `pos`.
function alignMatrix(pos, dir, spin = 0) {
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), dir.clone().normalize());
  if (spin) q.multiply(new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), spin));
  return new THREE.Matrix4().compose(pos, q, V(1, 1, 1));
}

// Elipsoide con centro, radios y (opcional) eje principal Y orientado a `axis`.
export function ellipsoid(center, radii, axis = null, seg = 18) {
  const g = new THREE.SphereGeometry(1, seg, Math.max(8, Math.round(seg * 0.7)));
  g.scale(radii[0], radii[1], radii[2]);
  if (axis) g.applyMatrix4(alignMatrix(V(0, 0, 0), toV(axis)));
  g.translate(...toV(center).toArray());
  return g;
}

// Casquete esférico (copa) cuya concavidad mira hacia `open`.
export function cup(center, r, open, angleDeg = 95, seg = 18) {
  const g = new THREE.SphereGeometry(r, seg, 10, 0, Math.PI * 2, 0, (angleDeg * Math.PI) / 180);
  g.applyMatrix4(alignMatrix(V(0, 0, 0), toV(open).negate()));
  g.translate(...toV(center).toArray());
  return g;
}

// Tubo de sección elíptica a lo largo de una curva suave.
// rad(t) -> [ancho, grosor] (semiejes). `out` define la dirección del grosor
// (vector fijo o función (p, t) -> vector); si falta se usan marcos de Frenet.
export function sweep(points, rad, opts = {}) {
  const pts = points.map(toV);
  const { segs = Math.max(8, pts.length * 6), radial = 12, out = null, caps = true } = opts;
  const curve = pts.length === 2 ? new THREE.LineCurve3(pts[0], pts[1]) : new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const radFn = typeof rad === 'function' ? rad : () => (Array.isArray(rad) ? rad : [rad, rad]);
  const frames = out ? null : curve.computeFrenetFrames(segs, false);
  const pos = [];
  const idx = [];
  const tmp = V(0, 0, 0);
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const p = curve.getPointAt(t);
    const T = curve.getTangentAt(t).normalize();
    let N;
    let B;
    if (out) {
      const o = typeof out === 'function' ? toV(out(p, t)) : toV(out);
      N = o.sub(T.clone().multiplyScalar(o.dot(T)));
      if (N.lengthSq() < 1e-6) N = Math.abs(T.y) < 0.9 ? V(0, 1, 0).cross(T) : V(1, 0, 0).cross(T);
      N.normalize();
      B = T.clone().cross(N).normalize();
    } else {
      N = frames.normals[i];
      B = frames.binormals[i];
    }
    const [w, h] = radFn(t);
    for (let j = 0; j < radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      tmp.copy(p).addScaledVector(B, Math.cos(a) * w).addScaledVector(N, Math.sin(a) * h);
      pos.push(tmp.x, tmp.y, tmp.z);
    }
  }
  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * radial + j;
      const b = i * radial + ((j + 1) % radial);
      const c = (i + 1) * radial + j;
      const d = (i + 1) * radial + ((j + 1) % radial);
      idx.push(a, c, b, b, c, d);
    }
  }
  if (caps) {
    for (const [ring, t, flip] of [[0, 0, true], [segs, 1, false]]) {
      const p = curve.getPointAt(t);
      const ci = pos.length / 3;
      pos.push(p.x, p.y, p.z);
      for (let j = 0; j < radial; j++) {
        const a = ring * radial + j;
        const b = ring * radial + ((j + 1) % radial);
        if (flip) idx.push(ci, a, b);
        else idx.push(ci, b, a);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// Perfil típico: valores en origen, vientre y extremo final con transición suave.
export function profile(a, mid, b, pow = 1) {
  return (t) => {
    const base = a + (b - a) * t;
    const bump = (mid - (a + b) / 2) * Math.pow(Math.sin(Math.PI * t), pow);
    return Math.max(0.05, base + bump);
  };
}

// Tubo simple de radio variable (circular).
export function rod(points, r0, r1 = r0, rMid = (r0 + r1) / 2, opts = {}) {
  const f = profile(r0, rMid, r1);
  return sweep(points, (t) => [f(t), f(t)], { radial: 10, ...opts });
}

// Hueso largo: diáfisis + epífisis ensanchadas.
export function longBone(points, rShaft, rProx, rDist, opts = {}) {
  const f = (t) => {
    const e1 = Math.exp(-Math.pow(t / 0.09, 2));
    const e2 = Math.exp(-Math.pow((1 - t) / 0.09, 2));
    return rShaft + (rProx - rShaft) * e1 + (rDist - rShaft) * e2;
  };
  return sweep(points, (t) => [f(t), f(t) * (opts.flat || 1)], { radial: 12, segs: 28, ...opts });
}

// Placa: contorno (aprox. plano) triangulado en abanico, con grosor.
// `bulge` desplaza el centro (para concavidades) a lo largo de la normal.
export function plate(outline, thickness = 0.4, bulge = 0) {
  const pts = outline.map(toV);
  const n = pts.length;
  const c = V(0, 0, 0);
  pts.forEach((p) => c.add(p));
  c.multiplyScalar(1 / n);
  const nrm = V(0, 0, 0);
  for (let i = 0; i < n; i++) {
    const a = pts[i].clone().sub(c);
    const b = pts[(i + 1) % n].clone().sub(c);
    nrm.add(a.cross(b));
  }
  nrm.normalize();
  const h = thickness / 2;
  const top = pts.map((p) => p.clone().addScaledVector(nrm, h));
  const bot = pts.map((p) => p.clone().addScaledVector(nrm, -h));
  const cT = c.clone().addScaledVector(nrm, h + bulge);
  const cB = c.clone().addScaledVector(nrm, -h + bulge);
  // anillo intermedio para suavizar la curvatura
  const mid = (arr, cc) => arr.map((p) => p.clone().lerp(cc, 0.5).addScaledVector(nrm, bulge * 0.25));
  const tm = mid(top, cT);
  const bm = mid(bot, cB);
  const pos = [];
  const tri = (a, b, c2) => pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c2.x, c2.y, c2.z);
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    tri(cT, tm[i], tm[j]);
    tri(tm[i], top[i], top[j]);
    tri(tm[i], top[j], tm[j]);
    tri(cB, bm[j], bm[i]);
    tri(bm[i], bot[j], bot[i]);
    tri(bm[i], bm[j], bot[j]);
    tri(top[i], bot[i], bot[j]);
    tri(top[i], bot[j], top[j]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

// Parche de elipsoide parametrizado con eje polar lateral (X):
// u = ángulo sagital (0 frente, 90 vértice, 180 atrás), v = latitud lateral (-90..90).
export function skullPatch(center, radii, u0, u1, v0, v1, shell = 0.55, seg = 20) {
  const d2r = Math.PI / 180;
  const nu = seg;
  const nv = Math.max(4, Math.round(seg * Math.abs(v1 - v0) / Math.max(1, Math.abs(u1 - u0))) + 4);
  const pt = (u, v, k) => {
    const U = u * d2r;
    const W = v * d2r;
    return V(
      center[0] + Math.sin(W) * radii[0] * k,
      center[1] + Math.cos(W) * Math.sin(U) * radii[1] * k,
      center[2] + Math.cos(W) * Math.cos(U) * radii[2] * k,
    );
  };
  const pos = [];
  const push = (a, b, c) => pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  const kIn = 1 - shell / Math.min(...radii);
  const grid = (k) => {
    const rows = [];
    for (let i = 0; i <= nu; i++) {
      const r = [];
      for (let j = 0; j <= nv; j++) r.push(pt(u0 + ((u1 - u0) * i) / nu, v0 + ((v1 - v0) * j) / nv, k));
      rows.push(r);
    }
    return rows;
  };
  const A = grid(1);
  const B = grid(kIn);
  for (let i = 0; i < nu; i++) {
    for (let j = 0; j < nv; j++) {
      push(A[i][j], A[i + 1][j], A[i + 1][j + 1]);
      push(A[i][j], A[i + 1][j + 1], A[i][j + 1]);
      push(B[i][j], B[i + 1][j + 1], B[i + 1][j]);
      push(B[i][j], B[i][j + 1], B[i + 1][j + 1]);
    }
  }
  const edge = (a1, a2, b1, b2) => {
    push(a1, b1, b2);
    push(a1, b2, a2);
  };
  for (let i = 0; i < nu; i++) {
    edge(A[i][0], A[i + 1][0], B[i][0], B[i + 1][0]);
    edge(A[i + 1][nv], A[i][nv], B[i + 1][nv], B[i][nv]);
  }
  for (let j = 0; j < nv; j++) {
    edge(A[0][j + 1], A[0][j], B[0][j + 1], B[0][j]);
    edge(A[nu][j], A[nu][j + 1], B[nu][j], B[nu][j + 1]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

// Interpola un punto a lo largo de una polilínea (s en 0..1, por longitud).
export function along(poly, s) {
  const pts = poly.map(toV);
  if (pts.length === 1) return pts[0];
  const lens = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const l = pts[i].distanceTo(pts[i + 1]);
    lens.push(l);
    total += l;
  }
  let d = s * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) return pts[i].clone().lerp(pts[i + 1], Math.min(1, d / lens[i]));
    d -= lens[i];
  }
  return pts[pts.length - 1];
}

// Lámina muscular: varias fibras (husos) que recorren una serie de polilíneas
// de control (origen -> ... -> inserción). Útil para músculos en abanico.
export function sheet(lines, { n = 1, w = [0.4, 1, 0.3], h = [0.25, 0.6, 0.2], out = null, spread = [0, 1], pow = 0.8 } = {}) {
  const geos = [];
  // las fibras se solapan ligeramente para que la lámina se vea continua
  const k = n > 1 ? 1.3 : 1;
  const fw = profile(w[0] * k, w[1] * k, w[2] * k, pow);
  const fh = profile(h[0], h[1], h[2], pow);
  for (let i = 0; i < n; i++) {
    const s = n === 1 ? 0.5 : spread[0] + ((spread[1] - spread[0]) * i) / (n - 1);
    const path = lines.map((l) => along(l, s));
    geos.push(sweep(path, (t) => [fw(t), fh(t)], { out, radial: 10, segs: Math.max(10, path.length * 6) }));
  }
  return merge(geos);
}

// Superficie paramétrica fn(a, t) con a, t en [0, 1] (se renderiza a doble cara).
export function surface(fn, na = 20, nt = 10) {
  const pos = [];
  const P = [];
  for (let i = 0; i <= na; i++) {
    const row = [];
    for (let j = 0; j <= nt; j++) row.push(fn(i / na, j / nt));
    P.push(row);
  }
  const push = (a, b, c) => pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  for (let i = 0; i < na; i++) {
    for (let j = 0; j < nt; j++) {
      push(P[i][j], P[i + 1][j], P[i + 1][j + 1]);
      push(P[i][j], P[i + 1][j + 1], P[i][j + 1]);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}
