import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const $ = s => document.querySelector(s);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sm = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const seg = (t, a, b) => sm((t - a) / (b - a));
const rnd = (a, b) => a + Math.random() * (b - a);
const V = (x, y, z) => new THREE.Vector3(x, y, z);

/* ---------- renderer ---------- */
const renderer = new THREE.WebGLRenderer({ canvas: $('#gl'), antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0906);
scene.fog = new THREE.Fog(0x0d0906, 10, 22);
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.35;
const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 60);

/* ---------- helpers ---------- */
function tex(w, h, draw, rep) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); }
  return t;
}
const M = (color, roughness = 0.5, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
function mesh(parent, geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true; parent.add(m); return m;
}
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (a, b, h, s = 32) => new THREE.CylinderGeometry(a, b, h, s);
const sph = (r, w = 24, h = 16) => new THREE.SphereGeometry(r, w, h);

/* ---------- materials ---------- */
const steel = M(0xc4c8cc, 0.3, 1);
const dark = M(0x101010, 0.35, 0.6);
const skin = M(0xc48a66, 0.6);
const shirt = M(0xeee9df, 0.85);
const apronM = M(0x2b2521, 0.9);
const kraft = M(0xb9976a, 0.9, 0, { side: THREE.DoubleSide });
const glassM = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, thickness: 0.04, roughness: 0.03, ior: 1.45, side: THREE.DoubleSide, envMapIntensity: 1.6 });
const shardM = new THREE.MeshPhysicalMaterial({ color: 0xdff4f6, transparent: true, opacity: 0.55, roughness: 0.04, envMapIntensity: 2.2 });
const coffeeM = M(0x3a1307, 0.12, 0, { emissive: 0x1a0803 });

/* ---------- room ---------- */
const woodTex = (hue, rep) => tex(512, 512, (g, w, h) => {
  for (let i = 0; i < 16; i++) {
    g.fillStyle = `hsl(${hue},35%,${16 + Math.random() * 8}%)`; g.fillRect(i * 32, 0, 32, h);
    for (let k = 0; k < 40; k++) { g.fillStyle = `rgba(0,0,0,${Math.random() * 0.12})`; g.fillRect(i * 32 + Math.random() * 30, 0, 1, h); }
    g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(i * 32, 0, 2, h);
  }
}, rep);
const wall = new THREE.Mesh(new THREE.PlaneGeometry(34, 12), M(0xffffff, 0.8, 0, { map: woodTex(22, [3, 1]) }));
wall.position.set(0, 3, -2.7); wall.receiveShadow = true; scene.add(wall);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), M(0x120c08, 0.35, 0.1));
floor.rotation.x = -Math.PI / 2; floor.position.y = -1.9; floor.receiveShadow = true; scene.add(floor);
mesh(scene, box(16, 1.9, 3.2), M(0xffffff, 0.6, 0, { map: woodTex(20, [2, 1]) }), 0, -0.95, 0);
mesh(scene, box(16, 0.08, 3.3), new THREE.MeshPhysicalMaterial({ color: 0x2a1c14, roughness: 0.22, clearcoat: 0.7, clearcoatRoughness: 0.15 }), 0, -0.04, 0);
mesh(scene, box(16, 0.05, 0.05), M(0xffa050, 0.5, 0, { emissive: 0xff9040, emissiveIntensity: 3 }), 0, -1.75, 1.62);
mesh(scene, box(9, 0.1, 0.5), M(0x4a3020, 0.5), 1.2, 2.6, -2.4);
[[-1.6, .32], [-1.2, .26], [3.8, .3], [1.8, .28]].forEach(([x, h]) => mesh(scene, cyl(0.16, 0.12, h), M(0xd8cbb4, 0.35), x, 2.65 + h / 2, -2.4));
const plant = new THREE.Group(); plant.position.set(5, 2.65, -2.4); scene.add(plant);
mesh(plant, cyl(0.2, 0.15, 0.3), M(0x6b5038, 0.8), 0, 0.15, 0);
for (let i = 0; i < 6; i++) { const l = mesh(plant, sph(0.1), M(0x4f6b3a, 0.6), 0, 0.55, 0); l.scale.set(0.5, 2.6, 0.2); l.position.x = Math.cos(i) * 0.12; l.rotation.z = Math.cos(i) * 0.6; l.rotation.y = i; }
[-2, 1.8].forEach(x => {
  mesh(scene, cyl(0.03, 0.03, 2), dark, x, 4.6, -0.5);
  mesh(scene, cyl(0.08, 0.45, 0.4), M(0x1b1410, 0.4, 0.5), x, 3.5, -0.5);
  mesh(scene, sph(0.14), M(0xffe0b0, 0.3, 0, { emissive: 0xffc888, emissiveIntensity: 4 }), x, 3.4, -0.5);
  const pl = new THREE.PointLight(0xffc888, 45, 12); pl.position.set(x, 3.2, 0.3); scene.add(pl);
});

