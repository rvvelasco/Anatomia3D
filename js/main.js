import * as THREE from 'three';
import { OrbitControls } from '../vendor/OrbitControls.js';
import { buildSkeleton, buildCartilage, buildTeeth, buildCavities } from './model/skeleton.js';
import { buildMuscles } from './model/muscles.js';
import { BONES } from './data/bones.js';
import { MUSCLES } from './data/muscles.js';

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------
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
const CAPAS = { 1: 'Capa superficial', 2: 'Capa intermedia', 3: 'Capa profunda' };
const SIDE_NAME = { d: 'derecho', i: 'izquierdo' };
const COL = {
  bone: new THREE.Color('#e9dfc6'),
  sel: new THREE.Color('#f2a93b'),
  o: new THREE.Color('#3ddc84'),
  i: new THREE.Color('#4c9dff'),
  b: new THREE.Color('#ffd35a'),
  a: new THREE.Color('#b27cff'),
};
const isMobile = () => window.matchMedia('(max-width: 860px)').matches;
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// ---------------------------------------------------------------------------
// Índice de estructuras
// ---------------------------------------------------------------------------
const S = {}; // id -> { id, tipo, d, meshes: [] }
for (const [id, d] of Object.entries(BONES)) S[id] = { id, tipo: 'hueso', d, meshes: [] };
for (const [id, d] of Object.entries(MUSCLES)) S[id] = { id, tipo: 'musculo', d, meshes: [] };
// Músculos que se originan / insertan en cada hueso
for (const b of Object.values(BONES)) {
  b.musOrigen = [];
  b.musInsercion = [];
}
for (const [mid, m] of Object.entries(MUSCLES)) {
  for (const b of new Set(m.oh)) BONES[b]?.musOrigen.push(mid);
  for (const b of new Set(m.ih)) BONES[b]?.musInsercion.push(mid);
}
const groupOf = (e) => e.d.grupo || DEFAULT_GROUP[e.d.region] || 'Otros';

