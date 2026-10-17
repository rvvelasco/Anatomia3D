import * as THREE from 'three';
import { OrbitControls } from '../vendor/OrbitControls.js';
import { buildSkeleton, buildCartilage, buildTeeth, buildCavities } from './model/skeleton.js';
import { buildMuscles } from './model/muscles.js';
import { muscleMaterial, boneMaterial, setupEnvironment } from './materials.js';
import { BONES } from './data/bones.js';
import { MUSCLES } from './data/muscles.js';
import { LESSONS } from './data/lessons.js';
import { NERVES } from './data/nerves.js';

// ===========================================================================
// Utilidades
// ===========================================================================
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const isMobile = () => window.matchMedia('(max-width: 860px)').matches;
// hoja inferior solo en móvil vertical; en horizontal la ficha va a la derecha
const isBottomSheet = () => window.matchMedia('(max-width: 860px) and (orientation: portrait)').matches;
const shuffle = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];

// Primera frase de un texto (para los resúmenes).
function firstSentence(s) {
  const t = String(s ?? '').trim();
  const m = t.match(/^(.*?[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿"(])/);
  return m ? m[1] : t;
}
// Versión corta: hasta el primer paréntesis, punto y coma o punto.
function shortTxt(s) {
  const t = String(s ?? '').trim();
  const cut = t.split(/\s*[(;]|\.\s/)[0].replace(/\.$/, '').trim();
  return cut.length >= 6 ? cut : firstSentence(t);
}

const store = {
  get(k, d) {
    try {
      const v = localStorage.getItem('anatomia3d.' + k);
      return v == null ? d : JSON.parse(v);
    } catch {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem('anatomia3d.' + k, JSON.stringify(v));
    } catch {
      /* almacenamiento no disponible */
    }
  },
};

// ===========================================================================
// Datos
// ===========================================================================
const REGIONS = {
  cabeza: 'Cabeza',
  cuello: 'Cuello',
  torax: 'Tórax',
  abdomen: 'Abdomen y pelvis',
  espalda: 'Espalda',
  miembro_superior: 'Miembro superior',
  miembro_inferior: 'Miembro inferior',
};
const DEFAULT_GROUP = { cabeza: 'Cráneo y cara', cuello: 'Cuello', torax: 'Tórax', abdomen: 'Pelvis', espalda: 'Espalda', miembro_superior: 'Miembro superior', miembro_inferior: 'Miembro inferior' };
const CAPAS = { 1: 'Superficial', 2: 'Intermedia', 3: 'Profunda' };
const SIDE_NAME = { d: 'derecho', i: 'izquierdo' };
const COL = {
  bone: new THREE.Color('#e9dfc6'),
  s: new THREE.Color('#f0a63a'),
  o: new THREE.Color('#3ccf7e'),
  i: new THREE.Color('#4e9bff'),
  b: new THREE.Color('#ffd35a'),
  a: new THREE.Color('#b083ff'),
  l: new THREE.Color('#e8c48f'),
};
const CSS_COL = { s: 'var(--accent)', o: 'var(--orig)', i: 'var(--ins)', b: 'var(--both)', a: 'var(--art)', l: 'var(--les)' };

const S = {}; // id -> { id, tipo, d, meshes }
for (const [id, d] of Object.entries(BONES)) S[id] = { id, tipo: 'hueso', d, meshes: [] };
for (const [id, d] of Object.entries(MUSCLES)) S[id] = { id, tipo: 'musculo', d, meshes: [] };
for (const b of Object.values(BONES)) {
  b.musOrigen = [];
  b.musInsercion = [];
}
for (const [mid, m] of Object.entries(MUSCLES)) {
  for (const b of new Set(m.oh)) BONES[b]?.musOrigen.push(mid);
  for (const b of new Set(m.ih)) BONES[b]?.musInsercion.push(mid);
}
const groupOf = (e) => e.d.grupo || DEFAULT_GROUP[e.d.region] || 'Otros';

// Nervios -> músculos
const NERVE = Object.fromEntries(NERVES.map((n) => [n.id, n]));
const nervesOf = {};
for (const n of NERVES) {
  n.musculos = Object.keys(MUSCLES).filter((mid) => n.patron.test(norm(MUSCLES[mid].inervacion)));
  for (const mid of n.musculos) (nervesOf[mid] ||= []).push(n.id);
}
// Lecciones en las que aparece cada estructura
const LESSON = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
const lessonsOf = {};
for (const l of LESSONS) {
  l.ids = [...new Set(l.pasos.flatMap((p) => p.ids))];
  for (const id of l.ids) (lessonsOf[id] ||= []).push(l.id);
}

// ===========================================================================
// Escena 3D
// ===========================================================================
const canvas = $('#canvas');
const stage = $('#stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const scene = new THREE.Scene();
setupEnvironment(renderer, scene);
const camera = new THREE.PerspectiveCamera(32, 1, 1, 3000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.12;
controls.minDistance = 12;
controls.maxDistance = 700;
controls.autoRotateSpeed = 1.2;
const HOME = { t: new THREE.Vector3(0, 90, 0), p: new THREE.Vector3(0, 100, 390) };
controls.target.copy(HOME.t);
camera.position.copy(HOME.p);

const allMeshes = [];
const auxMeshes = [];
let needsRender = true;

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

function addPart(p, tipo) {
  const e = S[p.id];
  if (!e) return;
  const h = hash(p.id);
  const base = tipo === 'hueso'
    ? COL.bone.clone().offsetHSL(0, 0, (h - 0.5) * 0.04)
    : new THREE.Color().setHSL((0.988 + h * 0.03) % 1, 0.6 + h * 0.06, 0.33 + ((h * 7) % 1) * 0.06);
  const mat = tipo === 'hueso' ? boneMaterial(base.clone()) : muscleMaterial(base.clone());
  mat.clippingPlanes = [clipPlane];
  const mesh = new THREE.Mesh(p.geo, mat);
  p.geo.computeBoundingSphere();
  mesh.userData = { id: p.id, side: p.side, key: p.key, tipo, base };
  e.meshes.push(mesh);
  allMeshes.push(mesh);
  scene.add(mesh);
}

function buildModel() {
  for (const p of buildSkeleton()) addPart(p, 'hueso');
  for (const p of buildMuscles()) addPart(p, 'musculo');
  const cart = new THREE.Mesh(buildCartilage(), new THREE.MeshStandardMaterial({ color: '#a9cbe0', roughness: 0.35 }));
  const teeth = new THREE.Mesh(buildTeeth(), new THREE.MeshStandardMaterial({ color: '#fbf8ef', roughness: 0.3 }));
  const cav = new THREE.Mesh(buildCavities(), new THREE.MeshStandardMaterial({ color: '#2a1d1a', roughness: 1 }));
  cart.userData.cart = true;
  teeth.userData.cart = true;
  for (const m of [cart, teeth, cav]) {
    m.material.clippingPlanes = [clipPlane];
    auxMeshes.push(m);
    scene.add(m);
  }
}

// ===========================================================================
// Estado
// ===========================================================================
const state = {
  mode: 'idle', // idle | welcome | structure | nerve | lesson | study
  type: 'todo',
  region: null,
  isolateRegion: false,
  showBones: true,
  showMuscles: true,
  showCart: true,
  labels: true,
  depth: 1,
  opacity: 1,
  side: 'ambos',
  dim: true,
  sel: null, // { id, side }
  nerve: null,
  lesson: null, // { id, step }
  tab: 'resumen',
  hover: null,
  hidden: new Set(),
  isolate: null, // Set<Mesh>
  seen: new Set(store.get('seen', [])),
  favs: new Set(store.get('favs', [])),
  cut: 'none',
  cutPos: 0.5,
  cutFlip: false,
};

function meshVisible(m) {
  const u = m.userData;
  const e = S[u.id];
  if (u.tipo === 'hueso' && !state.showBones) return false;
  if (u.tipo === 'musculo') {
    if (!state.showMuscles) return false;
    if (e.d.capa < state.depth) return false;
  }
  if (state.side !== 'ambos' && u.side && u.side !== state.side) return false;
  if (state.isolateRegion && state.region && e.d.region !== state.region) return false;
  if (state.hidden.has(u.key)) return false;
  if (state.isolate && !state.isolate.has(m)) return false;
  return true;
}

function applyVisibility() {
  for (const m of allMeshes) m.visible = meshVisible(m);
  const showAux = state.showBones && !state.isolate && !(state.isolateRegion && state.region);
  for (const m of auxMeshes) m.visible = showAux && (!m.userData.cart || state.showCart);
  applyColors();
}

const sideMatch = (sel, m) => !sel.side || !m.userData.side || m.userData.side === sel.side;

function structureRoles(sel) {
  const roles = new Map();
  if (!sel) return roles;
  const e = S[sel.id];
  const put = (id, r) => {
    for (const m of S[id]?.meshes || []) {
      if (!sideMatch(sel, m)) continue;
      const prev = roles.get(m);
      if (prev === 's') continue;
      if (prev && prev !== r && (prev === 'o' || prev === 'i') && (r === 'o' || r === 'i')) roles.set(m, 'b');
      else if (!prev) roles.set(m, r);
    }
  };
  for (const m of e.meshes) if (sideMatch(sel, m)) roles.set(m, 's');
  if (e.tipo === 'musculo') {
    e.d.oh.forEach((b) => put(b, 'o'));
    e.d.ih.forEach((b) => put(b, 'i'));
  } else {
    e.d.musOrigen.forEach((mm) => put(mm, 'o'));
    e.d.musInsercion.forEach((mm) => put(mm, 'i'));
    e.d.articulaciones.forEach(([b]) => {
      if (b === sel.id) {
        for (const m of e.meshes) if (!roles.has(m)) roles.set(m, 'a');
      } else put(b, 'a');
    });
  }
  return roles;
}

function lessonMeshes(l, ids) {
  const out = [];
  for (const id of ids) for (const m of S[id]?.meshes || []) if (!l.lado || !m.userData.side || m.userData.side === l.lado) out.push(m);
  return out;
}

function computeRoles() {
  const r = new Map();
  if (state.mode === 'structure') return structureRoles(state.sel);
  if (state.mode === 'nerve' && state.nerve) {
    for (const mid of NERVE[state.nerve].musculos) for (const m of S[mid].meshes) r.set(m, 's');
  }
  if (state.mode === 'lesson' && state.lesson) {
    const l = LESSON[state.lesson.id];
    for (const m of lessonMeshes(l, l.ids)) r.set(m, 'l');
    for (const m of lessonMeshes(l, l.pasos[state.lesson.step].ids)) r.set(m, 's');
  }
  if (state.mode === 'study' && quiz.target && (qm() !== 'loc' || quiz.answered)) r.set(quiz.target, 's');
  return r;
}

let roles = new Map();
const HOVER_ADD = new THREE.Color(0x262626);
const GHOST = new THREE.Color('#9aa3b2');
function applyColors() {
  roles = computeRoles();
  const dimming = state.dim && roles.size > 0;
  for (const m of allMeshes) {
    const u = m.userData;
    const mat = m.material;
    const r = roles.get(m);
    mat.color.copy(u.base);
    mat.emissive.setRGB(0, 0, 0);
    let op = u.tipo === 'musculo' ? state.opacity : 1;
    if (r) {
      const c = COL[r];
      const strong = r === 's';
      mat.color.lerp(c, strong ? 0.5 : r === 'l' ? 0.25 : 0.55);
      mat.emissive.copy(c).multiplyScalar(strong ? 0.22 : r === 'l' ? 0.05 : 0.13);
      op = 1;
    } else if (dimming) {
      // "fantasma": los no seleccionados se vuelven tenues y menos saturados
      mat.color.lerp(GHOST, u.tipo === 'hueso' ? 0.2 : 0.45);
      op = Math.min(op, u.tipo === 'hueso' ? 0.3 : 0.06);
    }
    if (state.hover === m && state.mode !== 'study') mat.emissive.add(HOVER_ADD);
    mat.opacity = op;
    mat.transparent = op < 0.999;
    mat.depthWrite = op > 0.5;
  }
  needsRender = true;
  renderLegend();
  rebuildLabels();
}

function renderLegend() {
  const lg = $('#legend');
  let html = '';
  if (state.mode === 'structure' && state.sel) {
    const e = S[state.sel.id];
    html = e.tipo === 'musculo'
      ? '<span><i class="sw sw-s"></i>Músculo</span><span><i class="sw sw-o"></i>Origen</span><span><i class="sw sw-i"></i>Inserción</span>'
      : '<span><i class="sw sw-s"></i>Hueso</span><span><i class="sw sw-o"></i>Se originan</span><span><i class="sw sw-i"></i>Se insertan</span><span><i class="sw sw-a"></i>Articula</span>';
  } else if (state.mode === 'lesson') html = '<span><i class="sw sw-s"></i>Este paso</span><span><i class="sw sw-l"></i>Resto de la lección</span>';
  else if (state.mode === 'nerve') html = '<span><i class="sw sw-s"></i>Músculos que inerva</span>';
  lg.innerHTML = html;
  lg.hidden = !html;
}

// ---------------------------------------------------------------------------
// Etiquetas 3D
// ---------------------------------------------------------------------------
const labelsBox = $('#labels');
let labelItems = []; // { el, pos: Vector3 }
const ROLE_ORDER = { s: 0, o: 1, i: 1, b: 1, a: 2, l: 3 };
function rebuildLabels() {
  labelsBox.innerHTML = '';
  labelItems = [];
  if (!state.labels || !roles.size) return;
  if (state.mode === 'study' && !quiz.answered) return; // no revelar la respuesta
  const seen = new Set();
  // solo se etiqueta lo esencial para no saturar: la selección y sus conexiones directas
  const sel = state.mode === 'structure' && state.sel ? S[state.sel.id] : null;
  const wanted = (m, r) => {
    if (r === 's') return true;
    if (state.mode === 'lesson' || state.mode === 'nerve' || state.mode === 'study') return false;
    if (sel?.tipo === 'hueso') return r === 'a';
    return true;
  };
  const list = [...roles.entries()]
    .filter(([m, r]) => m.visible && wanted(m, r))
    .sort((a, b) => ROLE_ORDER[a[1]] - ROLE_ORDER[b[1]]);
  const max = isMobile() ? 7 : 12;
  for (const [m, r] of list) {
    const k = m.userData.id + (m.userData.side || '');
    if (seen.has(k) || labelItems.length >= max) continue;
    // en estructuras bilaterales seleccionadas en ambos lados, una etiqueta basta
    const twin = m.userData.id + (m.userData.side === 'd' ? 'i' : 'd');
    if (seen.has(twin)) continue;
    seen.add(k);
    const el = document.createElement('div');
    el.className = 'lbl' + (r === 's' ? ' main' : '');
    el.style.setProperty('--c', CSS_COL[r]);
    el.textContent = S[m.userData.id].d.nombre;
    el.dataset.id = m.userData.id;
    el.dataset.side = m.userData.side || '';
    labelsBox.appendChild(el);
    labelItems.push({ el, pos: m.geometry.boundingSphere.center.clone() });
  }
}
const _v = new THREE.Vector3();
function positionLabels() {
  if (!labelItems.length) return;
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  const placed = [];
  for (const it of labelItems) {
    _v.copy(it.pos).project(camera);
    const off = _v.z > 1 || Math.abs(_v.x) > 1.1 || Math.abs(_v.y) > 1.1;
    it.el.style.display = off ? 'none' : '';
    if (off) continue;
    const x = ((_v.x + 1) / 2) * w;
    let y = ((1 - _v.y) / 2) * h;
    const half = (it.el.offsetWidth || 100) / 2;
    // evita que las etiquetas se pisen: se desplazan hacia abajo
    for (let k = 0; k < 12; k++) {
      const hit = placed.find((p) => Math.abs(p.y - y) < 22 && Math.abs(p.x - x) < p.half + half + 4);
      if (!hit) break;
      y = hit.y + 23;
    }
    placed.push({ x, y, half });
    it.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  }
}
labelsBox.addEventListener('click', (ev) => {
  const l = ev.target.closest('.lbl');
  if (l) selectStructure(l.dataset.id, l.dataset.side || null, { focus: true });
});

// ===========================================================================
// Cámara
// ===========================================================================
let tween = null;
function animateCamera(target, position, ms = 700) {
  tween = { t0: performance.now(), ms, fromT: controls.target.clone(), toT: target.clone(), fromP: camera.position.clone(), toP: position.clone() };
}
function focusMeshes(meshes, dirOverride = null, pad = 1.4) {
  const vis = meshes.filter((m) => m.visible);
  const list = vis.length ? vis : meshes;
  if (!list.length) return;
  const box = new THREE.Box3();
  list.forEach((m) => box.expandByObject(m));
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const r = Math.max(sphere.radius, 4);
  const vf = THREE.MathUtils.degToRad(camera.fov / 2);
  const hf = Math.atan(Math.tan(vf) * camera.aspect);
  const dist = (r / Math.sin(Math.min(vf, hf))) * pad;
  let dir = dirOverride || camera.position.clone().sub(controls.target).normalize();
  if (!dirOverride) {
    // mira la estructura desde el lado del cuerpo en que se encuentra
    const c = sphere.center;
    const radial = new THREE.Vector3(c.x, 0, c.z - 1);
    if (radial.length() > 2.5) {
      radial.normalize();
      if (radial.z > -0.35) radial.z += 0.6;
      dir = radial.add(new THREE.Vector3(0, 0.12, 0)).normalize();
    }
  }
  const D = Math.min(Math.max(dist, 30), 600);
  const target = sphere.center.clone();
  // en móvil la hoja inferior tapa parte de la pantalla: se sube el objeto al hueco visible
  if (isBottomSheet() && document.body.classList.contains('sheet-open')) {
    const peek = parseFloat(getComputedStyle(document.body).getPropertyValue('--peek')) || 200;
    const H = stage.clientHeight;
    const visH = 2 * D * Math.tan(vf);
    const up = new THREE.Vector3(0, 1, 0).sub(dir.clone().multiplyScalar(dir.y)).normalize();
    target.addScaledVector(up, -((peek / 2) / H) * visH);
  }
  animateCamera(target, target.clone().addScaledVector(dir, D));
}
function setView(v) {
  if (v === 'fit') return focusMeshes(allMeshes.filter((m) => m.visible), new THREE.Vector3(0, 0.05, 1).normalize(), 1.15);
  const t = controls.target.clone();
  const d = Math.max(camera.position.distanceTo(t), 60);
  const dirs = { front: [0, 0.05, 1], back: [0, 0.05, -1], right: [-1, 0.05, 0], left: [1, 0.05, 0], top: [0, 1, 0.08] };
  animateCamera(t, t.clone().add(new THREE.Vector3(...dirs[v]).normalize().multiplyScalar(d)));
}

// ===========================================================================
// Hoja de información (panel derecho / hoja inferior en móvil)
// ===========================================================================
const sheetBody = $('#sheetBody');
function openSheet(full = false) {
  // en pantallas medianas se pliega el panel lateral para dejar sitio al modelo
  if (!isMobile() && window.innerWidth < 1200 && !document.body.classList.contains('side-closed')) {
    document.body.classList.add('side-closed', 'side-auto');
  }
  document.body.classList.add('sheet-open');
  document.body.classList.toggle('sheet-full', full);
  requestAnimationFrame(updatePeek);
}
function closeSheet() {
  document.body.classList.remove('sheet-open', 'sheet-full');
  if (document.body.classList.contains('side-auto')) document.body.classList.remove('side-closed', 'side-auto');
}
function updatePeek() {
  const marker = sheetBody.querySelector('.peek-end');
  if (!marker) return;
  const top = marker.getBoundingClientRect().top - $('#sheet').getBoundingClientRect().top + sheetBody.scrollTop;
  const peek = Math.min(Math.max(top + 14, 130), window.innerHeight * 0.62);
  document.body.style.setProperty('--peek', `${peek}px`);
}
window.addEventListener('resize', () => requestAnimationFrame(updatePeek));

function renderSheet() {
  const m = state.mode;
  if (m === 'structure') renderStructure();
  else if (m === 'nerve') renderNerve();
  else if (m === 'lesson') renderLesson();
  else if (m === 'study') renderStudy();
  else if (m === 'welcome') renderWelcome();
  else {
    sheetBody.innerHTML = '';
    closeSheet();
    return;
  }
  if (!document.body.classList.contains('sheet-open')) openSheet(false);
  updatePeek();
}

// Cambia de modo limpiando lo que dejaba el anterior.
function setMode(mode) {
  if (state.mode === 'lesson' && mode !== 'lesson') {
    state.isolate = null;
    state.lesson = null;
  }
  if (state.mode === 'study' && mode !== 'study') {
    quiz.target = null;
    $('#btnStudy').classList.remove('on');
  }
  if (mode !== 'nerve') state.nerve = null;
  if (mode !== 'structure') state.sel = null;
  state.mode = mode;
  $$('#lessonList .card-btn').forEach((b) => b.classList.toggle('on', mode === 'lesson' && b.dataset.lesson === state.lesson?.id));
  $$('#nerveList .card-btn').forEach((b) => b.classList.toggle('on', mode === 'nerve' && b.dataset.nerve === state.nerve));
}

function closeAll() {
  setMode('idle');
  applyVisibility();
  renderSheet();
  updateListSel();
  setHash();
}

// ---------------------------------------------------------------------------
// Ficha de estructura
// ---------------------------------------------------------------------------
function linkBtn(id, cls = '', extra = '') {
  const e = S[id];
  if (!e) return '';
  return `<button class="link ${cls}" data-go="${id}"><span class="dot ${e.tipo}"></span>${esc(e.d.nombre)}${extra ? ` <small>${esc(extra)}</small>` : ''}</button>`;
}
function links(ids, cls = '') {
  const u = [...new Set(ids)].filter((x) => S[x]);
  return u.length ? `<div class="links">${u.map((x) => linkBtn(x, cls)).join('')}</div>` : '<p class="muted">—</p>';
}
const nerveBtn = (nid) => `<button class="link" data-nerve="${nid}"><span class="dot nervio"></span>${esc(NERVE[nid].nombre)}</button>`;
const lessonBtn = (lid) => `<button class="link" data-lesson="${lid}">📘 ${esc(LESSON[lid].titulo)}</button>`;
const qrow = (ico, label, body) => `<div class="qrow"><span class="qico">${ico}</span><div><b>${label}</b>${body}</div></div>`;
const block = (title, body) => `<div class="block"><h3>${title}</h3>${body}</div>`;

function structureHeader(e, side) {
  const d = e.d;
  const sideSeg = d.bilateral
    ? `<div class="seg small side-switch" id="selSide"><button data-sd="" class="${!side ? 'on' : ''}">Ambos</button><button data-sd="d" class="${side === 'd' ? 'on' : ''}">Derecho</button><button data-sd="i" class="${side === 'i' ? 'on' : ''}">Izquierdo</button></div>`
    : '';
  return `<div class="kicker"><span class="dot ${e.tipo}"></span>${e.tipo === 'hueso' ? 'Hueso' : 'Músculo'} · ${esc(REGIONS[d.region])}</div>
    <h2 class="title" data-expand>${esc(d.nombre)}</h2>
    <div class="latin">${esc(d.latin || '')}</div>
    <p class="peek-line">${esc(firstSentence(e.tipo === 'musculo' ? d.accion : d.descripcion))}</p>
    <div class="peek-end"></div>
    <div class="chips"><button class="chip fav ${state.favs.has(e.id) ? 'on' : ''}" data-act="fav" title="Guardar en favoritos para repasar">${state.favs.has(e.id) ? '★ En favoritos' : '☆ Favorito'}</button><span class="chip">${esc(groupOf(e))}</span>${e.tipo === 'musculo' ? `<span class="chip">Capa ${CAPAS[d.capa].toLowerCase()}</span>` : `<span class="chip">${esc(d.clase || '')}</span>`}<span class="chip">${d.bilateral ? 'Par' : 'Impar'}</span>${state.seen.has(e.id) ? '<span class="chip">✓ Vista</span>' : ''}</div>
    ${sideSeg}`;
}

function quickSummary(e, compact = false) {
  const d = e.d;
  if (e.tipo === 'musculo') {
    const ends = (ids, txt, cls) => (ids.length ? `<div class="links">${[...new Set(ids)].slice(0, 4).map((b) => linkBtn(b, cls)).join('')}</div>` : `<p>${esc(shortTxt(txt))}</p>`);
    const flow = `<div class="flow-v"><span class="muted small">Sale de</span>${ends(d.oh, d.origen, 'o')}<span class="muted small">Llega a</span>${ends(d.ih, d.insercion, 'i')}</div>`;
    const nv = nervesOf[e.id] || [];
    return `<div class="quick">
      ${qrow('🎯', 'Qué hace', `<p>${esc(firstSentence(d.accion))}</p>`)}
      ${qrow('🧭', 'De dónde a dónde', flow)}
      ${qrow('⚡', 'Nervio', !compact && nv.length ? `<div class="links">${nv.map(nerveBtn).join('')}</div>` : `<p>${esc(shortTxt(d.inervacion))}</p>`)}
      ${compact ? '' : qrow('🩸', 'Irrigación', `<p>${esc(shortTxt(d.irrigacion))}</p>`)}
    </div>`;
  }
  return `<div class="quick">
    ${qrow('🧩', 'Qué es', `<p>${esc(firstSentence(d.descripcion))}</p>`)}
    ${qrow('🔗', 'Articula con', d.articulaciones.length ? `<div class="links">${[...new Set(d.articulaciones.map((a) => a[0]))].map((b) => linkBtn(b, 'a')).join('')}</div>` : '<p>Ningún hueso: está suspendido por músculos y ligamentos.</p>')}
    ${qrow('💪', 'Músculos que se anclan', `<p>${d.musOrigen.length} se originan · ${d.musInsercion.length} se insertan</p>`)}
  </div>`;
}

function paneHTML(e, tab) {
  const id = e.id;
  const d = e.d;
  let pane = '';
  const anyHidden = state.hidden.size || (state.isolate && state.mode === 'structure');
  if (tab === 'resumen') {
    pane += quickSummary(e);
    const ls = lessonsOf[id] || [];
    if (ls.length) pane += `<div class="tip trick"><b>💡 Para recordar</b>${esc(LESSON[ls[0]].truco)}<div class="links" style="margin-top:8px">${ls.map(lessonBtn).join('')}</div></div>`;
    if (d.clinica) pane += `<div class="tip clin"><b>🩺 Dato clínico</b>${esc(firstSentence(d.clinica))}</div>`;
    pane += `<div class="actions"><button class="btn sm" data-act="focus">🎯 Centrar</button><button class="btn sm" data-act="isolate">🔍 Aislar con conexiones</button><button class="btn sm" data-act="hide">🙈 Ocultar</button><button class="btn sm" data-act="print">🖨 Imprimir ficha</button>${anyHidden ? '<button class="btn sm" data-act="showall">👁 Mostrar todo</button>' : ''}</div>`;
  } else if (tab === 'detalle') {
    if (e.tipo === 'musculo') {
      pane += block('🎯 Acción', `<p>${esc(d.accion)}</p>`);
      pane += block('<span class="sw sw-o"></span> Origen', `<p>${esc(d.origen)}</p>`);
      pane += block('<span class="sw sw-i"></span> Inserción', `<p>${esc(d.insercion)}</p>`);
      pane += block('⚡ Inervación', `<p>${esc(d.inervacion)}</p>`);
      pane += block('🩸 Irrigación', `<p>${esc(d.irrigacion)}</p>`);
      pane += block('🧅 Situación', `<p>${esc(groupOf(e))}. Capa ${CAPAS[d.capa].toLowerCase()}.</p>`);
    } else {
      pane += block('🧩 Descripción', `<p>${esc(d.descripcion)}</p>`);
      if (d.partes?.length) pane += block('📌 Partes y accidentes óseos', `<ul>${d.partes.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`);
      pane += block('🦴 Tipo de hueso', `<p>${esc(d.clase)}</p>`);
    }
  } else if (tab === 'conexiones') {
    if (e.tipo === 'musculo') {
      pane += block('<span class="sw sw-o"></span> Huesos de origen', links(d.oh, 'o'));
      pane += block('<span class="sw sw-i"></span> Huesos de inserción', links(d.ih, 'i'));
      if (d.sinergistas?.length) pane += block('🤝 Sinergistas · trabajan con él', links(d.sinergistas));
      if (d.antagonistas?.length) pane += block('↔️ Antagonistas · hacen lo contrario', links(d.antagonistas));
      const nv = nervesOf[id] || [];
      if (nv.length) {
        const same = [...new Set(nv.flatMap((n) => NERVE[n].musculos))].filter((x) => x !== id);
        pane += block('⚡ Comparten nervio', `<div class="links" style="margin-bottom:6px">${nv.map(nerveBtn).join('')}</div>${links(same.slice(0, 16))}`);
      }
      const grp = Object.values(S).filter((x) => x.tipo === 'musculo' && x.id !== id && groupOf(x) === groupOf(e)).map((x) => x.id);
      if (grp.length) pane += block('🧩 Mismo grupo', links(grp));
    } else {
      pane += block('<span class="sw sw-a"></span> Articulaciones', d.articulaciones.length ? `<div class="links">${d.articulaciones.map(([b, n]) => linkBtn(b, 'a', n)).join('')}</div>` : '<p class="muted">No se articula con ningún hueso.</p>');
      pane += block(`<span class="sw sw-o"></span> Músculos que se originan aquí (${d.musOrigen.length})`, links(d.musOrigen, 'o'));
      pane += block(`<span class="sw sw-i"></span> Músculos que se insertan aquí (${d.musInsercion.length})`, links(d.musInsercion, 'i'));
    }
  } else if (tab === 'clinica') {
    pane += d.clinica ? `<div class="tip clin"><b>🩺 Nota clínica</b>${esc(d.clinica)}</div>` : '<p class="muted">Sin notas clínicas.</p>';
    for (const nid of nervesOf[id] || []) pane += `<div class="tip clin"><b>⚡ Si se lesiona el ${esc(NERVE[nid].nombre.split(' (')[0].toLowerCase())}</b>${esc(NERVE[nid].lesion)}</div>`;
    for (const lid of lessonsOf[id] || []) pane += `<div class="tip trick"><b>💡 ${esc(LESSON[lid].titulo)}</b>${esc(LESSON[lid].truco)}</div>`;
  } else {
    const notes = store.get('notes', {});
    pane += `<p class="muted small" style="margin:0">Escribe tus apuntes, trucos o dudas. Se guardan en este navegador.</p><textarea class="notes" id="notes" placeholder="Ej.: se palpa al apretar los dientes…">${esc(notes[id] || '')}</textarea>`;
  }
  return pane;
}

function renderStructure() {
  const { id, side } = state.sel;
  const e = S[id];
  const tabs = [['resumen', 'Resumen'], ['detalle', 'Detalle'], ['conexiones', 'Conexiones'], ['clinica', 'Clínica'], ['notas', 'Mis notas']];
  const pane = paneHTML(e, state.tab);
  sheetBody.innerHTML = `${structureHeader(e, side)}
    <nav class="ptabs">${tabs.map(([k, v]) => `<button data-tab="${k}" class="${state.tab === k ? 'on' : ''}">${v}</button>`).join('')}</nav>
    <div class="pane">${pane}</div>`;
  sheetBody.scrollTop = 0;
}

// ---------------------------------------------------------------------------
// Ficha de nervio
// ---------------------------------------------------------------------------
function renderNerve() {
  const n = NERVE[state.nerve];
  const byRegion = {};
  for (const mid of n.musculos) (byRegion[MUSCLES[mid].region] ||= []).push(mid);
  sheetBody.innerHTML = `<div class="kicker"><span class="dot nervio"></span>Nervio · ${esc(REGIONS[n.region])}</div>
    <h2 class="title" data-expand>${esc(n.nombre)}</h2>
    <div class="chips"><span class="chip">Raíces: ${esc(n.raices)}</span><span class="chip">${n.musculos.length} músculos</span></div>
    <div class="peek-end"></div>
    <div class="pane">
      ${block('⚡ Qué inerva', `<p>${esc(n.desc)}</p>`)}
      <div class="tip clin"><b>🩺 Si se lesiona</b>${esc(n.lesion)}</div>
      ${Object.entries(byRegion).map(([r, ids]) => block(esc(REGIONS[r]), links(ids))).join('')}
    </div>`;
}

// ---------------------------------------------------------------------------
// Lecciones
// ---------------------------------------------------------------------------
function renderLesson() {
  const l = LESSON[state.lesson.id];
  const k = state.lesson.step;
  const p = l.pasos[k];
  sheetBody.innerHTML = `<div class="kicker">📘 Lección · ${esc(l.nivel)} · ${esc(REGIONS[l.region])}</div>
    <h2 class="title" data-expand>${esc(l.titulo)}</h2>
    <div class="pane">
      <div class="tip trick" style="font-size:14.5px"><b>Paso ${k + 1} de ${l.pasos.length}</b>${esc(p.texto)}</div>
      <div class="lesson-nav" style="position:static;padding:0">
        <button class="btn sm" data-lstep="${k - 1}" ${k === 0 ? 'disabled' : ''}>← Anterior</button>
        <span class="grow">${'●'.repeat(k + 1)}${'○'.repeat(l.pasos.length - k - 1)}</span>
        ${k < l.pasos.length - 1 ? `<button class="btn sm primary" data-lstep="${k + 1}">Siguiente →</button>` : '<button class="btn sm primary" data-act="lessonEnd">Terminar ✓</button>'}
      </div>
      <div class="peek-end"></div>
      ${block('En este paso', links(p.ids))}
      ${block('Introducción', `<p>${esc(l.intro)}</p>`)}
      <div class="tip trick"><b>💡 Truco para memorizar</b>${esc(l.truco)}</div>
      ${block('Todos los pasos', `<div class="lesson-steps">${l.pasos.map((s, i) => `<button class="lstep ${i === k ? 'on' : i < k ? 'done' : ''}" data-lstep="${i}"><span class="n">${i < k ? '✓' : i + 1}</span><span>${esc(s.texto)}</span></button>`).join('')}</div>`)}
    </div>`;
}

function startLesson(id, step = 0) {
  const l = LESSON[id];
  if (!l) return;
  setMode('lesson');
  state.lesson = { id, step };
  // se muestran solo las estructuras de la lección y el esqueleto como referencia
  const set = new Set(lessonMeshes(l, l.ids));
  for (const m of allMeshes) if (m.userData.tipo === 'hueso' && (!l.lado || !m.userData.side || m.userData.side === l.lado)) set.add(m);
  state.isolate = set;
  if (!state.showBones) setTool('bones', true);
  if (!state.showMuscles) setTool('muscles', true);
  setDepth(1);
  $$('#lessonList .card-btn').forEach((b) => b.classList.toggle('on', b.dataset.lesson === id));
  goStep(step);
  if (isMobile()) document.body.classList.remove('side-open');
}
function goStep(k) {
  const l = LESSON[state.lesson.id];
  state.lesson.step = Math.max(0, Math.min(l.pasos.length - 1, k));
  applyVisibility();
  renderSheet();
  focusMeshes(lessonMeshes(l, l.pasos[state.lesson.step].ids), null, 1.6);
  setHash();
}

// ===========================================================================
// Selección
// ===========================================================================
function selectStructure(id, side = null, { focus = false, fromList = false } = {}) {
  if (!id || !S[id]) return closeAll();
  const e = S[id];
  if (side && !e.meshes.some((m) => m.userData.side === side)) side = null;
  if (state.mode !== 'structure') setMode('structure');
  if (state.sel?.id !== id) state.tab = 'resumen';
  state.sel = { id, side };
  const sm = e.meshes.filter((m) => sideMatch(state.sel, m));
  sm.forEach((m) => state.hidden.delete(m.userData.key));
  if (state.isolate && !sm.some((m) => state.isolate.has(m))) state.isolate = null;
  if (e.tipo === 'musculo') {
    if (!state.showMuscles) setTool('muscles', true);
    if (e.d.capa < state.depth) setDepth(1);
  } else if (!state.showBones) setTool('bones', true);
  if (state.side !== 'ambos' && side && side !== state.side) setSide('ambos');
  if (state.isolateRegion && state.region && e.d.region !== state.region) {
    $('#isolateRegion').checked = false;
    state.isolateRegion = false;
  }
  markSeen(id);
  applyVisibility();
  renderSheet();
  updateListSel();
  setHash();
  hideToast();
  if (focus) focusMeshes(sm);
  if (isMobile() && fromList) document.body.classList.remove('side-open');
}

function selectNerve(nid) {
  if (!NERVE[nid]) return;
  setMode('nerve');
  state.nerve = nid;
  if (!state.showMuscles) setTool('muscles', true);
  setDepth(1);
  $$('#nerveList .card-btn').forEach((b) => b.classList.toggle('on', b.dataset.nerve === nid));
  applyVisibility();
  renderSheet();
  setHash();
  const ms = NERVE[nid].musculos.flatMap((m) => S[m].meshes);
  const right = ms.filter((m) => m.userData.side !== 'i');
  focusMeshes(right.length ? right : ms, null, 1.2);
  if (isMobile()) document.body.classList.remove('side-open');
}

function markSeen(id) {
  if (state.seen.has(id)) return;
  state.seen.add(id);
  store.set('seen', [...state.seen]);
  const it = document.querySelector(`#list .item[data-id="${id}"]`);
  if (it && !it.querySelector('.seen')) it.insertAdjacentHTML('beforeend', '<span class="seen">✓</span>');
  renderProgress();
}

function setHash() {
  let h = '';
  if (state.mode === 'structure' && state.sel) h = `#${state.sel.id}${state.sel.side ? ':' + state.sel.side : ''}`;
  else if (state.mode === 'lesson' && state.lesson) h = `#leccion=${state.lesson.id}`;
  else if (state.mode === 'nerve' && state.nerve) h = `#nervio=${state.nerve}`;
  if (h === location.hash || (!h && !location.hash)) return;
  // cada estructura, lección o nervio abierto es una entrada del historial:
  // el botón "Atrás" (del navegador o del móvil) vuelve a lo anterior
  const sameItem = h && location.hash && h.split(':')[0] === location.hash.split(':')[0];
  try {
    if (navigatingHistory || sameItem) history.replaceState(null, '', h || location.pathname + location.search);
    else {
      if (lastLabel) backStack.push(lastLabel);
      history.pushState(null, '', h || location.pathname + location.search);
    }
  } catch {
    /* sin historial */
  }
  updateBackBtn();
}
let navigatingHistory = false;
let lastLabel = null;
const backStack = [];
function currentLabel() {
  if (state.mode === 'structure' && state.sel) return S[state.sel.id].d.nombre;
  if (state.mode === 'lesson' && state.lesson) return LESSON[state.lesson.id].titulo;
  if (state.mode === 'nerve' && state.nerve) return NERVE[state.nerve].nombre;
  return null;
}
function updateBackBtn() {
  lastLabel = currentLabel();
  const btn = $('#sheetBack');
  const prev = backStack[backStack.length - 1];
  btn.hidden = !prev || !lastLabel;
  if (prev) btn.querySelector('span').textContent = prev;
}
$('#sheetBack').addEventListener('click', () => history.back());
window.addEventListener('popstate', () => {
  backStack.pop();
  navigatingHistory = true;
  try {
    if (!openFromHash()) closeAll();
  } finally {
    navigatingHistory = false;
  }
});

// Clicks dentro de la hoja
sheetBody.addEventListener('click', (ev) => {
  const t = ev.target;
  const go = t.closest('[data-go]');
  if (go) return selectStructure(go.dataset.go, state.sel?.side || LESSON[state.lesson?.id]?.lado || null, { focus: true });
  const nv = t.closest('[data-nerve]');
  if (nv) return selectNerve(nv.dataset.nerve);
  const ls = t.closest('[data-lesson]');
  if (ls) return startLesson(ls.dataset.lesson);
  const st = t.closest('[data-lstep]');
  if (st && !st.disabled) return goStep(+st.dataset.lstep);
  const tab = t.closest('.ptabs [data-tab]');
  if (tab) {
    state.tab = tab.dataset.tab;
    renderStructure();
    if (isBottomSheet()) openSheet(true);
    return;
  }
  const sd = t.closest('#selSide [data-sd]');
  if (sd) return selectStructure(state.sel.id, sd.dataset.sd || null);
  if (t.closest('[data-expand]') && isBottomSheet()) return openSheet(!document.body.classList.contains('sheet-full'));
  const act = t.closest('[data-act]')?.dataset.act;
  if (act) handleAction(act, t.closest('[data-act]'));
});
sheetBody.addEventListener('input', (ev) => {
  if (ev.target.id !== 'notes' || !state.sel) return;
  const notes = store.get('notes', {});
  if (ev.target.value.trim()) notes[state.sel.id] = ev.target.value;
  else delete notes[state.sel.id];
  store.set('notes', notes);
});

function handleAction(act, el) {
  if (act === 'lessonEnd') {
    toast(`¡Lección "${LESSON[state.lesson.id].titulo}" completada! 🎉`);
    const done = store.get('lessonsDone', []);
    if (!done.includes(state.lesson.id)) store.set('lessonsDone', [...done, state.lesson.id]);
    renderLessonList();
    renderProgress();
    return closeAll();
  }
  if (act === 'welcomeExplore') {
    store.set('welcomed', true);
    return closeAll();
  }
  if (act === 'welcomeLesson') {
    store.set('welcomed', true);
    return startLesson('manguito');
  }
  if (act === 'welcomeStudy') {
    store.set('welcomed', true);
    return openStudy();
  }
  if (act.startsWith('study')) return studyAction(act, el);
  if (!state.sel) return;
  if (act === 'fav') {
    const id = state.sel.id;
    if (state.favs.has(id)) state.favs.delete(id);
    else state.favs.add(id);
    store.set('favs', [...state.favs]);
    toast(state.favs.has(id) ? '★ Guardado en favoritos. Puedes estudiarlos en 🎓 › ★ Favoritos' : 'Quitado de favoritos', 2500);
    renderStructure();
    renderList();
    return;
  }
  if (act === 'print') return printSheet();
  const own = S[state.sel.id].meshes.filter((m) => sideMatch(state.sel, m));
  if (act === 'focus') focusMeshes(own);
  if (act === 'hide') {
    own.forEach((m) => state.hidden.add(m.userData.key));
    toast(`${S[state.sel.id].d.nombre} oculto. Usa "Reiniciar" para volver a verlo.`);
    closeAll();
  }
  if (act === 'isolate') {
    state.isolate = new Set(structureRoles(state.sel).keys());
    applyVisibility();
    renderSheet();
    focusMeshes([...state.isolate]);
  }
  if (act === 'showall') {
    state.hidden.clear();
    state.isolate = null;
    applyVisibility();
    renderSheet();
  }
}

// ---------------------------------------------------------------------------
// Bienvenida
// ---------------------------------------------------------------------------
function renderWelcome() {
  sheetBody.innerHTML = `<div class="empty">
    <div class="kicker">Bienvenida</div>
    <h2>Estudia anatomía en 3D</h2>
    <p>Un atlas interactivo con ${Object.keys(BONES).length} huesos y ${Object.keys(MUSCLES).length} músculos. Cada estructura tiene una ficha resumida para entenderla de un vistazo y el detalle para estudiarla a fondo.</p>
    <div class="peek-end"></div>
    <div class="steps-intro">
      <div class="step-card"><span class="n">1</span><div><b>Explora</b><p>Toca cualquier hueso o músculo. Verás de dónde sale (verde) y a dónde llega (azul).</p></div></div>
      <div class="step-card"><span class="n">2</span><div><b>Aprende con lecciones</b><p>Recorridos guiados con trucos para memorizar.</p></div></div>
      <div class="step-card"><span class="n">3</span><div><b>Ponte a prueba</b><p>Identificar, localizar, test y fichas de repaso.</p></div></div>
    </div>
    <div class="actions" style="margin-top:16px">
      <button class="btn primary" data-act="welcomeExplore">Empezar a explorar</button>
      <button class="btn" data-act="welcomeLesson">📘 Primera lección</button>
      <button class="btn" data-act="welcomeStudy">🎓 Estudiar</button>
    </div>
  </div>`;
}

// ===========================================================================
// Panel lateral: lista, lecciones, nervios, progreso
// ===========================================================================
function entryMatchesFilters(e) {
  if (state.type === 'fav') {
    if (!state.favs.has(e.id)) return false;
  } else if (state.type !== 'todo' && e.tipo !== state.type) return false;
  if (state.region && e.d.region !== state.region) return false;
  return true;
}

function renderList() {
  let html = '';
  for (const [rk, rn] of Object.entries(REGIONS)) {
    const items = Object.values(S).filter((e) => e.d.region === rk && entryMatchesFilters(e));
    if (!items.length) continue;
    const groups = new Map();
    for (const e of items) {
      const g = `${e.tipo === 'hueso' ? 'Huesos' : 'Músculos'} · ${groupOf(e)}`;
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(e);
    }
    const ordered = [...groups.entries()].sort((a, b) => (a[0].startsWith('Huesos') ? 0 : 1) - (b[0].startsWith('Huesos') ? 0 : 1));
    html += `<details ${state.region ? 'open' : ''}><summary>${rn}<span class="count">${items.length}</span></summary>`;
    for (const [g, arr] of ordered) {
      html += `<div class="grp">${esc(g)}</div>`;
      html += arr.map((e) => `<button class="item" data-id="${e.id}"><span class="dot ${e.tipo}"></span>${esc(e.d.nombre)}${state.favs.has(e.id) ? '<span class="star">★</span>' : ''}${state.seen.has(e.id) ? '<span class="seen">✓</span>' : ''}</button>`).join('');
    }
    html += '</details>';
  }
  $('#list').innerHTML = html || `<p class="muted" style="padding:12px">${state.type === 'fav' ? 'Aún no tienes favoritos. Abre una ficha y pulsa "☆ Favorito" para guardarla y repasarla luego.' : 'Sin resultados'}</p>`;
  updateListSel();
}

function updateListSel() {
  $$('#list .item.sel').forEach((b) => b.classList.remove('sel'));
  if (state.mode !== 'structure' || !state.sel) return;
  const it = document.querySelector(`#list .item[data-id="${state.sel.id}"]`);
  if (it) {
    it.classList.add('sel');
    const det = it.closest('details');
    if (det && !det.open) det.open = true;
    it.scrollIntoView({ block: 'nearest' });
  }
}
$('#list').addEventListener('click', (ev) => {
  const it = ev.target.closest('.item');
  if (it) selectStructure(it.dataset.id, null, { focus: true, fromList: true });
});

function renderLessonList() {
  const done = store.get('lessonsDone', []);
  $('#lessonList').innerHTML = LESSONS.map((l) => `<button class="card-btn" data-lesson="${l.id}"><b>${done.includes(l.id) ? '✅ ' : ''}${esc(l.titulo)}</b><small>${esc(l.intro.split('. ')[0])}.</small><div class="card-meta"><span class="chip">${esc(REGIONS[l.region])}</span><span class="chip">${esc(l.nivel)}</span><span class="chip">${l.pasos.length} pasos</span></div></button>`).join('');
}
$('#lessonList').addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-lesson]');
  if (b) startLesson(b.dataset.lesson);
});
function renderNerveList() {
  $('#nerveList').innerHTML = NERVES.filter((n) => n.musculos.length).map((n) => `<button class="card-btn" data-nerve="${n.id}"><b>${esc(n.nombre)}</b><small>${esc(n.desc)}</small><div class="card-meta"><span class="chip">${esc(n.raices)}</span><span class="chip">${n.musculos.length} músculos</span></div></button>`).join('');
}
$('#nerveList').addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-nerve]');
  if (b) selectNerve(b.dataset.nerve);
});