/* ---------- lights ---------- */
const key = new THREE.SpotLight(0xffd7a8, 480, 0, 0.55, 0.7, 2);
key.position.set(3.5, 7, 6.5); key.target.position.set(-0.8, 0.3, 0); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0002; key.shadow.normalBias = 0.02; key.shadow.camera.near = 3; key.shadow.camera.far = 30;
scene.add(key, key.target);
const rim = new THREE.SpotLight(0xffa868, 260, 0, 0.7, 0.8, 2); rim.position.set(-6, 5, -3); rim.target.position.set(-1, 1, 0); scene.add(rim, rim.target);
scene.add(new THREE.HemisphereLight(0xffe2c0, 0x1a0f08, 0.25));

/* ---------- La Marzocco Linea (2 groups) ---------- */
const machine = new THREE.Group(); machine.position.set(-2, 0, -0.2); scene.add(machine);
mesh(machine, box(2.6, 0.12, 1.6), steel, 0, 0.06, 0.3);
for (let i = 0; i < 11; i++) mesh(machine, box(0.1, 0.02, 1.4), dark, -1.1 + i * 0.22, 0.13, 0.3);
mesh(machine, box(2.4, 1.25, 1.0), steel, 0, 0.765, 0);
mesh(machine, box(2.46, 0.05, 1.06), steel, 0, 1.4, 0);
[-0.42, 0.42].forEach(z => mesh(machine, cyl(0.015, 0.015, 2.3), steel, 0, 1.47, z).rotation.z = Math.PI / 2);
mesh(machine, box(2.5, 0.06, 1.1), dark, 0, 0.16, 0);
mesh(machine, new THREE.PlaneGeometry(1, 0.25), new THREE.MeshBasicMaterial({
  map: tex(512, 128, (g, w) => { g.fillStyle = '#111'; g.fillRect(0, 0, w, 128); g.textAlign = 'center'; g.fillStyle = '#d9d9d9'; g.font = '700 40px Georgia,serif'; g.fillText('LA MARZOCCO', w / 2, 58); g.fillStyle = '#d0382f'; g.font = 'italic 34px Georgia,serif'; g.fillText('Linea', w / 2, 104); })
}), 0, 1.2, 0.505);
[-0.15, 0.15].forEach(x => { const gd = mesh(machine, cyl(0.11, 0.11, 0.03), M(0xf2f2f2, 0.3), x, 1.02, 0.515); gd.rotation.x = Math.PI / 2; mesh(machine, box(0.01, 0.08, 0.005), M(0xc0392b), x + 0.02, 1.04, 0.535).rotation.z = -0.6; });
[-0.6, 0.6].forEach(gx => {
  mesh(machine, box(0.55, 0.32, 0.36), steel, gx, 0.98, 0.68);
  mesh(machine, cyl(0.19, 0.17, 0.1), dark, gx, 0.78, 0.68);
  mesh(machine, box(0.14, 0.05, 0.1), steel, gx, 0.72, 0.68);
  [-0.06, 0.06].forEach(dx => mesh(machine, cyl(0.016, 0.016, 0.06, 12), steel, gx + dx, 0.69, 0.68));
  const h = mesh(machine, cyl(0.045, 0.06, 0.75), M(0x0c0c0c, 0.3, 0.2), gx, 0.76, 1.08); h.rotation.x = Math.PI / 2 + 0.1;
  mesh(machine, cyl(0.03, 0.03, 0.22), steel, gx, 1.22, 0.62);
});
[-1.27, 1.27].forEach(x => { const w = mesh(machine, cyl(0.022, 0.022, 0.75), steel, x, 0.82, 0.62); w.rotation.z = x > 0 ? 0.18 : -0.18; mesh(machine, sph(0.05), dark, x, 1.2, 0.56); });