// ---------------------------------------------------------------------------
// Escena
// ---------------------------------------------------------------------------
const canvas = $('#canvas');
const stage = $('#stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 1, 3000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.12;
controls.minDistance = 12;
controls.maxDistance = 700;
controls.target.set(0, 90, 0);
camera.position.set(0, 100, 390);

scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3f4a, 1.5));
const key = new THREE.DirectionalLight(0xffffff, 1.7);
key.position.set(80, 160, 160);
scene.add(key);
const rim = new THREE.DirectionalLight(0xbfd4ff, 0.9);
rim.position.set(-120, 80, -160);
scene.add(rim);
const fill = new THREE.DirectionalLight(0xffffff, 0.5);
fill.position.set(-100, 40, 120);
scene.add(fill);

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
  let base;
  if (tipo === 'hueso') base = COL.bone.clone().offsetHSL(0, 0, (hash(p.id) - 0.5) * 0.04);
  else {
    const h = hash(p.id);
    base = new THREE.Color().setHSL(0.005 + h * 0.025, 0.52 + h * 0.08, 0.38 + ((h * 7) % 1) * 0.08);
  }
  const mat = new THREE.MeshStandardMaterial({ color: base.clone(), roughness: tipo === 'hueso' ? 0.62 : 0.5, metalness: 0, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(p.geo, mat);
  mesh.userData = { id: p.id, side: p.side, key: p.key, tipo, base };
  e.meshes.push(mesh);
  allMeshes.push(mesh);
  scene.add(mesh);
}

function buildModel() {
  for (const p of buildSkeleton()) addPart(p, 'hueso');
  for (const p of buildMuscles()) addPart(p, 'musculo');
  const cart = new THREE.Mesh(buildCartilage(), new THREE.MeshStandardMaterial({ color: '#a9cbe0', roughness: 0.4 }));
  const teeth = new THREE.Mesh(buildTeeth(), new THREE.MeshStandardMaterial({ color: '#fbf8ef', roughness: 0.3 }));
  const cav = new THREE.Mesh(buildCavities(), new THREE.MeshStandardMaterial({ color: '#2a1d1a', roughness: 1 }));
  cart.userData.cart = true;
  for (const m of [cart, teeth, cav]) {
    auxMeshes.push(m);
    scene.add(m);
  }
}

// ---------------------------------------------------------------------------
// Estado
// ---------------------------------------------------------------------------
const state = {
  type: 'todo',
  region: null,
  isolateRegion: false,
  showBones: true,
  showMuscles: true,
  showCart: true,
  depth: 1,
  opacity: 1,
  side: 'ambos',
  dim: true,
  sel: null, // { id, side }
  hover: null,
  hidden: new Set(),
  isolate: null, // Set de meshes
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

// Calcula el papel de cada malla respecto a la selección (s, o, i, b, a)
function computeRoles(sel) {
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

let roles = new Map();
function applyColors() {
  roles = quiz.active ? quizRoles() : computeRoles(state.sel);
  const dimming = (state.sel || quiz.active) && state.dim && roles.size > 0;
  for (const m of allMeshes) {
    const u = m.userData;
    const mat = m.material;
    const r = roles.get(m);
    mat.color.copy(u.base);
    mat.emissive.setRGB(0, 0, 0);
    let op = u.tipo === 'musculo' ? state.opacity : 1;
    if (r) {
      const c = COL[r === 's' ? 'sel' : r];
      mat.color.lerp(c, r === 's' ? 0.55 : 0.6);
      mat.emissive.copy(c).multiplyScalar(r === 's' ? 0.28 : 0.16);
      op = 1;
    } else if (dimming) {
      op = Math.min(op, u.tipo === 'hueso' ? 0.35 : 0.12);
    }
    if (state.hover === m && !quiz.active) mat.emissive.add(new THREE.Color(0x2a2a2a));
    mat.opacity = op;
    mat.transparent = op < 0.999;
    mat.depthWrite = op > 0.5;
  }
  needsRender = true;
  renderLegend();
}

function renderLegend() {
  const lg = $('#legend');
  if (!state.sel || quiz.active) {
    lg.hidden = true;
    return;
  }
  const e = S[state.sel.id];
  lg.hidden = false;
  lg.innerHTML = e.tipo === 'musculo'
    ? `<span><i class="sw sw-s"></i> ${esc(e.d.nombre)}</span><span><i class="sw sw-o"></i> Hueso de origen</span><span><i class="sw sw-i"></i> Hueso de inserción</span><span><i class="sw sw-b"></i> Origen e inserción</span>`
    : `<span><i class="sw sw-s"></i> ${esc(e.d.nombre)}</span><span><i class="sw sw-o"></i> Músculos que se originan</span><span><i class="sw sw-i"></i> Músculos que se insertan</span><span><i class="sw sw-b"></i> Ambos</span><span><i class="sw sw-a"></i> Huesos con los que articula</span>`;
}

// ---------------------------------------------------------------------------
// Cámara
// ---------------------------------------------------------------------------
let tween = null;
function animateCamera(target, position, ms = 650) {
  tween = { t0: performance.now(), ms, fromT: controls.target.clone(), toT: target.clone(), fromP: camera.position.clone(), toP: position.clone() };
}
function focusMeshes(meshes, dirOverride = null) {
  const vis = meshes.filter((m) => m.visible);
  const list = vis.length ? vis : meshes;
  if (!list.length) return;
  const box = new THREE.Box3();
  list.forEach((m) => box.expandByObject(m));
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const r = Math.max(sphere.radius, 4);
  const vf = THREE.MathUtils.degToRad(camera.fov / 2);
  const hf = Math.atan(Math.tan(vf) * camera.aspect);
  const dist = (r / Math.sin(Math.min(vf, hf))) * 1.4;
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
  animateCamera(sphere.center, sphere.center.clone().addScaledVector(dir, Math.min(Math.max(dist, 30), 600)));
}
function setView(v) {
  const t = controls.target.clone();
  const d = Math.max(camera.position.distanceTo(t), 60);
  const dirs = { front: [0, 0.05, 1], back: [0, 0.05, -1], right: [-1, 0.05, 0], left: [1, 0.05, 0] };
  if (v === 'reset') {
    state.hidden.clear();
    state.isolate = null;
    applyVisibility();
    animateCamera(new THREE.Vector3(0, 90, 0), new THREE.Vector3(0, 100, 390));
    renderInfo();
    return;
  }
  animateCamera(t, t.clone().add(new THREE.Vector3(...dirs[v]).normalize().multiplyScalar(d)));
}

// ---------------------------------------------------------------------------
// Selección
// ---------------------------------------------------------------------------
function select(id, side = null, { focus = false, fromList = false } = {}) {
  if (!id || !S[id]) {
    state.sel = null;
    applyColors();
    renderInfo();
    updateListSel();
    setHash();
    return;
  }
  const e = S[id];
  if (side && !e.meshes.some((m) => m.userData.side === side)) side = null;
  state.sel = { id, side };
  // si la estructura está oculta por filtros, la hacemos visible
  const sm = e.meshes.filter((m) => sideMatch(state.sel, m));
  sm.forEach((m) => state.hidden.delete(m.userData.key));
  if (state.isolate && !sm.some((m) => state.isolate.has(m))) state.isolate = null;
  if (e.tipo === 'musculo') {
    if (!state.showMuscles) setCheck('showMuscles', true);
    if (e.d.capa < state.depth) setDepth(1);
  } else if (!state.showBones) setCheck('showBones', true);
  if (state.isolateRegion && state.region && e.d.region !== state.region) setCheck('isolateRegion', false);
  applyVisibility();
  renderInfo();
  updateListSel();
  setHash();
  if (focus) focusMeshes(sm);
  if (isMobile() && fromList) {
    $('#panelLeft').classList.remove('open');
    $('#panelRight').classList.add('open');
  }
}

function setCheck(idName, v) {
  $('#' + idName).checked = v;
  state[idName] = v;
}

function setHash() {
  const h = state.sel ? `#${state.sel.id}${state.sel.side ? ':' + state.sel.side : ''}` : ' ';
  try {
    history.replaceState(null, '', h === ' ' ? location.pathname + location.search : h);
  } catch {
    /* sin historial */
  }
}

// ---------------------------------------------------------------------------
// Ficha de información
// ---------------------------------------------------------------------------
function linkBtn(id, cls = '', extra = '') {
  const e = S[id];
  if (!e) return '';
  return `<button class="link ${cls}" data-go="${id}"><span class="dot ${e.tipo}"></span>${esc(e.d.nombre)}${extra ? ` <small>${esc(extra)}</small>` : ''}</button>`;
}
const links = (ids, cls) => {
  const u = [...new Set(ids)].filter((x) => S[x]);
  return u.length ? `<div class="links">${u.map((x) => linkBtn(x, cls)).join('')}</div>` : '<p class="muted">—</p>';
};

function renderInfo() {
  const box = $('#info');
  if (!state.sel) {
    box.innerHTML = box.dataset.empty;
    return;
  }
  const { id, side } = state.sel;
  const e = S[id];
  const d = e.d;
  const sideTxt = side ? `<span class="side-tag">(${SIDE_NAME[side]})</span>` : d.bilateral ? '<span class="side-tag">(ambos lados)</span>' : '';
  const anyHidden = state.hidden.size || state.isolate;
  let h = `<h2>${esc(d.nombre)} ${sideTxt}</h2><div class="latin">${esc(d.latin || '')}</div>
  <div class="badges"><span class="badge ${e.tipo}">${e.tipo === 'hueso' ? 'Hueso' : 'Músculo'}</span><span class="badge">${esc(REGIONS[d.region])}</span><span class="badge">${esc(groupOf(e))}</span>${e.tipo === 'musculo' ? `<span class="badge">${CAPAS[d.capa]}</span>` : `<span class="badge">${esc(d.clase || '')}</span>`}${d.bilateral ? '<span class="badge">Par</span>' : '<span class="badge">Impar</span>'}</div>
  <div class="actions">
    <button class="btn" data-act="focus">🎯 Centrar</button>
    <button class="btn" data-act="isolate">🔍 Aislar con conexiones</button>
    <button class="btn" data-act="hide">🙈 Ocultar</button>
    ${anyHidden ? '<button class="btn" data-act="showall">👁 Mostrar todo</button>' : ''}
  </div>`;
  if (e.tipo === 'musculo') {
    h += `<div class="sec"><h3>Acción</h3><p>${esc(d.accion)}</p></div>
    <div class="sec"><h3>Origen</h3><p>${esc(d.origen)}</p>${d.oh.length ? `<div style="margin-top:6px">${links(d.oh, 'o')}</div>` : ''}</div>
    <div class="sec"><h3>Inserción</h3><p>${esc(d.insercion)}</p>${d.ih.length ? `<div style="margin-top:6px">${links(d.ih, 'i')}</div>` : ''}</div>
    <div class="sec kv"><div><b>Inervación</b>${esc(d.inervacion)}</div><div><b>Irrigación</b>${esc(d.irrigacion)}</div></div>`;
    if (d.sinergistas?.length) h += `<div class="sec"><h3>Sinergistas (trabajan junto a él)</h3>${links(d.sinergistas)}</div>`;
    if (d.antagonistas?.length) h += `<div class="sec"><h3>Antagonistas (acción opuesta)</h3>${links(d.antagonistas)}</div>`;
  } else {
    h += `<div class="sec"><h3>Descripción</h3><p>${esc(d.descripcion)}</p></div>`;
    if (d.partes?.length) h += `<div class="sec"><h3>Partes y accidentes óseos</h3><ul>${d.partes.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>`;
    h += `<div class="sec"><h3>Articulaciones (con qué hueso conecta)</h3>${d.articulaciones.length ? `<div class="links">${d.articulaciones.map(([b, n]) => linkBtn(b, 'a', n)).join('')}</div>` : '<p class="muted">No se articula con ningún hueso.</p>'}</div>`;
    h += `<div class="sec"><h3>Músculos que se originan aquí (${d.musOrigen.length})</h3>${links(d.musOrigen, 'o')}</div>`;
    h += `<div class="sec"><h3>Músculos que se insertan aquí (${d.musInsercion.length})</h3>${links(d.musInsercion, 'i')}</div>`;
  }
  if (e.tipo === 'musculo' && d.descripcion) h += `<div class="sec"><h3>Descripción</h3><p>${esc(d.descripcion)}</p></div>`;
  if (d.clinica) h += `<div class="sec"><h3>Nota clínica</h3><p class="clin">${esc(d.clinica)}</p></div>`;
  box.innerHTML = h;
  box.scrollTop = 0;
  $('#panelRight').scrollTop = 0;
}

$('#info').addEventListener('click', (ev) => {
  const go = ev.target.closest('[data-go]');
  if (go) {
    select(go.dataset.go, state.sel?.side || null, { focus: true });
    return;
  }
  const act = ev.target.closest('[data-act]')?.dataset.act;
  if (!act || !state.sel) return;
  const e = S[state.sel.id];
  const own = e.meshes.filter((m) => sideMatch(state.sel, m));
  if (act === 'focus') focusMeshes(own);
  if (act === 'hide') {
    own.forEach((m) => state.hidden.add(m.userData.key));
    state.sel = null;
    applyVisibility();
    renderInfo();
    updateListSel();
    setHash();
  }
  if (act === 'isolate') {
    state.isolate = new Set(computeRoles(state.sel).keys());
    applyVisibility();
    renderInfo();
    focusMeshes([...state.isolate]);
  }
  if (act === 'showall') {
    state.hidden.clear();
    state.isolate = null;
    applyVisibility();
    renderInfo();
  }
});

// ---------------------------------------------------------------------------
// Lista lateral y filtros
// ---------------------------------------------------------------------------
function entryMatchesFilters(e) {
  if (state.type !== 'todo' && e.tipo !== state.type) return false;
  if (state.region && e.d.region !== state.region) return false;
  return true;
}

function renderList() {
  const list = $('#list');
  let html = '';
  let count = 0;
  for (const [rk, rn] of Object.entries(REGIONS)) {
    const items = Object.values(S).filter((e) => e.d.region === rk && entryMatchesFilters(e));
    if (!items.length) continue;
    count += items.length;
    const groups = new Map();
    for (const e of items) {
      const g = `${e.tipo === 'hueso' ? 'Huesos' : 'Músculos'} · ${groupOf(e)}`;
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(e);
    }
    const ordered = [...groups.entries()].sort((a, b) => (a[0].startsWith('Huesos') ? 0 : 1) - (b[0].startsWith('Huesos') ? 0 : 1));
    html += `<details ${state.region ? 'open' : ''} data-region="${rk}"><summary>${rn} <span class="muted small">${items.length}</span></summary>`;
    for (const [g, arr] of ordered) {
      html += `<div class="grp">${esc(g)}</div>`;
      html += arr.map((e) => `<button class="item" data-id="${e.id}"><span class="dot ${e.tipo}"></span>${esc(e.d.nombre)}</button>`).join('');
    }
    html += '</details>';
  }
  list.innerHTML = html || '<p class="muted" style="padding:12px">Sin resultados</p>';
  $('#listCount').textContent = `${count} estructuras`;
  updateListSel();
}

function updateListSel() {
  document.querySelectorAll('#list .item.sel').forEach((b) => b.classList.remove('sel'));
  if (!state.sel) return;
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
  if (it) select(it.dataset.id, null, { focus: true, fromList: true });
});

function renderChips() {
  const c = $('#regionChips');
  c.innerHTML = `<button class="chip ${state.region ? '' : 'on'}" data-r="">Todas</button>` + Object.entries(REGIONS).map(([k, v]) => `<button class="chip ${state.region === k ? 'on' : ''}" data-r="${k}">${v}</button>`).join('');
}
$('#regionChips').addEventListener('click', (ev) => {
  const b = ev.target.closest('.chip');
  if (!b) return;
  state.region = b.dataset.r || null;
  renderChips();
  renderList();
  applyVisibility();
  if (state.isolateRegion && state.region) {
    focusMeshes(allMeshes.filter((m) => m.visible), new THREE.Vector3(0, 0.05, 1).normalize());
  }
});
$('#typeFilter').addEventListener('click', (ev) => {
  const b = ev.target.closest('button');
  if (!b) return;
  state.type = b.dataset.type;
  segOn('#typeFilter', b);
  renderList();
});
function segOn(sel, btn) {
  document.querySelectorAll(sel + ' button').forEach((x) => x.classList.toggle('on', x === btn));
}

// Capas
for (const k of ['showBones', 'showMuscles', 'showCart', 'isolateRegion', 'dimOthers']) {
  $('#' + k).addEventListener('change', (ev) => {
    if (k === 'dimOthers') state.dim = ev.target.checked;
    else state[k] = ev.target.checked;
    applyVisibility();
  });
}
function setDepth(d) {
  state.depth = d;
  segOn('#depthSeg', document.querySelector(`#depthSeg button[data-d="${d}"]`));
}
$('#depthSeg').addEventListener('click', (ev) => {
  const b = ev.target.closest('button');
  if (!b) return;
  setDepth(+b.dataset.d);
  applyVisibility();
});
$('#sideSeg').addEventListener('click', (ev) => {
  const b = ev.target.closest('button');
  if (!b) return;
  state.side = b.dataset.s;
  segOn('#sideSeg', b);
  applyVisibility();
});
$('#muscleOpacity').addEventListener('input', (ev) => {
  state.opacity = +ev.target.value;
  applyColors();
});
$('#layers .layers-title').addEventListener('click', () => $('#layers').classList.toggle('collapsed'));
document.querySelectorAll('.views button').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));