function renderProgress() {
  const total = Object.keys(S).length;
  const seen = [...state.seen].filter((id) => S[id]).length;
  const done = store.get('lessonsDone', []).length;
  $('#progress').innerHTML = `<div class="row" style="justify-content:space-between"><span>Has visto <b style="color:var(--text)">${seen}</b> de ${total} estructuras</span><span>📘 ${done}/${LESSONS.length}</span></div><div class="bar"><i style="width:${(seen / total) * 100}%"></i></div>`;
}

$('#sideTabs').addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-tab]');
  if (!b) return;
  $$('#sideTabs button').forEach((x) => x.classList.toggle('on', x === b));
  $$('.side-body').forEach((p) => (p.hidden = p.dataset.pane !== b.dataset.tab));
});

function renderRegionSelect() {
  $('#regionSelect').innerHTML = '<option value="">Todas las regiones</option>' + Object.entries(REGIONS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
}
$('#regionSelect').addEventListener('change', (ev) => {
  state.region = ev.target.value || null;
  renderList();
  applyVisibility();
  if (state.isolateRegion && state.region) setView('fit');
});
$('#isolateRegion').addEventListener('change', (ev) => {
  state.isolateRegion = ev.target.checked;
  applyVisibility();
  if (state.region) setView('fit');
});
$('#typeFilter').addEventListener('click', (ev) => {
  const b = ev.target.closest('button');
  if (!b) return;
  state.type = b.dataset.type;
  segOn('#typeFilter', b);
  renderList();
});
function segOn(sel, btn) {
  $$(sel + ' button').forEach((x) => x.classList.toggle('on', x === btn));
}

// ===========================================================================
// Barra de herramientas del visor
// ===========================================================================
function setTool(name, on) {
  const map = { bones: 'showBones', muscles: 'showMuscles', labels: 'labels' };
  state[map[name]] = on;
  document.querySelector(`.tool[data-tool="${name}"]`).classList.toggle('on', on);
}
function setDepth(d) {
  state.depth = d;
  segOn('#depthSeg', document.querySelector(`#depthSeg button[data-d="${d}"]`));
  document.querySelector('.tool[data-tool="layers"]').classList.toggle('on', d > 1 || state.opacity < 1 || state.side !== 'ambos');
}
function setSide(s) {
  state.side = s;
  segOn('#sideSeg', document.querySelector(`#sideSeg button[data-s="${s}"]`));
  setDepth(state.depth);
}
function togglePop(id) {
  for (const p of ['popLayers', 'popViews']) {
    const show = p === id && $('#' + p).hidden;
    $('#' + p).hidden = !show;
    document.querySelector(`.tool[data-tool="${p === 'popLayers' ? 'layers' : 'views'}"]`).classList.toggle('active', show);
  }
}
$('#toolbar').addEventListener('click', (ev) => {
  const b = ev.target.closest('.tool');
  if (!b) return;
  const t = b.dataset.tool;
  if (t === 'bones' || t === 'muscles') {
    setTool(t, !b.classList.contains('on'));
    applyVisibility();
  } else if (t === 'labels') {
    setTool('labels', !state.labels);
    rebuildLabels();
    needsRender = true;
  } else if (t === 'layers') togglePop('popLayers');
  else if (t === 'views') togglePop('popViews');
  else if (t === 'shot') screenshot();
  else if (t === 'reset') resetAll();
});
document.addEventListener('pointerdown', (ev) => {
  if (!ev.target.closest('.pop') && !ev.target.closest('.tool')) togglePop(null);
});
$('#depthSeg').addEventListener('click', (ev) => {
  const b = ev.target.closest('button');
  if (!b) return;
  setDepth(+b.dataset.d);
  applyVisibility();
});
$('#sideSeg').addEventListener('click', (ev) => {
  const b = ev.target.closest('button');
  if (!b) return;
  setSide(b.dataset.s);
  applyVisibility();
});
$('#muscleOpacity').addEventListener('input', (ev) => {
  state.opacity = +ev.target.value;
  setDepth(state.depth);
  applyColors();
});
$('#showCart').addEventListener('change', (ev) => {
  state.showCart = ev.target.checked;
  applyVisibility();
});
$('#dimOthers').addEventListener('change', (ev) => {
  state.dim = ev.target.checked;
  applyColors();
});
$('#autoRotate').addEventListener('change', (ev) => {
  controls.autoRotate = ev.target.checked;
});
$('#popViews').addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-view]');
  if (b) setView(b.dataset.view);
});

