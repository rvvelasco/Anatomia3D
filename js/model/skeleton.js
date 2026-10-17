// Esqueleto procedural. Unidades: cm. Y arriba (pies en y=0), +Z anterior.
// El lado derecho del cuerpo está en -X (s = -1) y el izquierdo en +X (s = +1).
import * as THREE from 'three';
import { V, ellipsoid, cup, sweep, rod, longBone, plate, skullPatch, surface, along, merge } from '../geo.js';

export const SIDES = [
  { s: -1, key: 'd', name: 'derecho' },
  { s: 1, key: 'i', name: 'izquierdo' },
];

// ---------- Columna vertebral ----------
// [id, y, z] centro del cuerpo vertebral
export const SPINE = [
  ['c1', 156.6, -1.6], ['c2', 154.6, -1.3], ['c3', 152.6, -0.8], ['c4', 150.8, -0.5], ['c5', 149.0, -0.5],
  ['c6', 147.2, -0.8], ['c7', 145.4, -1.3], ['t1', 143.3, -2.0], ['t2', 140.9, -2.8], ['t3', 138.5, -3.5],
  ['t4', 136.1, -4.0], ['t5', 133.7, -4.4], ['t6', 131.3, -4.6], ['t7', 128.9, -4.6], ['t8', 126.5, -4.4],
  ['t9', 124.1, -4.0], ['t10', 121.6, -3.5], ['t11', 119.1, -3.0], ['t12', 116.5, -2.4], ['l1', 113.6, -1.8],
  ['l2', 110.4, -1.0], ['l3', 107.1, -0.5], ['l4', 103.8, -0.4], ['l5', 100.5, -0.9],
];
export const spineIndex = Object.fromEntries(SPINE.map((v, i) => [v[0], i]));
export const vert = (id) => {
  const v = SPINE[spineIndex[id]];
  return V(0, v[1], v[2]);
};

function spineTangent(i) {
  const a = SPINE[Math.max(0, i - 1)];
  const b = SPINE[Math.min(SPINE.length - 1, i + 1)];
  return V(0, a[1] - b[1], a[2] - b[2]).normalize();
}

function vertParams(id) {
  const r = id[0];
  const n = parseInt(id.slice(1), 10);
  if (r === 'c') return { bw: 1.1 + n * 0.05, bd: 0.8, bh: 1.0, canal: 1.3, sp: 1.4 + (n === 7 ? 1.2 : n * 0.1), drop: 0.5, tp: 2.0 + n * 0.08, tpz: 0.2, spR: 0.22 };
  if (r === 't') return { bw: 1.3 + n * 0.06, bd: 1.1 + n * 0.05, bh: 1.6 + n * 0.04, canal: 1.3, sp: 3.0, drop: n < 10 ? 2.2 : 1.0, tp: 2.9 - n * 0.06, tpz: -0.9, spR: 0.25 };
  return { bw: 2.1 + n * 0.06, bd: 1.6, bh: 2.3, canal: 1.5, sp: 2.6, drop: 0.4, tp: 3.2 + (n === 3 ? 0.5 : 0), tpz: -0.4, spR: 0.38 };
}