// ---------------------------------------------------------------------------
// Búsqueda
// ---------------------------------------------------------------------------
const searchIndex = Object.values(S).map((e) => ({
  e,
  name: norm(e.d.nombre),
  latin: norm(e.d.latin),
  extra: norm([e.d.grupo, e.d.inervacion, e.d.accion, e.d.origen, e.d.insercion, e.d.descripcion].join(' ')),
}));
let searchSel = 0;
function doSearch(q) {
  const box = $('#searchResults');
  const n = norm(q).trim();
  if (n.length < 2) {
    box.hidden = true;
    return [];
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
    if (score) res.push({ ...it, score });
  }
  res.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  const top = res.slice(0, 40);
  searchSel = 0;
  box.innerHTML = top.length
    ? top.map((r, i) => `<button data-id="${r.e.id}" class="${i === 0 ? 'active' : ''}"><span class="dot ${r.e.tipo}"></span><span>${esc(r.e.d.nombre)}<br><small class="muted">${r.score <= 30 ? 'coincide en: inervación / acción / descripción' : esc(REGIONS[r.e.d.region])}</small></span></button>`).join('')
    : '<p class="muted" style="padding:8px 10px;margin:0">Sin resultados</p>';
  box.hidden = false;
  return top;
}
const searchInput = $('#search');
searchInput.addEventListener('input', () => doSearch(searchInput.value));
searchInput.addEventListener('keydown', (ev) => {
  const box = $('#searchResults');
  const btns = [...box.querySelectorAll('button')];
  if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
    ev.preventDefault();
    searchSel = (searchSel + (ev.key === 'ArrowDown' ? 1 : -1) + btns.length) % Math.max(1, btns.length);
    btns.forEach((b, i) => b.classList.toggle('active', i === searchSel));
    btns[searchSel]?.scrollIntoView({ block: 'nearest' });
  } else if (ev.key === 'Enter' && btns[searchSel]) {
    pickSearch(btns[searchSel].dataset.id);
  } else if (ev.key === 'Escape') {
    box.hidden = true;
    searchInput.blur();
  }
});
$('#searchResults').addEventListener('click', (ev) => {
  const b = ev.target.closest('button[data-id]');
  if (b) pickSearch(b.dataset.id);
});
function pickSearch(id) {
  $('#searchResults').hidden = true;
  searchInput.value = '';
  select(id, null, { focus: true, fromList: true });
}
document.addEventListener('click', (ev) => {
  if (!ev.target.closest('.search')) $('#searchResults').hidden = true;
});