/* ---------- glass cup (Lathe) ---------- */
const CUP = V(-2.6, 0.13, 0.48), SPOUT_Y = 0.68;
const cupG = new THREE.Group(); cupG.position.copy(CUP); scene.add(cupG);
const glass = new THREE.Mesh(new THREE.LatheGeometry([[0.001, 0], [0.15, 0], [0.165, 0.02], [0.185, 0.4], [0.175, 0.4], [0.155, 0.05], [0.001, 0.05]].map(p => new THREE.Vector2(...p)), 48), glassM);
glass.castShadow = true; cupG.add(glass);
const handle = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.014, 12, 24, Math.PI), glassM); handle.position.set(0.18, 0.24, 0); handle.rotation.z = -Math.PI / 2; cupG.add(handle);
const coffee = mesh(cupG, cyl(0.17, 0.156, 0.35, 40).translate(0, 0.175, 0), coffeeM, 0, 0.05, 0); coffee.scale.y = 0.001;
const crema = mesh(cupG, cyl(0.168, 0.168, 0.012, 40), M(0xb9763c, 0.4, 0, { emissive: 0x2a1204 }), 0, 0.05, 0);
const streams = [-0.06, 0.06].map(dx => {
  const s = new THREE.Mesh(cyl(0.011, 0.011, 1, 10).translate(0, -0.5, 0), M(0x8a3f1c, 0.15, 0, { emissive: 0x2a0e04 }));
  s.position.set(CUP.x + dx, SPOUT_Y, CUP.z); scene.add(s); return s;
});

/* ---------- particles ---------- */
const floorY = (x, z) => (x > -3.3 && x < -0.7 && z < 0.95 && z > -0.6) ? 0.13 : 0;
const shards = Array.from({ length: 46 }, () => {
  const s = new THREE.Mesh(new THREE.TetrahedronGeometry(0.05), shardM); s.scale.set(rnd(0.6, 1.5), rnd(0.15, 0.4), rnd(0.6, 1.4));
  s.castShadow = true; s.visible = false; s.v = V(0, 0, 0); s.w = V(0, 0, 0); scene.add(s); return s;
});
const drops = Array.from({ length: 90 }, () => {
  const d = new THREE.Mesh(sph(rnd(0.008, 0.026), 8, 6), coffeeM); d.visible = false; d.v = V(0, 0, 0); scene.add(d); return d;
});
const puddle = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshPhysicalMaterial({ color: 0x2a0d05, roughness: 0.08, clearcoat: 1 }));
puddle.rotation.x = -Math.PI / 2; puddle.position.set(CUP.x, 0.137, CUP.z); puddle.visible = false; scene.add(puddle);
const steamTex = tex(64, 64, g => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,.9)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
const steam = Array.from({ length: 14 }, (_, i) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, depthWrite: false, opacity: 0 })); s.scale.setScalar(0.35); s.userData.i = i; scene.add(s); return s; });