function resetAll() {
  state.hidden.clear();
  if (state.mode !== 'lesson') state.isolate = null;
  setTool('bones', true);
  setTool('muscles', true);
  setDepth(1);
  setSide('ambos');
  state.opacity = 1;
  $('#muscleOpacity').value = 1;
  setDepth(1);
  state.isolateRegion = false;
  $('#isolateRegion').checked = false;
  state.cut = 'none';
  segOn('#cutSeg', document.querySelector('#cutSeg [data-c="none"]'));
  applyCut();
  applyVisibility();
  if (state.mode === 'structure') renderSheet();
  animateCamera(HOME.t, HOME.p);
}

function screenshot() {
  renderer.render(scene, camera);
  const a = document.createElement('a');
  const name = state.mode === 'structure' && state.sel ? state.sel.id : state.mode === 'lesson' ? state.lesson.id : 'modelo';
  a.download = `anatomia3d-${name}.png`;
  a.href = renderer.domElement.toDataURL('image/png');
  a.click();
  toast('Imagen guardada 📸');
}

// ---------------------------------------------------------------------------
// Imprimir ficha (con imagen del modelo)
// ---------------------------------------------------------------------------
function printSheet() {
  const e = S[state.sel.id];
  renderer.render(scene, camera);
  const img = renderer.domElement.toDataURL('image/png');
  const notes = store.get('notes', {})[e.id];
  sheetBody.innerHTML = `${structureHeader(e, state.sel.side)}<img class="print-shot" src="${img}" alt="">
    <div class="pane">${paneHTML(e, 'resumen')}<h3 class="print-h">Detalle</h3>${paneHTML(e, 'detalle')}<h3 class="print-h">Conexiones</h3>${paneHTML(e, 'conexiones')}<h3 class="print-h">Clínica</h3>${paneHTML(e, 'clinica')}${notes ? `<h3 class="print-h">Mis notas</h3><p>${esc(notes)}</p>` : ''}</div>`;
  document.body.classList.add('printing');
  setTimeout(() => {
    window.print();
    document.body.classList.remove('printing');
    renderSheet();
  }, 60);
}