// ---------------------------------------------------------------------------
// Interacción 3D (hover, clic, doble clic)
// ---------------------------------------------------------------------------
const ray = new THREE.Raycaster();
const ptr = new THREE.Vector2();
const tooltip = $('#tooltip');
let lastMove = null;
let downAt = null;

function pick(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  ptr.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(allMeshes.filter((m) => m.visible), false);
  if (!hits.length) return null;
  const solid = hits.find((h) => h.object.material.opacity > 0.3);
  return (solid || hits[0]).object;
}

function labelFor(m) {
  const e = S[m.userData.id];
  return `${e.d.nombre}${m.userData.side ? ` (${SIDE_NAME[m.userData.side]})` : ''}`;
}

canvas.addEventListener('pointermove', (ev) => {
  if (ev.pointerType !== 'mouse') return;
  lastMove = ev;
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
    applyColors();
  }
  canvas.style.cursor = m ? 'pointer' : 'grab';
  if (m && !quiz.active) {
    const r = stage.getBoundingClientRect();
    tooltip.hidden = false;
    tooltip.textContent = labelFor(m);
    tooltip.style.left = ev.clientX - r.left + 'px';
    tooltip.style.top = ev.clientY - r.top + 'px';
  } else tooltip.hidden = true;
}

canvas.addEventListener('pointerdown', (ev) => {
  downAt = { x: ev.clientX, y: ev.clientY, t: performance.now(), drag: false };
  if (isMobile()) {
    $('#panelLeft').classList.remove('open');
  }
});
canvas.addEventListener('pointermove', (ev) => {
  if (downAt && Math.hypot(ev.clientX - downAt.x, ev.clientY - downAt.y) > 6) downAt.drag = true;
});
let lastClick = { t: 0, m: null };
canvas.addEventListener('pointerup', (ev) => {
  if (!downAt) return;
  const wasDrag = downAt.drag || performance.now() - downAt.t > 600;
  downAt = null;
  if (wasDrag) return;
  const m = pick(ev.clientX, ev.clientY);
  const now = performance.now();
  if (quiz.active) {
    if (quiz.mode === 'loc' && m) quizLocate(m);
    return;
  }
  if (m && lastClick.m === m && now - lastClick.t < 350) {
    focusMeshes([m]);
    lastClick = { t: 0, m: null };
    return;
  }
  lastClick = { t: now, m };
  if (m) select(m.userData.id, m.userData.side);
  else select(null);
});

