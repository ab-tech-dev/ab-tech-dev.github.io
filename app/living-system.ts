import * as THREE from 'three';

import { samplePose, type SystemState } from './motion-state';

const mix = THREE.MathUtils.lerp;

export function createLivingSystem(
  host: HTMLElement,
  state: SystemState,
  compact: boolean,
) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !compact,
    powerPreference: compact ? 'low-power' : 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, compact ? 1.1 : 1.35),
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
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

  // A spatial field follows the brand mark through every chapter. It changes
  // character with the story instead of repeating the same floating logo.
  const orbitGroup = new THREE.Group();
  group.add(orbitGroup);
  const orbitGeometry = new THREE.TorusGeometry(2.7, 0.012, 4, 112);
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0xb9e982,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const orbitRings = [0, 1, 2].map((index) => {
    const ring = new THREE.Mesh(orbitGeometry, orbitMaterial);
    ring.rotation.set(index * 0.58, index * 0.72, index * 0.34);
    ring.scale.setScalar(1 - index * 0.12);
    orbitGroup.add(ring);
    return ring;
  });
  const nodeMaterial = new THREE.MeshBasicMaterial({
    color: 0xdcffad,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const chapterNodes = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(0.055, 1),
    nodeMaterial,
    14,
  );
  orbitGroup.add(chapterNodes);
  const nodeDummy = new THREE.Object3D();
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x9fe84f,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 28, 18),
    coreMaterial,
  );
  core.position.z = -0.9;
  group.add(core);
  const completionMaterial = new THREE.MeshBasicMaterial({
    color: 0xc4f975,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const completionRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.018, 5, compact ? 64 : 96),
    completionMaterial,
  );
  completionRing.position.z = -0.35;
  group.add(completionRing);

  // The brand brackets remain the same objects throughout the scroll story.
  const bracketShape = new THREE.Shape();
  [
    [0.53, 1.65],
    [0.08, 1.65],
    [-0.96, 0],
    [0.08, -1.65],
    [0.53, -1.65],
    [-0.51, 0],
  ].forEach(([x, y], i) =>
    i ? bracketShape.lineTo(x, y) : bracketShape.moveTo(x, y),
  );
  bracketShape.closePath();
  const bracketGeometry = new THREE.ExtrudeGeometry(bracketShape, {
    depth: 0.19,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.055,
    bevelThickness: 0.055,
  });
  bracketGeometry.center();
  const lime = new THREE.MeshStandardMaterial({
    color: 0xc4f975,
    metalness: 0.18,
    roughness: 0.3,
    emissive: 0x436b0c,
    emissiveIntensity: 0.15,
  });
  const left = new THREE.Mesh(bracketGeometry, lime);
  const right = new THREE.Mesh(bracketGeometry, lime);
  right.rotation.z = Math.PI;
  group.add(left, right);
  const slashMaterial = lime.clone();
  slashMaterial.transparent = true;
  const slash = new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 3.18, 0.2),
    slashMaterial,
  );
  slash.rotation.z = -0.29;
  slash.position.z = 0.4;
  group.add(slash);

  const textures: THREE.Texture[] = [];
  const panelNames = [
    'New request',
    'Check details',
    'Your approval',
    'Sync your tools',
    'Work, completed',
  ];
  function panelTexture(index: number) {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 420;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#15211e';
    ctx.fillRect(0, 0, 640, 420);
    ctx.strokeStyle = '#3a5040';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 638, 418);
    ctx.fillStyle = '#bded7b';
    ctx.beginPath();
    ctx.arc(34, 36, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '19px monospace';
    ctx.fillStyle = '#8fa99a';
    ctx.fillText('AB / WORKFLOW', 53, 43);
    ctx.fillStyle = '#ecf0e7';
    ctx.font = '500 40px Arial';
    ctx.fillText(panelNames[index], 32, 115);
    ctx.strokeStyle = '#33483a';
    ctx.beginPath();
    ctx.moveTo(32, 146);
    ctx.lineTo(608, 146);
    ctx.stroke();
    ['Input received', 'System connected', 'Ready for the next step'].forEach(
      (text, row) => {
        const y = 190 + row * 66;
        ctx.strokeStyle = '#536c50';
        ctx.strokeRect(32, y - 11, 19, 19);
        ctx.fillStyle = row === index % 3 ? '#c4f975' : '#97aa9d';
        ctx.font = '23px Arial';
        ctx.fillText(text, 71, y + 5);
        ctx.fillStyle = '#304932';
        ctx.fillRect(522, y - 5, 84, 8);
      },
    );
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    return texture;
  }
  const panelGeometry = new THREE.PlaneGeometry(2.15, 1.41);
  const panels = panelNames.map((_, index) => {
    const material = new THREE.MeshBasicMaterial({
      map: panelTexture(index),
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(panelGeometry, material);
    group.add(mesh);
    return mesh;
  });
  const scattered = [
    new THREE.Vector3(-0.9, 0.78, -0.65),
    new THREE.Vector3(0.88, 1.26, -1.1),
    new THREE.Vector3(-1.18, -0.92, -0.82),
    new THREE.Vector3(1.16, -0.7, -0.42),
    new THREE.Vector3(0.15, 0.06, -1.6),
  ];
  const connected = [
    new THREE.Vector3(-1.85, 0.98, -0.3),
    new THREE.Vector3(0.7, 1.53, -0.8),
    new THREE.Vector3(-0.03, -0.12, 0.36),
    new THREE.Vector3(-1.52, -1.32, -0.5),
    new THREE.Vector3(1.39, -1.42, -0.15),
  ];
  const curves = connected.slice(0, -1).map((start, i) => {
    const end = connected[i + 1];
    const middle = start.clone().lerp(end, 0.5);
    middle.z += 0.6;
    return new THREE.CatmullRomCurve3([start, middle, end]);
  });
  const wireMaterials: THREE.MeshBasicMaterial[] = [];
  curves.forEach((curve) => {
    const material = new THREE.MeshBasicMaterial({
      color: 0xa8ee71,
      transparent: true,
      opacity: 0,
    });
    wireMaterials.push(material);
    group.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(curve, 36, 0.008, 4, false),
        material,
      ),
    );
  });
  const packetMaterial = new THREE.MeshBasicMaterial({
    color: 0xe3ffbd,
    transparent: true,
    opacity: 0,
  });
  const packets = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.034, 6, 4),
    packetMaterial,
    20,
  );
  group.add(packets);
  const dummy = new THREE.Object3D();

  // Fine particles suggest information in space, without adding background images.
  const count = compact ? 120 : 260;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const n = i * 2.399963;
    const radius = 2.8 + (i % 17) * 0.17;
    positions[i * 3] = Math.cos(n) * radius;
    positions[i * 3 + 1] = Math.sin(n) * radius * 0.65;
    positions[i * 3 + 2] = -2 - (i % 13) * 0.2;
  }
  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3),
  );
  const points = new THREE.Points(
    pointsGeometry,
    new THREE.PointsMaterial({
      size: 0.018,
      color: 0x9bb993,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    }),
  );
  group.add(points);
  let width = 0,
    height = 0,
    dirty = true;
  const resize = () => {
    const nextWidth = host.clientWidth,
      nextHeight = host.clientHeight;
    if (
      !nextWidth ||
      !nextHeight ||
      (width === nextWidth && height === nextHeight)
    )
      return;
    width = nextWidth;
    height = nextHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    dirty = true;
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  let lost = false;
  const contextLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    host.classList.remove('scene-ready');
  };
  const contextRestored = () => {
    lost = false;
    dirty = true;
  };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  renderer.domElement.addEventListener('webglcontextrestored', contextRestored);
  const limeColor = new THREE.Color(0xc4f975);
  const inkColor = new THREE.Color(0x243c24);
  const assembled = panels.map(
    (_, i) =>
      new THREE.Vector3(
        (i - 2) * 0.085,
        (i - 2) * 0.075,
        i === 4 ? 0.6 : -0.25 - (3 - i) * 0.12,
      ),
  );
  const packetPoints = curves.map((curve) => curve.getSpacedPoints(120));
  let px = 0,
    py = 0;
  return {
    clear() {
      if (lost) return;
      renderer.setScissorTest(false);
      renderer.clear();
    },
    render(
      time: number,
      still = false,
      clip?: { x: number; y: number; width: number; height: number },
    ) {
      if (lost || !width || !height || (still && !dirty)) return;
      const pose = samplePose(state.chapter);
      px = mix(px, still ? 0 : state.pointerX, 0.08);
      py = mix(py, still ? 0 : state.pointerY, 0.08);
      const worldHeight =
        2 *
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
        camera.position.z;
      const unit = worldHeight / height;
      group.position.set(
        (state.x - width / 2) * unit,
        (height / 2 - state.y) * unit,
        (pose.depth - 0.7) * 0.18,
      );
      group.scale.setScalar(
        Math.max(0.01, (state.width * unit) / 6.5) * (0.94 + pose.depth * 0.07),
      );
      const interactive = state.chapter < 2.5 ? 1 : 0.35;
      group.rotation.set(
        pose.rx + py * 0.035 * interactive,
        pose.ry + px * 0.05 * interactive,
        pose.rz,
      );
      lime.color.copy(limeColor).lerp(inkColor, pose.dark);
      lime.emissiveIntensity = 0.15 * (1 - pose.dark);
      slashMaterial.color.copy(lime.color);
      slashMaterial.emissiveIntensity = lime.emissiveIntensity;
      left.position.set(-pose.spacing, 0, 0.35);
      right.position.set(pose.spacing, 0, 0.35);
      left.rotation.y = -0.1 * pose.spread;
      right.rotation.y = 0.1 * pose.spread;
      slashMaterial.opacity = pose.slash;
      slash.visible = pose.slash > 0.005;
      panels.forEach((panel, i) => {
        panel.position
          .copy(scattered[i])
          .lerp(connected[i], pose.spread)
          .lerp(assembled[i], pose.assembled);
        if (compact && state.chapter < 0.72 && !still) {
          const looseSignal = 1 - state.chapter / 0.72;
          panel.position.x +=
            Math.sin(time * 0.72 + i * 1.37) * 0.075 * looseSignal;
          panel.position.y +=
            Math.cos(time * 0.58 + i * 1.11) * 0.09 * looseSignal;
          panel.position.z +=
            Math.sin(time * 0.44 + i * 0.83) * 0.055 * looseSignal;
        }
        panel.rotation.set(
          (1 - pose.spread) * (i % 2 ? -0.12 : 0.12),
          (1 - pose.spread) * (i % 2 ? 0.2 : -0.2),
          (1 - pose.spread) * (i - 2) * 0.05,
        );
        panel.scale.setScalar(
          mix(0.64, 0.83, pose.spread) +
            pose.assembled * (i === 4 ? 0.76 : 0.45),
        );
        panel.material.opacity =
          pose.panels * (i === 4 ? 1 : 1 - pose.assembled * 0.82);
        panel.visible = panel.material.opacity > 0.005;
      });
      wireMaterials.forEach((material) => {
        material.opacity = pose.wires * 0.65;
      });
      packetMaterial.opacity = pose.wires;
      packets.visible = pose.wires > 0.01;
      if (packets.visible) {
        for (let i = 0; i < 20; i++) {
          const points = packetPoints[i % curves.length];
          const index = Math.floor(
            ((time * 0.1 + Math.floor(i / 4) * 0.2) % 1) * 120,
          );
          dummy.position.copy(points[index]);
          dummy.updateMatrix();
          packets.setMatrixAt(i, dummy.matrix);
        }
        packets.instanceMatrix.needsUpdate = true;
      }
      points.material.opacity = state.chapter < 2.7 ? 0.3 : 0.08;
      points.rotation.z = still ? 0 : time * 0.006;
      orbitMaterial.opacity = pose.orbit * (0.12 + pose.pulse * 0.12);
      orbitGroup.visible = pose.orbit > 0.01 || pose.nodes > 0.01;
      orbitGroup.rotation.set(
        pose.rx * -0.45,
        pose.ry * 0.35,
        pose.rz + (still ? 0 : time * 0.018 * pose.orbit),
      );
      orbitGroup.scale.setScalar(0.9 + pose.depth * 0.1);
      orbitRings.forEach((ring, index) => {
        const direction = index % 2 ? -1 : 1;
        ring.rotation.z =
          index * 0.34 + (still ? 0 : time * 0.012 * direction * pose.orbit);
      });
      nodeMaterial.opacity = pose.nodes * 0.82;
      chapterNodes.visible = pose.nodes > 0.01;
      if (chapterNodes.visible) {
        for (let i = 0; i < 14; i++) {
          const angle =
            (i / 14) * Math.PI * 2 + time * 0.025 * (i % 2 ? -1 : 1);
          const radius = 2.5 + (i % 3) * 0.34 + pose.depth * 0.18;
          nodeDummy.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius * (0.58 + (i % 2) * 0.12),
            -0.6 + ((i * 7) % 9) * 0.16,
          );
          const nodeScale = (0.65 + (i % 4) * 0.16) * (0.8 + pose.pulse * 0.35);
          nodeDummy.scale.setScalar(nodeScale);
          nodeDummy.updateMatrix();
          chapterNodes.setMatrixAt(i, nodeDummy.matrix);
        }
        chapterNodes.instanceMatrix.needsUpdate = true;
      }
      const breathing = still
        ? 1
        : 1 + Math.sin(time * 0.085) * 0.08 * pose.pulse;
      core.scale.setScalar((0.72 + pose.depth * 0.16) * breathing);
      coreMaterial.opacity = 0.025 + pose.pulse * 0.055;
      const completion = THREE.MathUtils.smoothstep(state.chapter, 1.52, 2);
      completionRing.visible = compact && completion > 0.01;
      completionMaterial.opacity =
        completion * (0.12 + Math.sin(time * 1.9) * 0.035);
      completionRing.scale.setScalar(
        0.82 + completion * 0.2 + Math.sin(time * 1.25) * 0.018,
      );
      completionRing.rotation.z = still ? 0 : time * 0.055;
      renderer.autoClear = !clip;
      if (clip) {
        renderer.setScissor(
          clip.x,
          height - clip.y - clip.height,
          clip.width,
          clip.height,
        );
        renderer.setScissorTest(true);
      }
      renderer.render(scene, camera);
      renderer.setScissorTest(false);
      dirty = false;
      host.classList.add('scene-ready');
    },
    destroy() {
      observer.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      renderer.domElement.removeEventListener(
        'webglcontextrestored',
        contextRestored,
      );
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          geometries.add(object.geometry);
          (Array.isArray(object.material)
            ? object.material
            : [object.material]
          ).forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      host.classList.remove('scene-ready');
    },
  };
}