/* ---------- barista ---------- */
const A = 0.8;
const root = new THREE.Group(); scene.add(root);
mesh(root, new THREE.CapsuleGeometry(0.44, 0.55, 8, 20), shirt, 0, 2.15, 0);
mesh(root, box(0.8, 1.05, 0.1), apronM, 0, 1.95, 0.42);
mesh(root, box(0.6, 0.5, 0.1), apronM, 0, 2.55, 0.4);
mesh(root, cyl(0.13, 0.15, 0.25), skin, 0, 2.78, 0);
const head = new THREE.Group(); head.position.y = 3.0; root.add(head);
mesh(head, sph(0.34, 32, 24), skin);
const hair = mesh(head, new THREE.SphereGeometry(0.365, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.56), M(0x1a120d, 0.7), 0, 0.03, -0.03); hair.rotation.x = -0.4;
[-1, 1].forEach(s => {
  mesh(head, sph(0.06), skin, s * 0.34, 0, 0);
  mesh(head, sph(0.05), M(0xffffff, 0.3), s * 0.12, 0.05, 0.3);
  mesh(head, sph(0.025), M(0x120c08, 0.2), s * 0.12, 0.05, 0.345);
});
const mouth = mesh(head, sph(0.05), M(0x2a0d0d, 0.5), 0, -0.14, 0.31); mouth.scale.set(1.2, 0.25, 0.4);
const legs = [-1, 1].map(s => {
  const g = new THREE.Group(); g.position.set(s * 0.22, 1.5, 0); root.add(g);
  mesh(g, new THREE.CapsuleGeometry(0.16, 1.1, 6, 12), M(0x1d2226, 0.8), 0, -0.7, 0);
  mesh(g, box(0.28, 0.14, 0.5), M(0x0e0e0e, 0.5), 0, -1.45, 0.1); return g;
});
const cap = (r, L) => new THREE.CapsuleGeometry(r, L - 2 * r, 8, 16).rotateX(Math.PI / 2);
const arms = [1, -1].map(s => {
  const up = new THREE.Group(), lo = new THREE.Group(); scene.add(up, lo);
  mesh(up, cap(0.14, A), shirt, 0, 0, A / 2); mesh(lo, cap(0.12, A), skin, 0, 0, A / 2); mesh(lo, sph(0.16), skin, 0, 0, A + 0.02);
  return { s, up, lo };
});
function ik({ s, up, lo }, target, poleY) {
  const S = root.localToWorld(V(s * 0.55, 2.5, 0)), T = root.localToWorld(target.clone());
  const v = T.sub(S); const d = Math.min(v.length(), 2 * A * 0.999); v.normalize();
  const pole = V(s, poleY, -0.5).transformDirection(root.matrixWorld);
  const perp = pole.sub(v.clone().multiplyScalar(pole.dot(v))).normalize();
  const ca = d / (2 * A), sa = Math.sqrt(1 - ca * ca);
  const E = S.clone().addScaledVector(v, A * ca).addScaledVector(perp, A * sa);
  up.position.copy(S); up.lookAt(E); lo.position.copy(E); lo.lookAt(S.clone().addScaledVector(v, d));
}