// ---------------------------------------------------------------------------
// Modo estudio (quiz)
// ---------------------------------------------------------------------------
const quiz = { active: false, mode: 'id', type: 'todo', target: null, answered: false, ok: 0, total: 0, streak: 0, best: 0 };
try {
  quiz.best = +(localStorage.getItem('anatomia3d.best') || 0);
} catch {
  /* almacenamiento no disponible */
}

function quizRoles() {
  const r = new Map();
  if (quiz.target && (quiz.mode === 'id' || quiz.answered)) r.set(quiz.target, 's');
  return r;
}

function quizPool() {
  return allMeshes.filter((m) => {
    const e = S[m.userData.id];
    if (quiz.type !== 'todo' && e.tipo !== quiz.type) return false;
    if (state.region && e.d.region !== state.region) return false;
    return meshVisible(m);
  });
}

function quizNext() {
  quiz.answered = false;
  const pool = quizPool();
  const ids = new Set(pool.map((m) => m.userData.id));
  if (ids.size < 4) {
    $('#quizQ').innerHTML = 'No hay suficientes estructuras visibles para esta selección. Cambia la región, el tipo o las capas visibles.';
    $('#quizOpts').innerHTML = '';
    quiz.target = null;
    applyColors();
    return;
  }
  // evita repetir la misma estructura
  let m;
  for (let k = 0; k < 10; k++) {
    m = pool[Math.floor(Math.random() * pool.length)];
    if (m.userData.id !== quiz.target?.userData.id) break;
  }
  quiz.target = m;
  const e = S[m.userData.id];
  state.sel = null;
  renderInfo();
  if (quiz.mode === 'id') {
    $('#quizQ').innerHTML = '¿Qué estructura está resaltada en <span class="target">naranja</span>?';
    const same = [...ids].filter((x) => x !== e.id && S[x].tipo === e.tipo);
    const others = [...ids].filter((x) => x !== e.id && S[x].tipo !== e.tipo);
    const shuffled = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
    const near = shuffled(same.filter((x) => S[x].d.region === e.d.region));
    const far = shuffled(same.filter((x) => S[x].d.region !== e.d.region));
    const distract = [...near, ...far, ...shuffled(others)].slice(0, 3);
    const opts = shuffled([e.id, ...distract]);
    $('#quizOpts').innerHTML = opts.map((x) => `<button data-q="${x}">${esc(S[x].d.nombre)}</button>`).join('');
    focusMeshes([m]);
  } else {
    $('#quizQ').innerHTML = `Haz clic sobre: <span class="target">${esc(e.d.nombre)}</span>${m.userData.side ? ` <span class="muted">(lado ${SIDE_NAME[m.userData.side]})</span>` : ''}`;
    $('#quizOpts').innerHTML = '';
  }
  applyColors();
  updateScore();
}