// Estructura al azar (respeta los filtros de la lista)
$('#btnRandom').addEventListener('click', () => {
  const pool = Object.values(S).filter(entryMatchesFilters);
  if (!pool.length) return toast('No hay estructuras con esos filtros');
  const e = pickOne(pool);
  selectStructure(e.id, e.d.bilateral ? pickOne(['d', 'i']) : null, { focus: true, fromList: true });
});

// ---------------------------------------------------------------------------
// Corte anatómico (plano de sección)
// ---------------------------------------------------------------------------
const clipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
const CUTS = {
  sagital: { n: [1, 0, 0], min: -32, max: 32, view: 'right', flipView: 'left' },
  coronal: { n: [0, 0, -1], min: -14, max: 14, view: 'front', flipView: 'back' },
  transversal: { n: [0, -1, 0], min: 0, max: 178, view: 'top', flipView: 'top' },
};
function applyCut() {
  const c = CUTS[state.cut];
  renderer.localClippingEnabled = !!c;
  $('#cutRow').hidden = !c;
  if (c) {
    const v = c.min + (c.max - c.min) * state.cutPos;
    const n = new THREE.Vector3(...c.n).multiplyScalar(state.cutFlip ? -1 : 1);
    // se conserva la parte donde n·p + constante >= 0
    clipPlane.normal.copy(n);
    clipPlane.constant = -n.dot(new THREE.Vector3(c.n[0] ? v : 0, c.n[1] ? v : 0, c.n[2] ? v : 0));
  }
  document.querySelector('.tool[data-tool="layers"]').classList.toggle('on', !!c || state.depth > 1 || state.opacity < 1 || state.side !== 'ambos');
  needsRender = true;
}
$('#cutSeg').addEventListener('click', (ev) => {
  const b = ev.target.closest('button');
  if (!b) return;
  state.cut = b.dataset.c;
  segOn('#cutSeg', b);
  if (state.cut === 'transversal' && state.cutPos === 0.5) state.cutPos = 0.75;
  $('#cutPos').value = state.cutPos;
  applyCut();
  // gira la cámara para mirar la cara del corte
  if (CUTS[state.cut]) setView(state.cutFlip ? CUTS[state.cut].flipView : CUTS[state.cut].view);
});
$('#cutPos').addEventListener('input', (ev) => {
  state.cutPos = +ev.target.value;
  applyCut();
});
$('#cutFlip').addEventListener('click', () => {
  state.cutFlip = !state.cutFlip;
  applyCut();
  if (CUTS[state.cut]) setView(state.cutFlip ? CUTS[state.cut].flipView : CUTS[state.cut].view);
});