/* ---------- bouquet ---------- */
const bouquet = new THREE.Group(); bouquet.visible = false; root.add(bouquet);
bouquet.position.set(0, 1.85, 1.0); bouquet.rotation.x = 0.45; bouquet.scale.setScalar(1.3);
mesh(bouquet, new THREE.ConeGeometry(0.5, 1.1, 32, 1, true), kraft, 0, -0.1, 0).rotation.x = Math.PI;
const petalCols = [0xf1a5b8, 0xe58aa3, 0xf7c9d4];
for (let i = 0; i < 9; i++) {
  const a = i * 2.4, r = 0.06 + 0.3 * Math.sqrt(i / 9);
  const f = new THREE.Group(); f.position.set(Math.cos(a) * r, 0.5 + 0.18 * (1 - r / 0.4), Math.sin(a) * r);
  f.quaternion.setFromUnitVectors(V(0, 1, 0), V(f.position.x * 1.4, 1, f.position.z * 1.4).normalize());
  mesh(f, sph(0.045), M(0xe8b84a, 0.5), 0, 0.03, 0);
  for (let b = 0; b < 6; b++) { const p = mesh(f, sph(0.09), M(petalCols[i % 3], 0.55), Math.cos(b * 1.047) * 0.1, 0, Math.sin(b * 1.047) * 0.1); p.scale.set(1.25, 0.3, 0.75); p.rotation.y = -b * 1.047; }
  bouquet.add(f);
  const st = mesh(bouquet, cyl(0.012, 0.012, 1.1), M(0x3f5c2f, 0.7), f.position.x * 0.5, -0.05, f.position.z * 0.5); st.rotation.set(f.position.z * 0.9, 0, -f.position.x * 0.9);
}
for (let i = 0; i < 40; i++) { const a = rnd(0, 6.28), r = rnd(0.1, 0.45); mesh(bouquet, sph(0.02, 8, 6), M(0xffffff, 0.6), Math.cos(a) * r, 0.52 + rnd(0, 0.15), Math.sin(a) * r); }
for (let i = 0; i < 6; i++) { const l = mesh(bouquet, sph(0.1), M(0x4f6b3a, 0.6), Math.cos(i * 1.05) * 0.4, 0.5, Math.sin(i * 1.05) * 0.4); l.scale.set(2.2, 0.15, 0.9); l.rotation.y = -i * 1.05; l.rotation.z = 0.3; }
mesh(bouquet, new THREE.PlaneGeometry(0.44, 0.24), new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide, roughness: 0.9, map: tex(256, 128, (g, w, h) => { g.fillStyle = '#efe3cb'; g.fillRect(0, 0, w, h); g.fillStyle = '#4c3427'; g.font = '700 26px "DM Mono",monospace'; g.textAlign = 'center'; g.fillText('THIS IS', w / 2, 55); g.fillText('FOR YOU', w / 2, 90); })
}), 0, 0.02, 0.36).rotation.x = -0.15;

/* ---------- state & timeline ---------- */
let t0 = null, last = 0, shattered = false, puddleT = 0, shakeT = -9;
const ui = { status: $('#status'), msg: $('#msg'), btn: $('#go'), label: $('#label'), fail: $('#fail'), foryou: $('#foryou'), flash: $('#flash'), hero: $('#hero') };
const steps = [
  [0, 'PULLING SHOTS', 'Please wait...'], [2.45, 'PRESSURE ERROR', 'Something feels... wrong.'],
  [2.9, 'SYSTEM FAILURE', 'That was not supposed to happen.'], [3.3, 'BARISTA PANIC'], [4.6, 'ALTERNATIVE SOLUTION'],
  [6.6, 'DELIVERY COMPLETE', "Coffee failed. Flowers didn't."], [8.6, 'SYSTEM READY']
];
let stepI = -1;
function resetAll() {
  shattered = false; stepI = -1; cupG.visible = true; puddle.visible = false; bouquet.visible = false;
  shards.forEach(s => s.visible = false); drops.forEach(d => d.visible = false);
  ui.fail.classList.remove('show'); ui.foryou.classList.remove('show'); ui.hero.classList.remove('hide');
  ui.status.textContent = 'SYSTEM READY'; ui.msg.textContent = 'One perfectly normal espresso.';
}
function shatter() {
  shattered = true; cupG.visible = false; puddleT = 0; shakeT = (performance.now() - t0) / 1000; puddle.visible = true;
  const c = V(CUP.x, CUP.y + 0.2, CUP.z);
  shards.forEach(s => {
    s.visible = true; s.rest = false; s.position.set(c.x + rnd(-0.15, 0.15), c.y + rnd(-0.15, 0.2), c.z + rnd(-0.15, 0.15));
    const a = rnd(0, 6.28), sp = rnd(1, 3.2); s.v.set(Math.cos(a) * sp, rnd(1.5, 4), Math.sin(a) * sp); s.w.set(rnd(-14, 14), rnd(-14, 14), rnd(-14, 14));
  });
  drops.forEach(d => {
    d.visible = true; d.rest = false; d.scale.set(1, 1, 1); d.position.set(c.x + rnd(-0.08, 0.08), c.y + rnd(-0.1, 0.1), c.z + rnd(-0.08, 0.08));
    const a = rnd(0, 6.28), sp = rnd(0.8, 3.6); d.v.set(Math.cos(a) * sp, rnd(1, 4.5), Math.sin(a) * sp);
  });
  ui.flash.classList.remove('go'); void ui.flash.offsetWidth; ui.flash.classList.add('go');
}
const camA = { p: V(-0.6, 1.6, 10.5), l: V(-0.6, 1.1, 0) }, camB = { p: V(-0.6, 0.9, 9.2), l: V(-0.6, 0.1, 4.5) };
const lookAt = V(0, 0, 0);