function updateScore() {
  $('#quizScore').innerHTML = `Aciertos: <b>${quiz.ok}</b> / ${quiz.total} · Racha: ${quiz.streak} · Mejor: ${quiz.best}`;
}
function registerAnswer(ok) {
  quiz.answered = true;
  quiz.total++;
  if (ok) {
    quiz.ok++;
    quiz.streak++;
    if (quiz.streak > quiz.best) {
      quiz.best = quiz.streak;
      try {
        localStorage.setItem('anatomia3d.best', String(quiz.best));
      } catch {
        /* almacenamiento no disponible */
      }
    }
  } else quiz.streak = 0;
  updateScore();
  // muestra la ficha para aprender
  state.sel = { id: quiz.target.userData.id, side: quiz.target.userData.side };
  renderInfo();
  if (isMobile()) $('#panelRight').classList.add('open');
  applyColors();
}

$('#quizOpts').addEventListener('click', (ev) => {
  const b = ev.target.closest('button[data-q]');
  if (!b || quiz.answered || !quiz.target) return;
  const ok = b.dataset.q === quiz.target.userData.id;
  b.classList.add(ok ? 'ok' : 'bad');
  if (!ok) $(`#quizOpts button[data-q="${quiz.target.userData.id}"]`)?.classList.add('ok');
  registerAnswer(ok);
});