// ---------------------------------------------------------------------------
// Tema claro / oscuro
// ---------------------------------------------------------------------------
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  $('#btnTheme').textContent = t === 'light' ? '🌙' : '☀️';
  $('#btnTheme').title = t === 'light' ? 'Tema oscuro' : 'Tema claro';
  document.querySelector('meta[name=theme-color]').content = t === 'light' ? '#f4f6f9' : '#0f1319';
}
setTheme(store.get('theme', window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
$('#btnTheme').addEventListener('click', () => {
  const t = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  setTheme(t);
  store.set('theme', t);
});

// ===========================================================================
// Búsqueda
// ===========================================================================
const searchIndex = [
  ...Object.values(S).map((e) => ({
    kind: e.tipo,
    id: e.id,
    nombre: e.d.nombre,
    sub: REGIONS[e.d.region],
    name: norm(e.d.nombre),
    latin: norm(e.d.latin),
    extra: norm([e.d.grupo, e.d.inervacion, e.d.accion, e.d.origen, e.d.insercion, e.d.descripcion].join(' ')),
  })),
  ...NERVES.map((n) => ({ kind: 'nervio', id: n.id, nombre: n.nombre, sub: `Nervio · ${n.musculos.length} músculos`, name: norm(n.nombre), latin: '', extra: norm(n.desc) })),
  ...LESSONS.map((l) => ({ kind: 'leccion', id: l.id, nombre: l.titulo, sub: 'Lección guiada', name: norm(l.titulo), latin: '', extra: norm(l.intro) })),
];
let searchSel = 0;
function doSearch(q) {
  const box = $('#searchResults');
  const n = norm(q).trim();
  if (n.length < 2) {
    box.hidden = true;
    return;
  }
  const words = n.split(/\s+/);
  const res = [];
  for (const it of searchIndex) {
    let score = 0;
    if (it.name.startsWith(n)) score = 100;
    else if (it.name.includes(n)) score = 80;
    else if (words.every((w) => it.name.includes(w))) score = 70;
    else if (it.latin.includes(n)) score = 60;
    else if (words.every((w) => it.extra.includes(w))) score = 30;
    if (it.kind === 'nervio' || it.kind === 'leccion') score += score ? 5 : 0;
    if (score) res.push({ ...it, score });
  }
  res.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  const top = res.slice(0, 40);
  searchSel = 0;
  const ico = { hueso: '<span class="dot hueso"></span>', musculo: '<span class="dot musculo"></span>', nervio: '<span class="dot nervio"></span>', leccion: '📘' };
  box.innerHTML = top.length
    ? top.map((r, i) => `<button data-kind="${r.kind}" data-id="${r.id}" class="${i === 0 ? 'active' : ''}">${ico[r.kind]}<span>${esc(r.nombre)}<br><small>${r.score <= 35 ? 'Coincide en su descripción' : esc(r.sub)}</small></span></button>`).join('')
    : '<p class="muted" style="padding:8px 10px;margin:0">Sin resultados</p>';
  box.hidden = false;
}
const searchInput = $('#search');
searchInput.addEventListener('input', () => doSearch(searchInput.value));
searchInput.addEventListener('keydown', (ev) => {
  const btns = $$('#searchResults button');
  if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
    ev.preventDefault();
    if (!btns.length) return;
    searchSel = (searchSel + (ev.key === 'ArrowDown' ? 1 : -1) + btns.length) % btns.length;
    btns.forEach((b, i) => b.classList.toggle('active', i === searchSel));
    btns[searchSel].scrollIntoView({ block: 'nearest' });
  } else if (ev.key === 'Enter' && btns[searchSel]) pickSearch(btns[searchSel]);
  else if (ev.key === 'Escape') {
    $('#searchResults').hidden = true;
    searchInput.blur();
  }
});
$('#searchResults').addEventListener('click', (ev) => {
  const b = ev.target.closest('button[data-id]');
  if (b) pickSearch(b);
});
function pickSearch(b) {
  $('#searchResults').hidden = true;
  searchInput.value = '';
  searchInput.blur();
  const { kind, id } = b.dataset;
  if (kind === 'nervio') selectNerve(id);
  else if (kind === 'leccion') startLesson(id);
  else selectStructure(id, null, { focus: true, fromList: true });
}
document.addEventListener('click', (ev) => {
  if (!ev.target.closest('.search')) $('#searchResults').hidden = true;
});

// ===========================================================================
// Interacción con el modelo
// ===========================================================================
const ray = new THREE.Raycaster();
const ptr = new THREE.Vector2();
const tooltip = $('#tooltip');
let lastMove = null;
let downAt = null;

function pick(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  ptr.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  let hits = ray.intersectObjects(allMeshes.filter((m) => m.visible), false);
  if (renderer.localClippingEnabled) hits = hits.filter((h) => clipPlane.distanceToPoint(h.point) >= 0);
  if (!hits.length) return null;
  const solid = hits.find((h) => h.object.material.opacity > 0.3);
  return (solid || hits[0]).object;
}
const labelFor = (m) => `${S[m.userData.id].d.nombre}${m.userData.side ? ` (${SIDE_NAME[m.userData.side]})` : ''}`;

canvas.addEventListener('pointermove', (ev) => {
  if (ev.pointerType === 'mouse') lastMove = ev;
  if (downAt && Math.hypot(ev.clientX - downAt.x, ev.clientY - downAt.y) > 6) downAt.drag = true;
});
canvas.addEventListener('pointerleave', () => {
  lastMove = null;
  tooltip.hidden = true;
  if (state.hover) {
    state.hover = null;
    applyColors();
  }
});
function processHover() {
  if (!lastMove || downAt?.drag) return;
  const ev = lastMove;
  lastMove = null;
  const m = pick(ev.clientX, ev.clientY);
  if (m !== state.hover) {
    state.hover = m;
    for (const x of allMeshes) {
      // solo se recalcula el realce de hover, sin reconstruir etiquetas
      const r = roles.get(x);
      const c = r ? COL[r].clone().multiplyScalar(r === 's' ? 0.22 : r === 'l' ? 0.05 : 0.13) : new THREE.Color(0, 0, 0);
      if (x === m && state.mode !== 'study') c.add(HOVER_ADD);
      x.material.emissive.copy(c);
    }
    needsRender = true;
  }
  canvas.style.cursor = m ? 'pointer' : 'grab';
  if (m && state.mode !== 'study') {
    const r = stage.getBoundingClientRect();
    tooltip.hidden = false;
    tooltip.textContent = labelFor(m);
    tooltip.style.left = ev.clientX - r.left + 'px';
    tooltip.style.top = ev.clientY - r.top + 'px';
  } else tooltip.hidden = true;
}

canvas.addEventListener('pointerdown', (ev) => {
  downAt = { x: ev.clientX, y: ev.clientY, t: performance.now(), drag: false };
  if (isMobile()) document.body.classList.remove('side-open');
  if (isMobile() && document.body.classList.contains('sheet-full')) document.body.classList.remove('sheet-full');
});
let lastClick = { t: 0, m: null };
canvas.addEventListener('pointerup', (ev) => {
  if (!downAt) return;
  // solo el desplazamiento decide si fue un arrastre (en equipos lentos un clic puede tardar)
  const wasDrag = downAt.drag || performance.now() - downAt.t > 1500;
  downAt = null;
  if (wasDrag) return;
  const m = pick(ev.clientX, ev.clientY);
  const now = performance.now();
  if (state.mode === 'study') {
    if (qm() === 'loc' && m) quizLocate(m);
    return;
  }
  if (m && lastClick.m === m && now - lastClick.t < 380) {
    focusMeshes([m]);
    lastClick = { t: 0, m: null };
    return;
  }
  lastClick = { t: now, m };
  if (m) selectStructure(m.userData.id, m.userData.side);
  else if (state.mode === 'structure') closeAll();
});

// ===========================================================================
// Modo estudio
// ===========================================================================
const qm = () => (quiz.mode === 'exam' ? quiz.sub : quiz.mode);
const EXAM_N = 10;
const quiz = { mode: 'id', scope: 'todo', target: null, answered: false, ok: 0, total: 0, streak: 0, best: store.get('best', 0), q: null, revealed: false, last: null };

function quizPool() {
  return allMeshes.filter((m) => {
    const e = S[m.userData.id];
    if (quiz.scope === 'fav') {
      if (!state.favs.has(e.id)) return false;
    } else if (quiz.scope !== 'todo' && e.tipo !== quiz.scope) return false;
    if (state.region && e.d.region !== state.region) return false;
    return meshVisible(m);
  });
}

function openStudy() {
  setMode('study');
  $('#btnStudy').classList.add('on');
  quiz.ok = quiz.total = quiz.streak = 0;
  hideToast();
  nextQuestion();
  if (isMobile()) document.body.classList.remove('side-open');
}

// Pregunta tipo test generada a partir de los datos
function buildTest(e) {
  const d = e.d;
  const pool = Object.values(S).filter((x) => x.tipo === e.tipo && x.id !== e.id);
  const sample = (arr, n, key) => {
    const out = [];
    const used = new Set();
    for (const x of shuffle(arr)) {
      const k = key(x);
      if (!k || used.has(k)) continue;
      used.add(k);
      out.push(k);
      if (out.length === n) break;
    }
    return out;
  };
  const types = [];
  if (e.tipo === 'musculo') {
    types.push(() => {
      const ok = shortTxt(d.inervacion);
      return { text: `¿Qué nervio inerva el <span class="target">${esc(d.nombre)}</span>?`, ok, wrong: sample(pool, 3, (x) => (shortTxt(x.d.inervacion) !== ok ? shortTxt(x.d.inervacion) : null)) };
    });
    types.push(() => {
      const ok = firstSentence(d.accion);
      return { text: `¿Cuál es la acción del <span class="target">${esc(d.nombre)}</span>?`, ok, wrong: sample(pool, 3, (x) => firstSentence(x.d.accion)) };
    });
    if (d.ih.length) {
      types.push(() => {
        const ok = S[pickOne(d.ih)].d.nombre;
        const bad = Object.values(S).filter((x) => x.tipo === 'hueso' && !d.ih.includes(x.id) && !x.id.startsWith('falange') && !/^[ctl]\d/.test(x.id));
        return { text: `¿En qué hueso se inserta el <span class="target">${esc(d.nombre)}</span>?`, ok, wrong: sample(bad, 3, (x) => x.d.nombre) };
      });
    }
    if (d.oh.length) {
      types.push(() => {
        const ok = S[pickOne(d.oh)].d.nombre;
        const bad = Object.values(S).filter((x) => x.tipo === 'hueso' && !d.oh.includes(x.id) && !x.id.startsWith('falange') && !/^[ctl]\d/.test(x.id));
        return { text: `¿De qué hueso se origina el <span class="target">${esc(d.nombre)}</span>?`, ok, wrong: sample(bad, 3, (x) => x.d.nombre) };
      });
    }
  } else {
    const arts = [...new Set(d.articulaciones.map((a) => a[0]))].filter((x) => x !== e.id);
    if (arts.length) {
      types.push(() => {
        const ok = S[pickOne(arts)].d.nombre;
        const bad = pool.filter((x) => !arts.includes(x.id) && x.d.region === d.region);
        return { text: `¿Con qué hueso se articula el <span class="target">${esc(d.nombre)}</span>?`, ok, wrong: sample(bad.length >= 3 ? bad : pool, 3, (x) => x.d.nombre) };
      });
    }
    const att = [...d.musOrigen, ...d.musInsercion];
    if (att.length) {
      types.push(() => {
        const ok = S[pickOne(att)].d.nombre;
        const bad = Object.values(S).filter((x) => x.tipo === 'musculo' && !att.includes(x.id));
        return { text: `¿Qué músculo se ancla en el <span class="target">${esc(d.nombre)}</span>?`, ok, wrong: sample(bad, 3, (x) => x.d.nombre) };
      });
    }
  }
  if (!types.length) return null;
  const q = pickOne(types)();
  if (q.wrong.length < 3) return null;
  return { text: q.text, opts: shuffle([q.ok, ...q.wrong]), ok: q.ok };
}

// Repaso espaciado (cajas de Leitner): las fichas falladas salen más a menudo.
function pickCard(pool) {
  const boxes = store.get('cards', {});
  const ids = [...new Set(pool.map((m) => m.userData.id))].filter((id) => id !== quiz.last);
  const weight = (id) => [6, 16, 8, 4, 2, 1][boxes[id] || 0];
  let total = ids.reduce((s, id) => s + weight(id), 0);
  let r = Math.random() * total;
  for (const id of ids) {
    r -= weight(id);
    if (r <= 0) return id;
  }
  return ids[0];
}

function nextQuestion() {
  quiz.answered = false;
  quiz.revealed = false;
  quiz.q = null;
  if (quiz.mode === 'exam') {
    if (quiz.exam.results.length >= EXAM_N) {
      quiz.target = null;
      applyColors();
      return renderSheet();
    }
    quiz.sub = pickOne(['id', 'test', 'test']);
  }
  const pool = quizPool();
  const ids = new Set(pool.map((m) => m.userData.id));
  if (ids.size < 4) {
    quiz.target = null;
    applyColors();
    renderSheet();
    return;
  }
  let m;
  if (qm() === 'cards') {
    const id = pickCard(pool);
    const cands = pool.filter((x) => x.userData.id === id);
    m = cands.find((x) => x.userData.side !== 'i') || cands[0];
  } else {
    for (let k = 0; k < 12; k++) {
      m = pickOne(pool);
      if (m.userData.id !== quiz.last) break;
    }
  }
  quiz.target = m;
  quiz.last = m.userData.id;
  const e = S[m.userData.id];
  if (qm() === 'id') {
    const same = [...ids].filter((x) => x !== e.id && S[x].tipo === e.tipo);
    const near = shuffle(same.filter((x) => S[x].d.region === e.d.region));
    const far = shuffle(same.filter((x) => S[x].d.region !== e.d.region));
    const others = shuffle([...ids].filter((x) => S[x].tipo !== e.tipo));
    quiz.q = { opts: shuffle([e.id, ...[...near, ...far, ...others].slice(0, 3)]).map((x) => S[x].d.nombre), ok: e.d.nombre };
  } else if (qm() === 'test') {
    let q = null;
    for (let k = 0; k < 5 && !q; k++) q = buildTest(e);
    if (!q) {
      quiz.retries = (quiz.retries || 0) + 1;
      if (quiz.retries < 20) return nextQuestion();
    }
    quiz.retries = 0;
    if (!q) return;
    quiz.q = q;
  }
  applyColors();
  renderSheet();
  if (qm() !== 'loc') focusMeshes([m], null, 2.2);
}

function registerAnswer(ok) {
  quiz.answered = true;
  quiz.total++;
  if (ok) {
    quiz.ok++;
    quiz.streak++;
    if (quiz.streak > quiz.best) {
      quiz.best = quiz.streak;
      store.set('best', quiz.best);
    }
  } else quiz.streak = 0;
  quiz.wasOk = ok;
  if (quiz.mode === 'exam') quiz.exam.results.push({ id: quiz.target.userData.id, side: quiz.target.userData.side, ok });
  markSeen(quiz.target.userData.id);
  applyColors();
  renderSheet();
}

function quizLocate(m) {
  if (quiz.answered || !quiz.target) return;
  const t = quiz.target;
  quiz.clicked = labelFor(m);
  registerAnswer(m.userData.id === t.userData.id && (!t.userData.side || m.userData.side === t.userData.side));
  if (!quiz.wasOk) focusMeshes([t], null, 2.2);
}

function studyAction(act, el) {
  if (act === 'studyNext') return nextQuestion();
  if (act === 'studyOpt') {
    if (quiz.answered) return;
    quiz.chosen = el.dataset.v;
    return registerAnswer(el.dataset.v === quiz.q.ok);
  }
  if (act === 'studyReveal') {
    quiz.revealed = true;
    applyColors();
    return renderSheet();
  }
  if (act === 'studyKnew' || act === 'studyAgain') {
    const boxes = store.get('cards', {});
    const id = quiz.target.userData.id;
    boxes[id] = act === 'studyKnew' ? Math.min(5, (boxes[id] || 1) + 1) : 1;
    store.set('cards', boxes);
    quiz.total++;
    if (act === 'studyKnew') quiz.ok++;
    markSeen(id);
    return nextQuestion();
  }
  if (act === 'studyOpen') {
    const m = quiz.target;
    return selectStructure(m.userData.id, m.userData.side, { focus: true });
  }
  if (act === 'studyMode') {
    quiz.mode = el.dataset.v;
    if (quiz.mode === 'exam') {
      quiz.exam = { results: [], t0: Date.now() };
      quiz.ok = quiz.total = quiz.streak = 0;
    }
    return nextQuestion();
  }
  if (act === 'studyRestart') {
    quiz.exam = { results: [], t0: Date.now() };
    quiz.ok = quiz.total = quiz.streak = 0;
    return nextQuestion();
  }
  if (act === 'studyScope') {
    quiz.scope = el.dataset.v;
    return nextQuestion();
  }
}

function renderStudy() {
  const modes = [['id', 'Identificar'], ['loc', 'Localizar'], ['test', 'Test'], ['cards', 'Fichas'], ['exam', 'Examen']];
  const scopes = [['todo', 'Todo'], ['hueso', 'Huesos'], ['musculo', 'Músculos'], ['fav', '★ Favoritos']];
  const t = quiz.target;
  const e = t && S[t.userData.id];
  let body = '';
  const examDone = quiz.mode === 'exam' && quiz.exam.results.length >= EXAM_N && !quiz.answered;
  if (quiz.mode === 'exam' && !examDone) body += `<div class="exam-bar"><span>Pregunta ${Math.min(quiz.exam.results.length + (quiz.answered ? 0 : 1), EXAM_N)} de ${EXAM_N}</span><div class="bar"><i style="width:${(quiz.exam.results.length / EXAM_N) * 100}%"></i></div></div>`;
  if (examDone) {
    const res = quiz.exam.results;
    const nOk = res.filter((r) => r.ok).length;
    const mins = Math.max(1, Math.round((Date.now() - quiz.exam.t0) / 60000));
    const grade = nOk >= 9 ? '¡Excelente! 🏆' : nOk >= 7 ? '¡Muy bien! 💪' : nOk >= 5 ? 'Aprobado, sigue repasando 📚' : 'Toca repasar estos temas 🔁';
    const failed = [...new Set(res.filter((r) => !r.ok).map((r) => r.id))];
    const hist = store.get('exams', []);
    if (!quiz.exam.saved) {
      quiz.exam.saved = true;
      hist.push({ ok: nOk, n: EXAM_N, at: Date.now() });
      store.set('exams', hist.slice(-20));
    }
    body = `<div class="flash"><div class="muted small">Resultado del examen · ${mins} min</div><h3 style="font-size:34px">${nOk}/${EXAM_N}</h3><div>${grade}</div></div>
      ${failed.length ? block('Repasa lo que fallaste', links(failed)) : '<div class="feedback ok"><b>Sin errores.</b> ¡Prueba con otra región!</div>'}
      ${hist.length > 1 ? block('Tus últimos exámenes', `<div class="boxes">${hist.slice(-8).map((h) => `<div><i class="f" style="opacity:${0.25 + (0.75 * h.ok) / h.n}"></i>${h.ok}/${h.n}</div>`).join('')}</div>`) : ''}
      <div class="actions"><button class="btn primary" data-act="studyRestart">Repetir examen</button></div>`;
  } else if (!t) {
    body = '<div class="tip clin"><b>No hay suficientes estructuras</b>Cambia la región, el tipo o las capas visibles (o añade más favoritos ★) para tener al menos 4 opciones.</div>';
  } else if (qm() === 'id' || qm() === 'test') {
    const q = qm() === 'id' ? '¿Qué estructura está resaltada en <span class="target">naranja</span>?' : quiz.q.text;
    body = `<div class="study-q">${q}</div><div class="opts">${quiz.q.opts.map((o) => {
      let cls = '';
      if (quiz.answered && o === quiz.q.ok) cls = 'ok';
      else if (quiz.answered && o === quiz.chosen) cls = 'bad';
      return `<button class="${cls}" data-act="studyOpt" data-v="${esc(o)}">${esc(o)}</button>`;
    }).join('')}</div>`;
  } else if (qm() === 'loc') {
    body = `<div class="study-q">Toca en el modelo: <span class="target">${esc(e.d.nombre)}</span>${t.userData.side ? ` <span class="muted">(lado ${SIDE_NAME[t.userData.side]})</span>` : ''}</div>`;
    if (!quiz.answered) body += '<p class="muted small" style="margin:0">Gira el modelo y usa las capas si hace falta.</p>';
  } else {
    const boxes = store.get('cards', {});
    const lvl = boxes[e.id] || 0;
    body = `<div class="flash"><div class="muted small">Ficha · nivel ${lvl}/5</div><h3>${esc(e.d.nombre)}</h3><div class="muted small">${e.tipo === 'musculo' ? 'Recuerda origen, inserción, nervio y acción' : 'Recuerda qué es, con qué articula y qué músculos se anclan'}</div>
      ${quiz.revealed ? '' : '<button class="btn primary" data-act="studyReveal" style="justify-self:center">Mostrar respuesta</button>'}</div>`;
    if (quiz.revealed) body += `${quickSummary(e, true)}<div class="actions"><button class="btn" data-act="studyAgain">🔁 Repasar otra vez</button><button class="btn primary" data-act="studyKnew">✔ Lo sabía</button></div>`;
  }
  if (t && quiz.answered && !examDone) {
    const fb = qm() === 'loc' && !quiz.wasOk ? `Marcaste ${esc(quiz.clicked)}. La respuesta está en naranja.` : '';
    body += `<div class="feedback ${quiz.wasOk ? 'ok' : 'bad'}"><b>${quiz.wasOk ? '✔ ¡Correcto!' : '✘ No exactamente'}</b> ${fb}<div style="margin-top:8px">${quickSummary(e, true)}</div></div>
      <div class="actions"><button class="btn primary" data-act="studyNext">${quiz.mode === 'exam' && quiz.exam.results.length >= EXAM_N ? 'Ver resultado' : 'Siguiente →'}</button>${quiz.mode === 'exam' ? '' : '<button class="btn" data-act="studyOpen">Ver ficha completa</button>'}</div>`;
  } else if (t && qm() !== 'cards' && quiz.mode !== 'exam') body += '<div class="actions"><button class="btn ghost sm" data-act="studyNext">Saltar</button></div>';
  const boxes = store.get('cards', {});
  const counts = [1, 2, 3, 4, 5].map((b) => Object.values(boxes).filter((v) => v === b).length);
  sheetBody.innerHTML = `<div class="kicker">🎓 Modo estudio${state.region ? ` · ${esc(REGIONS[state.region])}` : ''}</div>
    <div class="seg small study-modes" style="margin:8px 40px 8px 0">${modes.map(([k, v]) => `<button data-act="studyMode" data-v="${k}" class="${quiz.mode === k ? 'on' : ''}">${v}</button>`).join('')}</div>
    <div class="pane" style="padding-top:4px">${body}<div class="peek-end"></div>
    <div class="score"><div class="stat"><b>${quiz.ok}/${quiz.total}</b><span>Aciertos</span></div><div class="stat"><b>${quiz.streak}</b><span>Racha</span></div><div class="stat"><b>${quiz.best}</b><span>Mejor racha</span></div></div>
    ${quiz.mode === 'cards' ? `<div class="block"><h3>Tus fichas por nivel</h3><div class="boxes">${counts.map((c, i) => `<div><i class="${c ? 'f' : ''}"></i>N${i + 1}: ${c}</div>`).join('')}</div></div>` : ''}
    <div class="block"><h3>Qué preguntar</h3><div class="seg small">${scopes.map(([k, v]) => `<button data-act="studyScope" data-v="${k}" class="${quiz.scope === k ? 'on' : ''}">${v}</button>`).join('')}</div><p class="muted small" style="margin:6px 0 0">La región se elige en el panel Explorar. Solo se pregunta lo que está visible en el modelo.</p></div>
    </div>`;
}

$('#btnStudy').addEventListener('click', () => (state.mode === 'study' ? closeAll() : openStudy()));

// ===========================================================================
// Paneles, hoja inferior y ayuda
// ===========================================================================
$('#btnMenu').addEventListener('click', () => {
  if (isMobile()) document.body.classList.toggle('side-open');
  else {
    document.body.classList.toggle('side-closed');
    document.body.classList.remove('side-auto');
    store.set('sideClosed', document.body.classList.contains('side-closed'));
  }
});
$('#sheetClose').addEventListener('click', () => {
  if (state.mode === 'welcome') store.set('welcomed', true);
  closeAll();
});
// arrastre de la hoja inferior (móvil)
(() => {
  const grip = $('#sheetGrip');
  let y0 = null;
  grip.addEventListener('pointerdown', (ev) => {
    y0 = ev.clientY;
    grip.setPointerCapture(ev.pointerId);
  });
  grip.addEventListener('pointerup', (ev) => {
    if (y0 == null) return;
    const dy = ev.clientY - y0;
    y0 = null;
    const full = document.body.classList.contains('sheet-full');
    if (Math.abs(dy) < 6) openSheet(!full);
    else if (dy < -30) openSheet(true);
    else if (dy > 30) {
      if (full) openSheet(false);
      else closeAll();
    }
  });
})();
$('#btnHelp').addEventListener('click', () => ($('#help').hidden = false));
$('#helpClose').addEventListener('click', () => ($('#help').hidden = true));
$('#help').addEventListener('click', (ev) => {
  if (ev.target.id === 'help') $('#help').hidden = true;
});

let toastTimer = null;
function toast(msg, ms = 3500) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  if (ms) toastTimer = setTimeout(() => (t.hidden = true), ms);
}
function hideToast() {
  $('#toast').hidden = true;
}