function buildVertebra(i) {
  const [id, y, z] = SPINE[i];
  const p = vertParams(id);
  const up = spineTangent(i);
  const back = V(0, 0, -1).sub(up.clone().multiplyScalar(-up.z)).normalize();
  // matriz local: X lateral, Y = eje de la columna, Z anterior
  const ant = back.clone().negate();
  const m = new THREE.Matrix4().makeBasis(V(1, 0, 0), up, ant).setPosition(0, y, z);
  const L = (x, yy, zz) => V(x, yy, zz).applyMatrix4(m);
  const g = [];
  if (id !== 'c1') {
    const body = new THREE.CylinderGeometry(1, 1, p.bh, 18);
    body.scale(p.bw, 1, p.bd);
    body.applyMatrix4(m);
    g.push(body);
  }
  if (id === 'c1') {
    // atlas: anillo con arco anterior y posterior
    g.push(rod([L(0, 0, 0.9), L(-1.5, 0, 0.3), L(-1.8, 0, -1.0), L(-1.2, 0, -2.4), L(0, 0, -2.8), L(1.2, 0, -2.4), L(1.8, 0, -1.0), L(1.5, 0, 0.3), L(0, 0, 0.9)], 0.35));
    g.push(ellipsoid(L(-1.9, 0, -0.4), [0.7, 0.5, 0.9]), ellipsoid(L(1.9, 0, -0.4), [0.7, 0.5, 0.9]));
    g.push(rod([L(-2, 0, -0.5), L(-3.6, 0.1, -0.6)], 0.4, 0.3), rod([L(2, 0, -0.5), L(3.6, 0.1, -0.6)], 0.4, 0.3));
    return merge(g);
  }
  if (id === 'c2') g.push(rod([L(0, 0.4, 0.1), L(0, 1.9, 0.2)], 0.45, 0.35)); // apófisis odontoides
  const cz = -p.bd - p.canal;
  const px = p.bw * 0.6;
  g.push(rod([L(-px, 0.1, -p.bd * 0.7), L(-px * 1.25, 0.1, -p.bd - p.canal * 0.5), L(-0.5, 0.1, cz), L(0.5, 0.1, cz), L(px * 1.25, 0.1, -p.bd - p.canal * 0.5), L(px, 0.1, -p.bd * 0.7)], 0.3));
  g.push(rod([L(0, 0.1, cz + 0.1), L(0, -p.drop * 0.5, cz - p.sp * 0.6), L(0, -p.drop, cz - p.sp)], p.spR, p.spR * 0.8, p.spR, { out: V(1, 0, 0) }));
  for (const sx of [-1, 1]) {
    g.push(rod([L(sx * px, 0.1, -p.bd - 0.5), L(sx * (p.bw + p.tp * 0.5), 0.15, -p.bd - 0.6 + p.tpz * 0.5), L(sx * (p.bw + p.tp), 0.2, -p.bd - 0.6 + p.tpz)], 0.28, 0.22));
    // apófisis articulares
    g.push(ellipsoid(L(sx * px * 1.15, 0.2, -p.bd - p.canal * 0.55), [0.35, p.bh * 0.55, 0.35]));
  }
  return merge(g);
}

// ---------- Tórax ----------
const STERNUM_Z = (y) => 6.4 + (141 - y) * 0.12;
export const sternumPoint = (y, x = 0) => V(x, y, STERNUM_Z(y));
const RIB_STERNUM_Y = [139.9, 136.5, 133.6, 130.8, 128.0, 125.4, 123.0];
const RIB_W = [6.4, 9.0, 11.0, 12.4, 13.3, 13.8, 14.0, 14.0, 13.8, 13.2, 12.2, 10.6];
const RIB_DROP = [3.0, 5.6, 7.6, 9.2, 10.2, 10.8, 11.2, 11.0, 10.0, 8.6, 6.0, 3.6];
const RIB_ZF = [5.6, 6.6, 7.2, 7.6, 8.0, 8.2, 8.0, 7.0, 5.6, 3.6, -1.0, -4.0];
const RIB_XA = [3.9, 5.2, 6.4, 7.4, 8.4, 9.4, 10.4, 11.3, 11.9, 12.3, 11.9, 10.0];

export function ribPath(n, s) {
  const i = n - 1;
  const v = SPINE[spineIndex['t' + n]];
  const yh = v[1] + 0.6;
  const zv = v[2];
  const W = RIB_W[i];
  const d = RIB_DROP[i];
  const zf = RIB_ZF[i];
  const xa = RIB_XA[i];
  const P = (x, y, z) => V(s * x, y, z);
  if (n === 1) {
    return [P(1.4, yh, zv - 0.4), P(2.8, yh + 0.2, zv - 1.6), P(4.8, yh - 0.2, zv - 1.6), P(6.2, yh - 0.9, zv + 0.6), P(5.9, yh - 1.8, zv + 3.6), P(xa, yh - d, zf)];
  }
  const pts = [
    P(1.6, yh, zv - 0.5),
    P(3.0, yh + 0.1, zv - 2.4),
    P(W * 0.52, yh - 0.4, zv - 3.6),
    P(W * 0.88, yh - d * 0.22, zv - 2.0),
    P(W, yh - d * 0.42, (zv + zf) / 2 - 0.5),
  ];
  if (n <= 10) pts.push(P(W * 0.93, yh - d * 0.68, zf - 2.6), P(xa, yh - d, zf));
  else pts.push(P(W * 0.94, yh - d * 0.8, zf));
  return pts;
}

function costalCartilage(n, s) {
  const end = ribPath(n, s).at(-1);
  const P = (x, y) => sternumPoint(y, s * x);
  if (n <= 7) {
    const ys = RIB_STERNUM_Y[n - 1];
    const tgt = P(1.6, ys);
    const mid = end.clone().lerp(tgt, 0.5);
    mid.z += 0.6;
    return rod([end, mid, tgt], 0.45, 0.4);
  }
  if (n <= 10) {
    const prev = ribPath(n - 1, s).at(-1);
    const tgt = prev.clone().lerp(P(1.6, RIB_STERNUM_Y[6]), n === 8 ? 0.55 : 0.2);
    if (n > 8) tgt.copy(ribPath(n - 1, s).at(-1)).lerp(P(1.6, RIB_STERNUM_Y[6]), 0.1);
    return rod([end, end.clone().lerp(tgt, 0.5).add(V(0, 0, 0.5)), tgt], 0.4, 0.35);
  }
  return null;
}

