// Materiales del modelo: hueso, músculo (con tendones y fibras) y entorno de iluminación.
import * as THREE from 'three';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';

const TENDON = new THREE.Color('#ece3d2');

// El shader muscular mezcla el color del tendón en los extremos (aMus.x) y
// oscurece suavemente los bordes de cada fascículo (aMus.y) para que se lean las fibras.
function patchMuscle(shader) {
  shader.uniforms.uTendon = { value: TENDON };
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nattribute vec2 aMus;\nvarying vec2 vMus;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\nvMus = aMus;');
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nvarying vec2 vMus;\nuniform vec3 uTendon;')
    .replace(
      '#include <color_fragment>',
      '#include <color_fragment>\n diffuseColor.rgb *= 0.78 + 0.22 * vMus.y;\n diffuseColor.rgb = mix(diffuseColor.rgb, uTendon, vMus.x * 0.75);',
    );
}

export function muscleMaterial(color) {
  const m = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.48,
    metalness: 0,
    clearcoat: 0.35,
    clearcoatRoughness: 0.45,
    side: THREE.DoubleSide,
  });
  m.onBeforeCompile = patchMuscle;
  m.customProgramCacheKey = () => 'muscle';
  return m;
}

export function boneMaterial(color) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0, side: THREE.DoubleSide });
}

export function setupEnvironment(renderer, scene) {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.4;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x30343c, 0.7));
  const key = new THREE.DirectionalLight(0xfff4e8, 1.6);
  key.position.set(80, 160, 160);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbfd4ff, 1.0);
  rim.position.set(-120, 80, -160);
  scene.add(rim);
}