document.addEventListener('keydown', (ev) => {
  if (ev.target.matches('input, textarea, select')) return;
  if (ev.key === 'Escape') {
    if (!$('#help').hidden) $('#help').hidden = true;
    else closeAll();
  } else if (ev.key === '/') {
    ev.preventDefault();
    searchInput.focus();
  } else if (state.mode === 'lesson' && (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft')) {
    goStep(state.lesson.step + (ev.key === 'ArrowRight' ? 1 : -1));
  } else if (ev.key.toLowerCase() === 'f' && state.mode === 'structure') handleAction('focus');
  else if (ev.key.toLowerCase() === 'h' && state.mode === 'structure') handleAction('hide');
});

// ===========================================================================
// Bucle de render
// ===========================================================================
function resize() {
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(1, h);
  camera.updateProjectionMatrix();
  needsRender = true;
}
new ResizeObserver(resize).observe(stage);

function loop(now) {
  requestAnimationFrame(loop);
  if (tween) {
    const k = Math.min(1, (now - tween.t0) / tween.ms);
    const s = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    controls.target.lerpVectors(tween.fromT, tween.toT, s);
    camera.position.lerpVectors(tween.fromP, tween.toP, s);
    if (k >= 1) tween = null;
    needsRender = true;
  }
  if (controls.update()) needsRender = true;
  processHover();
  if (needsRender) {
    renderer.render(scene, camera);
    positionLabels();
    needsRender = false;
  }
}
controls.addEventListener('start', () => (tween = null));

// ===========================================================================
// Arranque
// ===========================================================================
function openFromHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (!h) return false;
  if (h.startsWith('leccion=')) return startLesson(h.slice(8)), true;
  if (h.startsWith('nervio=')) return selectNerve(h.slice(7)), true;
  const [id, side] = h.split(':');
  if (S[id]) {
    selectStructure(id, side || null, { focus: true });
    return true;
  }
  return false;
}