// ---------- Miembro superior ----------
export function armLM(s) {
  const P = (x, y, z) => V(s * x, y, z);
  return {
    sternoclav: P(1.8, 141.3, 6.3),
    acromioclav: P(16.4, 143.3, -1.4),
    acromion: P(17.9, 143.1, -0.6),
    supAngle: P(7.2, 141.3, -8.0),
    spineRoot: P(7.0, 137.4, -9.0),
    infAngle: P(9.2, 126.3, -9.6),
    glenoid: P(14.6, 139.5, -2.6),
    coracoid: P(14.4, 141.6, 1.4),
    infraglen: P(14.1, 137.6, -3.6),
    supraglen: P(14.8, 140.6, -2.4),
    humHead: P(16.0, 139.2, -1.4),
    greaterTub: P(18.0, 138.7, -0.4),
    lesserTub: P(16.7, 138.6, 0.7),
    deltTub: P(18.7, 127.5, -0.4),
    humMid: P(18.5, 124, -1.0),
    latEpi: P(21.5, 109.6, -1.0),
    medEpi: P(16.5, 109.8, -1.6),
    elbow: P(19.1, 108.8, -0.8),
    olecranon: P(18.0, 109.6, -3.0),
    radTub: P(20.0, 105.6, 0.0),
    ulnTub: P(18.6, 106.6, 0.1),
    radMid: P(21.8, 96, 0.6),
    radStyl: P(24.5, 83.4, 1.6),
    ulnStyl: P(19.6, 83.6, 0.4),
    wrist: P(22.0, 82.6, 1.4),
    pisiform: P(19.9, 82.2, 2.2),
  };
}

const FINGER = {
  // [x base metacarpo, x cabeza, longitudes falanges [prox, media, distal]]
  2: [23.2, 23.8, [4.0, 2.4, 1.7]],
  3: [22.1, 22.3, [4.5, 2.8, 1.9]],
  4: [21.0, 20.9, [4.2, 2.6, 1.8]],
  5: [20.0, 19.5, [3.3, 1.9, 1.6]],
};

export function handLM(s) {
  const P = (x, y, z) => V(s * x, y, z);
  const mc = {};
  for (const f of [2, 3, 4, 5]) {
    const [xb, xh] = FINGER[f];
    const len = f === 3 ? 6.6 : f === 2 ? 6.4 : f === 4 ? 5.9 : 5.4;
    mc[f] = [P(xb, 80.0, 1.6), P(xh, 80.0 - len, 1.8 + (f === 3 ? 0.1 : 0))];
  }
  mc[1] = [P(24.6, 80.4, 2.2), P(26.2, 76.1, 3.6)];
  return { mc };
}