function quizLocate(m) {
  if (quiz.answered || !quiz.target) return;
  const e = S[quiz.target.userData.id];
  const ok = m.userData.id === e.id && (!quiz.target.userData.side || m.userData.side === quiz.target.userData.side);
  const clicked = labelFor(m);
  $('#quizQ').innerHTML = ok
    ? `<span class="feedback-ok">✔ ¡Correcto!</span> ${esc(labelFor(quiz.target))}`
    : `<span class="feedback-bad">✘ Has marcado ${esc(clicked)}.</span> La respuesta está resaltada en <span class="target">naranja</span>.`;
  registerAnswer(ok);
  if (!ok) focusMeshes([quiz.target]);
}

function openQuiz(on) {
  quiz.active = on;
  $('#quiz').hidden = !on;
  $('#btnQuiz').classList.toggle('primary', on);
  tooltip.hidden = true;
  if (on) {
    quiz.ok = quiz.total = quiz.streak = 0;
    quizNext();
  } else {
    quiz.target = null;
    applyColors();
  }
}
$('#btnQuiz').addEventListener('click', () => openQuiz(!quiz.active));
$('#quizClose').addEventListener('click', () => openQuiz(false));
$('#quizNext').addEventListener('click', quizNext);
$('#quizMode').addEventListener('click', (ev) => {
  const b = ev.target.closest('button');
  if (!b) return;
  quiz.mode = b.dataset.m;
  segOn('#quizMode', b);
  quizNext();
});
$('#quizType').addEventListener('click', (ev) => {
  const b = ev.target.closest('button');
  if (!b) return;
  quiz.type = b.dataset.t;
  segOn('#quizType', b);
  quizNext();
});

