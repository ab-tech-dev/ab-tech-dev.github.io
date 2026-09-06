import * as THREE from 'three';

export type SystemState = { progress: number; pointerX: number; pointerY: number };
const clamp = THREE.MathUtils.clamp;
const mix = THREE.MathUtils.lerp;
const ease = (a: number, b: number, value: number) => THREE.MathUtils.smoothstep(value, a, b);

export function createLivingSystem(host: HTMLElement, state: SystemState, compact: boolean) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !compact, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.25 : 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 80);
  camera.position.set(0, 0, 10);
  scene.add(new THREE.AmbientLight(0xdde8dc, 2));
  const key = new THREE.DirectionalLight(0xffffff, 3.6);
  key.position.set(-3, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc8ff79, 5);
  rim.position.set(5, -1, -3);
  scene.add(rim);
  const group = new THREE.Group();
  scene.add(group);

  // The brand brackets remain the same objects throughout the scroll story.
  const bracketShape = new THREE.Shape();
  [[.53, 1.65], [.08, 1.65], [-.96, 0], [.08, -1.65], [.53, -1.65], [-.51, 0]].forEach(([x,y], i) => i ? bracketShape.lineTo(x,y) : bracketShape.moveTo(x,y));
  bracketShape.closePath();
  const bracketGeometry = new THREE.ExtrudeGeometry(bracketShape, { depth: .19, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .055, bevelThickness: .055 });
  bracketGeometry.center();
  const lime = new THREE.MeshStandardMaterial({ color: 0xc4f975, metalness: .18, roughness: .3, emissive: 0x436b0c, emissiveIntensity: .15 });
  const left = new THREE.Mesh(bracketGeometry, lime);
  const right = new THREE.Mesh(bracketGeometry, lime);
  right.rotation.z = Math.PI;
  group.add(left, right);
  const slashMaterial = lime.clone();
  slashMaterial.transparent = true;
  const slash = new THREE.Mesh(new THREE.BoxGeometry(.26, 3.18, .2), slashMaterial);
  slash.rotation.z = -.29;
  slash.position.z = .4;
  group.add(slash);

  const textures: THREE.Texture[] = [];
  const panelNames = ['New request', 'Check details', 'Your approval', 'Sync your tools', 'Work, completed'];
  function panelTexture(index: number) {
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 420;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#15211e'; ctx.fillRect(0, 0, 640, 420);
    ctx.strokeStyle = '#3a5040'; ctx.lineWidth = 2; ctx.strokeRect(1, 1, 638, 418);
    ctx.fillStyle = '#bded7b'; ctx.beginPath(); ctx.arc(34, 36, 6, 0, Math.PI * 2); ctx.fill();
    ctx.font = '19px monospace'; ctx.fillStyle = '#8fa99a'; ctx.fillText('AB / WORKFLOW', 53, 43);
    ctx.fillStyle = '#ecf0e7'; ctx.font = '500 40px Arial'; ctx.fillText(panelNames[index], 32, 115);
    ctx.strokeStyle = '#33483a'; ctx.beginPath(); ctx.moveTo(32, 146); ctx.lineTo(608, 146); ctx.stroke();
    ['Input received', 'System connected', 'Ready for the next step'].forEach((text, row) => {
      const y = 190 + row * 66;
      ctx.strokeStyle = '#536c50'; ctx.strokeRect(32, y - 11, 19, 19);
      ctx.fillStyle = row === index % 3 ? '#c4f975' : '#97aa9d'; ctx.font = '23px Arial'; ctx.fillText(text, 71, y + 5);
      ctx.fillStyle = '#304932'; ctx.fillRect(522, y - 5, 84, 8);
    });
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture);
    return texture;
  }
  const panelGeometry = new THREE.PlaneGeometry(2.15, 1.41);
  const panels = panelNames.map((_, index) => {
    const material = new THREE.MeshBasicMaterial({ map: panelTexture(index), transparent: true, opacity: .8, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(panelGeometry, material);
    group.add(mesh);
    return mesh;
  });
  const scattered = [
    new THREE.Vector3(-.9, .78, -.65), new THREE.Vector3(.88, 1.26, -1.1),
    new THREE.Vector3(-1.18, -.92, -.82), new THREE.Vector3(1.16, -.7, -.42),
    new THREE.Vector3(.15, .06, -1.6)
  ];
  const connected = [
    new THREE.Vector3(-1.85, .98, -.3), new THREE.Vector3(.7, 1.53, -.8),
    new THREE.Vector3(-.03, -.12, .36), new THREE.Vector3(-1.52, -1.32, -.5),
    new THREE.Vector3(1.39, -1.42, -.15)
  ];
  const curves = connected.slice(0, -1).map((start, i) => {
    const end = connected[i + 1];
    const middle = start.clone().lerp(end, .5); middle.z += .6;
    return new THREE.CatmullRomCurve3([start, middle, end]);
  });
  const wireMaterials: THREE.MeshBasicMaterial[] = [];
  curves.forEach(curve => {
    const material = new THREE.MeshBasicMaterial({ color: 0xa8ee71, transparent: true, opacity: 0 });
    wireMaterials.push(material);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 36, .008, 4, false), material));
  });
  const packetMaterial = new THREE.MeshBasicMaterial({ color: 0xe3ffbd, transparent: true, opacity: 0 });
  const packets = new THREE.InstancedMesh(new THREE.SphereGeometry(.034, 6, 4), packetMaterial, 20);
  group.add(packets);
  const dummy = new THREE.Object3D();

  // Fine particles suggest information in space, without adding background images.
  const count = compact ? 120 : 260;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const n = i * 2.399963;
    const radius = 2.8 + (i % 17) * .17;
    positions[i * 3] = Math.cos(n) * radius;
    positions[i * 3 + 1] = Math.sin(n) * radius * .65;
    positions[i * 3 + 2] = -2 - (i % 13) * .2;
  }
  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(pointsGeometry, new THREE.PointsMaterial({ size: .018, color: 0x9bb993, transparent: true, opacity: .5, depthWrite: false }));
  group.add(points);
  let width = 0, height = 0, dirty = true;
  const resize = () => {
    const nextWidth = host.clientWidth, nextHeight = host.clientHeight;
    if (!nextWidth || !nextHeight || (width === nextWidth && height === nextHeight)) return;
    width = nextWidth; height = nextHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    dirty = true;
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host); resize();
  let lost = false;
  const contextLost = (event: Event) => { event.preventDefault(); lost = true; host.classList.remove('scene-ready'); };
  const contextRestored = () => { lost = false; dirty = true; };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  renderer.domElement.addEventListener('webglcontextrestored', contextRestored);
  let px = 0, py = 0;
  return {
    render(time: number, still = false) {
      if (lost || !width || !height || (still && !dirty)) return;
      const p = clamp(state.progress, 0, 1);
      const unfold = ease(.12, .48, p);
      const finish = ease(.68, .98, p);
      px = mix(px, still ? 0 : state.pointerX, .035);
      py = mix(py, still ? 0 : state.pointerY, .035);
      const drift = still ? 0 : Math.sin(time * .5) * .045;
      group.position.set(compact ? 0 : Math.min(2.55, camera.aspect * 1.6), compact ? -.5 : .05, 0);
      group.scale.setScalar(compact ? .78 : Math.min(1.02, camera.aspect * .49));
      group.rotation.set(mix(.17, -.03, finish) + py * .04, mix(-.48, .02, unfold) - finish * .12 + px * .1, mix(-.13, .06, unfold) - finish * .09 + drift);
      const spacing = 1.42 + unfold * .85 - finish * .35;
      left.position.set(-spacing, 0, .35);
      right.position.set(spacing, 0, .35);
      left.rotation.y = -.15 * unfold; right.rotation.y = .15 * unfold;
      slashMaterial.opacity = 1 - ease(.05, .25, p);
      slash.visible = slashMaterial.opacity > .005;
      panels.forEach((panel, i) => {
        panel.position.copy(scattered[i]).lerp(connected[i], unfold);
        panel.position.lerp(new THREE.Vector3((i - 2) * .085, (i - 2) * .075, i === 4 ? .6 : -.25 - (3 - i) * .12), finish);
        panel.rotation.set((1-unfold) * (i % 2 ? -.12 : .12), (1-unfold) * (i % 2 ? .2 : -.2), (1-unfold) * (i - 2) * .05);
        const scale = mix(.64, .83, unfold) + finish * (i === 4 ? .76 : .45);
        panel.scale.setScalar(scale);
        panel.material.opacity = mix(.6, 1, unfold) * (i === 4 ? 1 : 1 - finish * .82);
      });
      const flow = unfold * (1 - finish);
      wireMaterials.forEach(material => { material.opacity = flow * .7; });
      packetMaterial.opacity = flow;
      for (let i = 0; i < 20; i++) {
        const point = curves[i % curves.length].getPointAt((time * .1 + Math.floor(i / 4) * .2) % 1);
        dummy.position.copy(point); dummy.updateMatrix();
        packets.setMatrixAt(i, dummy.matrix);
      }
      packets.instanceMatrix.needsUpdate = true;
      points.rotation.z = still ? 0 : time * .012;
      renderer.render(scene, camera);
      dirty = false;
      host.classList.add('scene-ready');
    },
    destroy() {
      observer.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', contextRestored);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          geometries.add(object.geometry);
          (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
        }
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      textures.forEach(texture => texture.dispose());
      renderer.dispose(); renderer.domElement.remove(); host.classList.remove('scene-ready');
    }
  };
}