function armBones(s) {
  const A = armLM(s);
  const P = (x, y, z) => V(s * x, y, z);
  const out = {};
  out.clavicula = rod([A.sternoclav, P(6, 142.0, 6.4), P(11, 143.0, 3.4), P(14.5, 143.4, 0.2), A.acromioclav], 0.75, 0.6, 0.5);
  // escápula
  const scap = [
    A.supAngle, P(10.0, 141.0, -7.4), P(12.2, 140.6, -6.2), P(13.6, 139.6, -4.6), P(13.6, 136.6, -5.4), P(12.6, 132.4, -7.0),
    P(10.9, 128.4, -8.7), A.infAngle, P(8.4, 130.5, -9.6), P(7.3, 134.5, -9.2), P(7.0, 138.4, -8.7),
  ];
  out.escapula = merge([
    plate(scap, 0.45, -0.6 * s * 0),
    sweep([A.spineRoot, P(10.5, 139.0, -9.6), P(14.0, 141.4, -8.0), P(16.6, 143.0, -4.4), A.acromion], profile3(0.35, 0.8, 0.9), { out: V(0, 1, -0.4) }),
    rod([P(13.5, 139.6, -4.6), A.glenoid], 0.9, 1.1),
    ellipsoid(A.glenoid, [0.6, 1.5, 1.0], null),
    rod([P(13.3, 140.4, -4.6), P(13.6, 142.0, -2.6), A.coracoid], 0.5, 0.4),
  ]);
  // húmero
  out.humero = merge([
    ellipsoid(A.humHead, [2.2, 2.3, 2.2]),
    ellipsoid(A.greaterTub, [1.1, 1.5, 1.2]),
    ellipsoid(A.lesserTub, [0.8, 1.1, 0.7]),
    longBone([P(17.2, 138.2, -0.8), P(17.8, 132, -0.8), A.humMid, P(19.0, 114, -0.9), P(19.1, 110.8, -0.9)], 1.0, 1.7, 1.3),
    ellipsoid(A.elbow, [2.4, 1.1, 1.2]),
    ellipsoid(A.medEpi, [0.9, 0.8, 0.7]),
    ellipsoid(A.latEpi, [0.6, 0.8, 0.7]),
  ]);
  out.cubito = merge([
    longBone([A.olecranon, P(18.4, 107.2, -1.2), P(19.0, 100, -0.4), P(19.4, 90, 0.2), P(19.8, 84.4, 0.5)], 0.6, 1.0, 0.75),
    ellipsoid(P(18.6, 107.8, -0.4), [0.8, 1.2, 0.7]),
    ellipsoid(A.ulnStyl, [0.35, 0.6, 0.35]),
  ]);
  out.radio = merge([
    ellipsoid(P(20.8, 107.4, -0.6), [1.0, 0.6, 1.0]),
    longBone([P(20.8, 107.0, -0.6), P(21.0, 103.0, -0.2), A.radMid, P(23.2, 88, 1.2), P(23.6, 84.4, 1.5)], 0.6, 0.85, 1.25, { flat: 0.75 }),
    ellipsoid(P(23.4, 84.4, 1.5), [1.6, 0.7, 1.0]),
  ]);
  // carpo
  const carp = {
    escafoides: [24.0, 82.2, 1.6, [0.8, 0.55, 0.6]],
    semilunar: [22.6, 82.4, 1.4, [0.65, 0.55, 0.6]],
    piramidal: [21.2, 82.2, 1.2, [0.65, 0.55, 0.55]],
    pisiforme: [20.6, 81.9, 2.2, [0.42, 0.45, 0.42]],
    trapecio: [24.6, 80.8, 2.0, [0.7, 0.6, 0.6]],
    trapezoide: [23.4, 80.9, 1.7, [0.55, 0.55, 0.55]],
    grande: [22.2, 81.0, 1.5, [0.65, 0.9, 0.65]],
    ganchoso: [20.9, 81.0, 1.4, [0.65, 0.7, 0.6]],
  };
  for (const [k, [x, y, z, r]] of Object.entries(carp)) out[k] = ellipsoid(P(x, y, z), r, null, 12);
  const H = handLM(s);
  const names = { 1: 'primer', 2: 'segundo', 3: 'tercer', 4: 'cuarto', 5: 'quinto' };
  for (const f of [1, 2, 3, 4, 5]) {
    const [b, h] = H.mc[f];
    out['metacarpiano_' + f] = merge([longBone([b, h], 0.32, 0.5, 0.5)]);
    // falanges
    const dir = h.clone().sub(b).normalize();
    let start = h.clone().addScaledVector(dir, 0.55);
    const lens = f === 1 ? [3.0, 2.2] : FINGER[f][2];
    const segNames = f === 1 ? ['proximal', 'distal'] : ['proximal', 'media', 'distal'];
    lens.forEach((len, k) => {
      const d = dir.clone();
      d.z += 0.08 * (k + 1); // ligera flexión natural
      d.normalize();
      const end = start.clone().addScaledVector(d, len);
      const r = (f === 1 ? 0.42 : 0.36) * (1 - k * 0.12);
      out[`falange_${segNames[k]}_mano_${f}`] = longBone([start, end], r * 0.75, r * 1.15, k === lens.length - 1 ? r * 0.7 : r);
      start = end.clone().addScaledVector(d, 0.35);
    });
    void names;
  }
  return out;
}

function profile3(a, m, b) {
  return (t) => {
    const w = a + (b - a) * t + (m - (a + b) / 2) * Math.sin(Math.PI * t);
    return [w, w * 0.45];
  };
}