// ---------------------------------------------------------------------------
// Paneles móviles, ayuda y teclado
// ---------------------------------------------------------------------------
$('#btnLeft').addEventListener('click', () => {
  $('#panelLeft').classList.toggle('open');
  $('#panelRight').classList.remove('open');
});
$('#btnRight').addEventListener('click', () => {
  $('#panelRight').classList.toggle('open');
  $('#panelLeft').classList.remove('open');
});
$('#btnHelp').addEventListener('click', () => ($('#help').hidden = false));
$('#helpClose').addEventListener('click', () => ($('#help').hidden = true));
$('#help').addEventListener('click', (ev) => {
  if (ev.target.id === 'help') $('#help').hidden = true;
});
document.addEventListener('keydown', (ev) => {
  if (ev.target.matches('input')) return;
  if (ev.key === 'Escape') {
    if (!$('#help').hidden) $('#help').hidden = true;
    else select(null);
  }
  if (ev.key === '/') {
    ev.preventDefault();
    searchInput.focus();
  }
});

// ---------------------------------------------------------------------------
// Bucle de render
// ---------------------------------------------------------------------------
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
    needsRender = false;
  }
}
controls.addEventListener('change', () => (needsRender = true));

// ---------------------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------------------
function start() {
  $('#info').dataset.empty = $('#info').innerHTML;
  if (isMobile()) $('#layers').classList.add('collapsed');
  buildModel();
  renderChips();
  renderList();
  resize();
  applyVisibility();
  const h = decodeURIComponent(location.hash.slice(1));
  if (h) {
    const [id, side] = h.split(':');
    if (S[id]) select(id, side || null, { focus: true });
  }
  $('#loading').classList.add('done');
  requestAnimationFrame(loop);
}
// deja pintar el indicador de carga antes de construir la geometría
requestAnimationFrame(() => setTimeout(() => {
  try {
    start();
  } catch (err) {
    console.error(err);
    $('#loading').innerHTML = `<p>No se pudo construir el modelo 3D.<br><small>${esc(err.message)}</small></p>`;
  }
}, 30));