function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min((now - last) / 1000, 0.05); last = now;
  const go = t0 !== null, t = go ? (now - t0) / 1000 : -1;
  const sec = now / 1000;

  if (go) {
    while (stepI + 1 < steps.length && t >= steps[stepI + 1][0]) {
      stepI++; const [, st, m] = steps[stepI]; ui.status.textContent = st; if (m) ui.msg.textContent = m;
    }
    ui.fail.classList.toggle('show', t > 3.1 && t < 4.4);
    ui.foryou.classList.toggle('show', t > 7.0);
    ui.hero.classList.toggle('hide', t > 5.2 && t < 8.6);
    if (t > 8.6 && ui.btn.disabled) { ui.btn.disabled = false; ui.label.textContent = 'REPLAY'; ui.hero.classList.remove('hide'); }
    if (!shattered && t >= 2.9) shatter();
  }

  /* cup + coffee */
  const lvl = go ? 0.5 * clamp((t - 0.7) / 2.0) : 0;
  coffee.scale.y = Math.max(lvl, 0.001);
  crema.position.y = 0.05 + 0.35 * lvl; crema.visible = lvl > 0.03;
  if (go && !shattered && t > 2.45) { const k = (t - 2.45) * 0.012; cupG.position.set(CUP.x + Math.sin(t * 90) * k, CUP.y, CUP.z + Math.cos(t * 83) * k); }
  const on = go && t > 0.5 && t < 3.5;
  const topY = shattered ? 0.14 : CUP.y + 0.05 + 0.35 * lvl;
  streams.forEach((s, i) => { s.visible = on; s.scale.set(1 + Math.sin(t * 40 + i) * 0.15, SPOUT_Y - topY, 1); });

  /* physics */
  if (shattered) {
    shards.forEach(s => {
      if (s.rest) return;
      s.v.y -= 7 * dt; s.position.addScaledVector(s.v, dt);
      s.rotation.x += s.w.x * dt; s.rotation.y += s.w.y * dt; s.rotation.z += s.w.z * dt;
      const f = floorY(s.position.x, s.position.z) + 0.012;
      if (s.position.y < f) { s.position.y = f; if (Math.abs(s.v.y) < 0.6) { s.rest = true; } else { s.v.y *= -0.3; s.v.x *= 0.55; s.v.z *= 0.55; s.w.multiplyScalar(0.5); } }
    });
    drops.forEach(d => {
      if (d.rest) return;
      d.v.y -= 7 * dt; d.position.addScaledVector(d.v, dt);
      const f = floorY(d.position.x, d.position.z) + 0.004;
      if (d.position.y < f) { d.position.y = f; d.rest = true; d.scale.y = 0.25; }
    });
    puddleT += dt; puddle.scale.setScalar(0.02 + 0.55 * sm(puddleT / 1.4));
  }

  /* steam */
  steam.forEach(s => {
    const i = s.userData.i, k = (sec * 0.35 + i / steam.length) % 1, wand = i % 2;
    s.position.set((wand ? -0.75 : CUP.x + 0.05) + Math.sin(sec + i) * 0.06, (wand ? 0.9 : 0.72) + k * 0.7, wand ? 0.42 : CUP.z);
    s.scale.setScalar(0.25 + k * 0.4); s.material.opacity = Math.sin(k * Math.PI) * (go ? 0.16 : 0.05);
  });

  /* barista */
  let px = 1.6, py = -1.9, pz = -1.1, ry = 0, face = -0.55, panic = 0, run = 0, carry = 0;
  if (go) {
    panic = seg(t, 3.0, 3.3) * (1 - seg(t, 4.2, 4.45));
    if (t >= 4.3 && t < 5.2) { const u = (t - 4.3) / 0.9; ry = seg(t, 4.3, 4.5) * 1.57; px = 1.6 + 6.9 * u * u; run = 1; face = 0; }
    else if (t >= 5.2) {
      carry = 1; face = 0; bouquet.visible = true;
      if (t < 6.2) { const u = 1 - Math.pow(1 - (t - 5.2), 2); ry = -1.57; px = 8 - 7.2 * u; pz = 3.2; run = 1; }
      else { const v = seg(t, 6.2, 7.8); ry = -1.57 * (1 - v); px = 0.8 - 1.4 * v; pz = 3.2 + 2.4 * v; run = 1 - seg(t, 7.3, 7.8); }
    } else if (t > 3.0) py += Math.sin(clamp((t - 3.0) / 0.4) * Math.PI) * 0.25;
  } else py += Math.sin(sec * 1.6) * 0.008;
  const ph = sec * 13;
  py += Math.abs(Math.sin(ph)) * 0.08 * run;
  root.position.set(px, py, pz); root.rotation.set(-0.12 * panic, ry, 0); root.updateMatrixWorld(true);
  head.rotation.set(-0.1 * panic, face * (1 - panic) + Math.sin(sec * 22) * 0.25 * panic, 0);
  mouth.scale.y = 0.25 + panic * 1.6;
  legs[0].rotation.x = Math.sin(ph) * 0.8 * run; legs[1].rotation.x = -Math.sin(ph) * 0.8 * run;
  arms.forEach(a => {
    const s = a.s, sw = Math.sin(ph + (s > 0 ? 0 : Math.PI)) * 0.45 * run;
    const idle = V(s * 0.68, 1.15 + run * 0.25, 0.15 + sw), head_ = V(s * 0.42, 3.08, 0.08), hold = V(s * 0.3, 1.95, 0.85);
    const tgt = idle.lerp(head_, panic).lerp(hold, carry);
    ik(a, tgt, carry ? -0.6 : -0.6);
  });

  /* camera */
  const cs = go ? seg(t, 5.0, 7.6) : 0, push = go ? seg(t, 0.3, 2.8) * 0.5 : 0;
  cam.position.lerpVectors(camA.p, camB.p, cs); cam.position.z -= push; cam.position.x += Math.sin(sec * 0.3) * 0.08;
  lookAt.lerpVectors(camA.l, camB.l, cs);
  const sk = go ? Math.exp(-(t - shakeT) * 6) * 0.15 * (t > shakeT ? 1 : 0) : 0;
  cam.position.x += Math.sin(sec * 90) * sk; cam.position.y += Math.cos(sec * 77) * sk;
  cam.lookAt(lookAt);
  renderer.render(scene, cam);
}

/* ---------- controls ---------- */
function start() {
  if (t0 !== null && ui.btn.disabled) return;
  resetAll(); t0 = performance.now(); ui.btn.disabled = true; ui.label.textContent = 'BREWING...';
}
ui.btn.addEventListener('click', start);
addEventListener('keydown', e => {
  if (e.key === 'Enter' && !ui.btn.disabled) start();
  if (e.key.toLowerCase() === 'r') { t0 = null; resetAll(); ui.btn.disabled = false; ui.label.textContent = 'MAKE COFFEE'; cupG.position.copy(CUP); }
});
function resize() {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h); cam.aspect = w / h;
  cam.fov = cam.aspect < 1 ? 62 : cam.aspect < 1.4 ? 42 : 32; cam.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();
requestAnimationFrame(frame);