// ---------- Pelvis y miembro inferior ----------
export function legLM(s) {
  const P = (x, y, z) => V(s * x, y, z);
  return {
    asis: P(12.4, 99.6, 5.6),
    aiis: P(10.9, 96.2, 5.0),
    psis: P(4.6, 98.6, -7.2),
    crestTop: P(12.0, 104.4, -1.0),
    crestBack: P(7.4, 103.4, -6.2),
    iliacFossa: P(9.5, 99.5, 0.5),
    hip: P(8.8, 91.4, 2.6),
    pubTub: P(2.4, 88.6, 7.0),
    symph: P(0.6, 87.6, 7.0),
    infRamus: P(3.6, 84.4, 4.2),
    ischTub: P(6.2, 82.6, -1.4),
    ischSpine: P(5.4, 88.2, -3.2),
    gtroch: P(14.0, 90.4, 0.8),
    ltroch: P(10.9, 85.8, 0.4),
    femMid: P(11.8, 70, 2.2),
    linAspera: P(11.6, 70, 0.6),
    medCond: P(7.9, 50.6, 0.6),
    latCond: P(11.4, 50.8, 0.6),
    medEpiF: P(7.2, 51.6, 0.6),
    latEpiF: P(12.2, 51.6, 0.6),
    adductorTub: P(7.4, 53.2, 0.4),
    patella: P(9.7, 51.2, 4.6),
    tibPlat: P(9.6, 47.6, 1.2),
    tibTub: P(9.8, 44.6, 3.6),
    tibMedCond: P(7.6, 47.4, 1.2),
    tibLatCond: P(11.6, 47.4, 1.0),
    fibHead: P(12.7, 45.4, -0.4),
    tibMid: P(9.3, 28, 1.2),
    medMall: P(7.4, 7.0, 0.6),
    latMall: P(11.9, 6.2, -0.6),
    ankle: P(9.6, 6.0, 0.6),
  };
}

// Sistema local del pie: u lateral, y altura, f hacia delante.
export function footP(s) {
  const a = 0.16;
  const b = Math.sqrt(1 - a * a);
  const fwd = V(s * a, 0, b);
  const lat = V(s * b, 0, -a);
  const o = V(s * 9.6, 0, 0.6);
  return (u, y, f) => o.clone().addScaledVector(lat, u).addScaledVector(fwd, f).setY(y);
}

const TOES = { 1: [-1.9, [2.8, 2.2]], 2: [-0.6, [2.0, 1.0, 0.8]], 3: [0.7, [1.7, 0.9, 0.7]], 4: [1.9, [1.5, 0.8, 0.7]], 5: [3.1, [1.3, 0.7, 0.6]] };
export const MT = {
  1: [[-1.6, 3.2, 6.4], [-1.9, 1.5, 13.0]],
  2: [[-0.4, 3.6, 6.6], [-0.6, 1.3, 13.6]],
  3: [[0.6, 3.4, 6.6], [0.7, 1.2, 13.0]],
  4: [[1.5, 3.1, 6.4], [1.9, 1.1, 12.2]],
  5: [[2.4, 2.6, 5.8], [3.1, 1.0, 11.4]],
};