function start() {
  if (!isMobile() && store.get('sideClosed', false)) document.body.classList.add('side-closed');
  buildModel();
  renderRegionSelect();
  renderList();
  renderLessonList();
  renderNerveList();
  renderProgress();
  resize();
  applyVisibility();
  const firstMobile = isMobile() && !store.get('welcomed', false);
  if (firstMobile) store.set('welcomed', true);
  if (!openFromHash()) {
    if (!store.get('welcomed', false) && !isMobile()) {
      setMode('welcome');
      renderSheet();
    } else if (firstMobile) toast('👋 Toca un hueso o músculo para ver su ficha. En ☰ tienes la lista, lecciones y nervios.', 7000);
    else toast(isMobile() ? 'Toca un hueso o músculo para ver su ficha' : 'Haz clic en un hueso o músculo para ver su ficha', 5000);
  }
  $('#loading').classList.add('done');
  requestAnimationFrame(loop);
}
window.addEventListener('hashchange', () => {
  navigatingHistory = true;
  try {
    openFromHash();
  } finally {
    navigatingHistory = false;
  }
});

// deja pintar el indicador de carga antes de construir la geometría
requestAnimationFrame(() =>
  setTimeout(() => {
    try {
      start();
    } catch (err) {
      console.error(err);
      $('#loading').innerHTML = `<p>No se pudo construir el modelo 3D.<br><small>${esc(err.message)}</small></p>`;
    }
  }, 30),
);