function legBones(s) {
  const Lm = legLM(s);
  const P = (x, y, z) => V(s * x, y, z);
  const out = {};
  // ala ilíaca: superficie entre la cresta y la línea arqueada/escotadura ciática
  const crest = [[12.4, 99.6, 5.6], [13.6, 102.6, 3.0], [13.4, 104.3, -0.5], [11.6, 104.6, -3.4], [9.0, 103.8, -5.6], [6.6, 102.0, -6.8], [4.8, 98.8, -7.0]].map((p) => P(...p));
  const base = [[10.8, 95.2, 4.6], [10.4, 93.6, 3.0], [10.2, 93.0, 1.2], [9.6, 93.0, -0.6], [8.4, 93.4, -2.6], [6.6, 94.6, -4.4], [5.0, 96.4, -5.8]].map((p) => P(...p));
  const ilium = surface((a, t) => along(base, a).lerp(along(crest, a), t).add(V(s * 0.7 * Math.sin(Math.PI * t) * Math.sin(Math.PI * a), 0, 0)), 24, 10);
  out.coxal = merge([
    ilium,
    rod([P(9.6, 96.5, -0.5), P(9.6, 93.5, 1.4)], 1.6, 1.6),
    cup(Lm.hip, 2.7, V(s * 1, -0.5, 0.45), 100),
    rod([P(8.0, 91.6, 4.4), P(4.8, 89.8, 6.2), Lm.symph], 0.9, 0.85), // rama superior del pubis
    ellipsoid(P(1.4, 87.2, 6.8), [0.9, 1.6, 0.9]),
    rod([P(1.2, 86.0, 6.4), Lm.infRamus, P(5.4, 83.4, 1.4), Lm.ischTub], 0.65, 0.8), // rama isquiopubiana
    rod([P(8.4, 89.6, 0.0), P(7.2, 86.4, -1.2), Lm.ischTub], 1.3, 1.0),
    ellipsoid(Lm.ischTub, [1.0, 1.4, 1.1]),
    rod([P(6.6, 90.0, -2.2), Lm.ischSpine], 0.5, 0.25),
  ]);
  out.femur = merge([
    ellipsoid(Lm.hip, [2.35, 2.35, 2.35]),
    rod([Lm.hip, P(11.6, 90.0, 1.8), P(12.8, 89.4, 1.2)], 1.5, 1.6, 1.4),
    ellipsoid(Lm.gtroch, [1.6, 2.2, 1.7]),
    ellipsoid(Lm.ltroch, [0.8, 0.9, 0.8]),
    longBone([P(13.2, 89.6, 0.9), P(12.6, 80, 1.8), Lm.femMid, P(10.6, 58, 1.6), P(9.7, 53.0, 0.9)], 1.45, 1.9, 2.4),
    ellipsoid(Lm.medCond, [1.8, 2.3, 2.8]),
    ellipsoid(Lm.latCond, [1.8, 2.2, 2.8]),
  ]);
  out.rotula = ellipsoid(Lm.patella, [2.1, 2.5, 0.9]);
  out.tibia = merge([
    ellipsoid(Lm.tibPlat, [3.6, 1.4, 2.6]),
    ellipsoid(Lm.tibTub, [0.9, 1.2, 0.7]),
    longBone([P(9.5, 46.6, 1.6), P(9.4, 38, 1.4), Lm.tibMid, P(9.0, 16, 0.8), P(8.9, 9.0, 0.5)], 1.3, 2.0, 1.7, { flat: 0.95 }),
    ellipsoid(P(8.9, 8.4, 0.6), [2.0, 1.1, 1.8]),
    ellipsoid(Lm.medMall, [0.7, 1.5, 0.9]),
  ]);
  out.perone = merge([
    ellipsoid(Lm.fibHead, [1.0, 1.0, 1.0]),
    longBone([Lm.fibHead, P(12.6, 35, -0.6), P(12.2, 18, -0.8), Lm.latMall], 0.55, 0.8, 0.7),
    ellipsoid(Lm.latMall, [0.8, 1.8, 0.9]),
  ]);
  // pie
  const F = footP(s);
  const fwd = F(0, 0, 1).sub(F(0, 0, 0));
  const tarsals = {
    astragalo: [[0, 5.0, 0.6], [1.6, 1.1, 2.3]],
    calcaneo: [[0.4, 2.6, -2.6], [1.6, 1.8, 3.6]],
    navicular: [[-0.9, 4.0, 3.5], [1.4, 0.9, 0.7]],
    cuboides: [[1.7, 2.6, 4.4], [1.1, 1.0, 1.3]],
    cuneiforme_medial: [[-1.6, 3.2, 5.3], [0.75, 1.1, 0.9]],
    cuneiforme_intermedio: [[-0.4, 3.7, 5.2], [0.6, 0.9, 0.75]],
    cuneiforme_lateral: [[0.6, 3.5, 5.3], [0.6, 0.9, 0.85]],
  };
  for (const [k, [c, r]] of Object.entries(tarsals)) {
    const g = ellipsoid([0, 0, 0], [r[0], r[1], r[2]], null, 14);
    const q = new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), fwd.clone().normalize());
    g.applyQuaternion(q);
    g.translate(...F(...c).toArray());
    out[k] = g;
  }
  for (const n of [1, 2, 3, 4, 5]) {
    const [b, h] = MT[n];
    const bp = F(...b);
    const hp = F(...h);
    out['metatarsiano_' + n] = longBone([bp, hp], n === 1 ? 0.55 : 0.35, n === 1 ? 0.8 : 0.5, n === 1 ? 0.75 : 0.45);
    const [u0, lens] = TOES[n];
    const segNames = n === 1 ? ['proximal', 'distal'] : ['proximal', 'media', 'distal'];
    let st = F(u0 + (n - 3) * 0.08, 1.1, h[2] + 0.6);
    lens.forEach((len, k) => {
      const end = st.clone().addScaledVector(fwd, len);
      end.y -= 0.12 * (k + 1);
      const r = (n === 1 ? 0.55 : 0.32) * (1 - k * 0.12);
      out[`falange_${segNames[k]}_pie_${n}`] = longBone([st, end], r * 0.75, r * 1.15, r * 0.9);
      st = end.clone().addScaledVector(fwd, 0.25);
    });
  }
  return out;
}

// ---------- Cráneo ----------
const SK_C = [0, 164.6, -1.4];
const SK_R = [7.3, 8.6, 9.8];
export const skullLM = {
  center: V(...SK_C),
  vertex: V(0, 173.2, -1.4),
  inion: V(0, 160.6, -10.6),
  mastoid: (s) => V(s * 5.6, 157.2, -3.4),
  temporalFossa: (s) => V(s * 6.8, 165.0, 0.6),
  zygArch: (s) => V(s * 6.4, 158.6, 2.2),
  coronoid: (s) => V(s * 5.0, 156.0, 2.0),
  angle: (s) => V(s * 5.0, 151.2, -0.6),
  condyle: (s) => V(s * 5.4, 157.4, -1.0),
  chin: V(0, 150.6, 7.6),
  sup_nuchal: (s) => V(s * 3.5, 160.0, -10.0),
};

function skullBones() {
  const out = {};
  const sp = (u0, u1, v0, v1, seg) => skullPatch(SK_C, SK_R, u0, u1, v0, v1, 0.6, seg);
  out.frontal = merge([sp(-28, 68, -56, 56, 24), rod([V(-5.6, 160.4, 6.2), V(-2.8, 161.2, 8.0), V(0, 161.0, 8.6), V(2.8, 161.2, 8.0), V(5.6, 160.4, 6.2)], 0.55, 0.55, 0.7)]);
  out.occipital = sp(147, 236, -58, 58, 22);
  out.esfenoides = merge([sp(-25, 41, 57, 88, 10), sp(-25, 41, -88, -57, 10), ellipsoid([0, 158.6, -0.2], [5.6, 1.5, 6.0])]);
  for (const { s, key } of SIDES) {
    out['parietal_' + key] = s > 0 ? sp(70, 145, 3, 55, 18) : sp(70, 145, -55, -3, 18);
    out['temporal_' + key] = merge([
      s > 0 ? sp(42, 228, 57, 88, 18) : sp(42, 228, -88, -57, 18),
      ellipsoid(skullLM.mastoid(s), [0.9, 1.5, 1.0]),
      rod([V(s * 6.6, 158.8, -0.8), V(s * 6.9, 158.8, 1.2)], 0.45, 0.4),
    ]);
    out['cigomatico_' + key] = merge([
      ellipsoid([s * 5.0, 158.4, 5.0], [1.3, 1.8, 2.0], [0.0, 1, 0.3]),
      rod([V(s * 5.7, 158.6, 3.6), V(s * 6.7, 158.7, 1.4)], 0.5, 0.45),
      rod([V(s * 5.2, 159.6, 5.4), V(s * 5.8, 161.4, 5.0)], 0.4, 0.35),
    ]);
    out['maxilar_' + key] = merge([
      ellipsoid([s * 2.5, 155.8, 5.2], [2.1, 2.6, 2.6]),
      ellipsoid([s * 1.5, 153.5, 6.6], [1.4, 0.9, 1.2]),
      rod([V(s * 1.0, 157.6, 7.6), V(s * 1.3, 159.8, 7.6), V(s * 1.5, 161.0, 7.6)], 0.45, 0.35),
      rod([V(s * 1.6, 158.0, 7.3), V(s * 3.4, 157.9, 7.0), V(s * 4.8, 158.3, 6.0)], 0.4, 0.45),
    ]);
    out['nasal_' + key] = sweep([V(s * 0.45, 160.6, 8.2), V(s * 0.65, 159.0, 8.9), V(s * 0.9, 157.8, 9.4)], [0.45, 0.15], { out: V(s, 0, 1) });
  }
  // mandíbula: herradura (cuerpo) + ramas
  const L = skullLM;
  const mPath = [L.condyle(-1), V(-5.2, 154.0, -0.4), L.angle(-1), V(-4.0, 150.4, 3.0), V(-2.0, 150.2, 6.4), L.chin, V(2.0, 150.2, 6.4), V(4.0, 150.4, 3.0), L.angle(1), V(5.2, 154.0, -0.4), L.condyle(1)];
  const radial = (p) => V(p.x, 0, p.z - 1.5);
  out.mandibula = merge([
    sweep(mPath, (t) => {
      const e = Math.min(t, 1 - t);
      const h = e < 0.12 ? 0.9 + e * 4 : 1.45;
      return [h, 0.45];
    }, { out: radial, segs: 80 }),
    rod([V(-5.0, 154.0, 0.4), L.coronoid(-1)], 0.4, 0.3),
    rod([V(5.0, 154.0, 0.4), L.coronoid(1)], 0.4, 0.3),
    ellipsoid(L.condyle(-1), [0.8, 0.5, 0.5]),
    ellipsoid(L.condyle(1), [0.8, 0.5, 0.5]),
  ]);
  out.hioides = rod([V(-2.3, 147.6, 1.6), V(-1.4, 147.4, 3.6), V(0, 147.3, 4.2), V(1.4, 147.4, 3.6), V(2.3, 147.6, 1.6)], 0.3, 0.3, 0.38);
  return out;
}

// Dientes (decorativos, no seleccionables)
export function buildTeeth() {
  const g = [];
  for (const s of [-1, 1]) {
    for (let k = 0; k < 7; k++) {
      const a = (k / 7) * 1.25;
      const x = s * (0.45 + Math.sin(a) * 2.5);
      const z = 7.2 - (1 - Math.cos(a)) * 3.6;
      g.push(ellipsoid([x, 152.7, z], [0.36, 0.5, 0.36], null, 8));
      g.push(ellipsoid([x * 0.97, 151.9, z - 0.1], [0.34, 0.48, 0.34], null, 8));
    }
  }
  return merge(g);
}

// Fondo oscuro de las órbitas y fosas nasales
export function buildCavities() {
  const g = [];
  for (const s of [-1, 1]) g.push(ellipsoid([s * 3.1, 160.0, 5.6], [1.75, 1.6, 1.5]));
  g.push(ellipsoid([0, 157.6, 7.4], [0.9, 1.4, 1.0]));
  return merge(g);
}

export function buildSkeleton() {
  const parts = []; // {key, id, side, geo}
  const add = (id, side, geo) => parts.push({ key: side ? `${id}_${side}` : id, id, side, geo });
  const sk = skullBones();
  for (const [k, g] of Object.entries(sk)) {
    const m = k.match(/^(.*)_(d|i)$/);
    if (m) add(m[1], m[2], g);
    else add(k, null, g);
  }
  SPINE.forEach((_, i) => add(SPINE[i][0], null, buildVertebra(i)));
  // sacro y cóccix
  add('sacro', null, merge([
    sweep([V(0, 98.6, -1.8), V(0, 95.5, -3.4), V(0, 92, -5.0), V(0, 89.0, -6.2)], (t) => [5.4 - t * 4.0, 1.0 - t * 0.4], { out: V(0, 0.45, 1) }),
    ellipsoid([0, 98.3, -1.6], [2.4, 0.7, 1.7]),
    rod([V(0, 97.5, -4.4), V(0, 92, -6.6), V(0, 89.5, -7.2)], 0.35, 0.3),
  ]));
  add('coccix', null, rod([V(0, 88.6, -6.4), V(0, 87.2, -6.4), V(0, 86.0, -5.6)], 0.6, 0.3));
  // esternón
  add('esternon', null, merge([
    plate([sternumPoint(141.2, -2.6), sternumPoint(141.4, 0), sternumPoint(141.2, 2.6), sternumPoint(138.5, 2.2), sternumPoint(136.6, 1.6), sternumPoint(136.6, -1.6), sternumPoint(138.5, -2.2)], 0.9),
    plate([sternumPoint(136.3, -1.5), sternumPoint(136.3, 1.5), sternumPoint(129, 1.6), sternumPoint(124, 1.8), sternumPoint(122.2, 1.3), sternumPoint(122.2, -1.3), sternumPoint(124, -1.8), sternumPoint(129, -1.6)], 0.8),
    plate([sternumPoint(122.0, -0.9), sternumPoint(122.0, 0.9), sternumPoint(119.6, 0.4), sternumPoint(118.6, 0), sternumPoint(119.6, -0.4)], 0.5),
  ]));
  for (const { s, key } of SIDES) {
    for (let n = 1; n <= 12; n++) {
      const path = ribPath(n, s);
      const rad = n === 1 ? [0.75, 0.32] : [0.62, 0.3];
      add('costilla_' + n, key, sweep(path, (t) => [rad[0] * (t < 0.08 ? 0.75 : 1), rad[1]], { out: (p) => V(p.x, 0, p.z - 1.5), segs: 40, radial: 10 }));
    }
    for (const [k, g] of Object.entries(armBones(s))) add(k, key, g);
    for (const [k, g] of Object.entries(legBones(s))) add(k, key, g);
  }
  return parts;
}

// Cartílagos (discos, costales): visibles junto al esqueleto, no seleccionables
export function buildCartilage() {
  const g = [];
  for (let i = 1; i < SPINE.length; i++) {
    const a = SPINE[i - 1];
    const b = SPINE[i];
    if (i === 1) continue;
    const p = vertParams(b[0]);
    const c = V(0, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
    const d = new THREE.CylinderGeometry(1, 1, Math.max(0.3, a[1] - b[1] - p.bh - 0.05), 16);
    d.scale(p.bw * 0.97, 1, p.bd * 0.97);
    d.translate(c.x, c.y, c.z);
    g.push(d);
  }
  g.push(ellipsoid([0, 99.4, -1.3], [2.3, 0.45, 1.6]));
  for (const { s } of SIDES) for (let n = 1; n <= 10; n++) g.push(costalCartilage(n, s));
  return merge(g);
}
