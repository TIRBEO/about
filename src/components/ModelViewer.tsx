"use client";

import { Suspense, useRef, useLayoutEffect, useEffect, Component, type ReactNode } from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import { OrbitControls, useGLTF, useProgress, Html, Environment, ContactShadows, useAnimations } from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import * as THREE from "three";

class ErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
const deg2rad = (d: number) => (d * Math.PI) / 180;
const DECIDE = 8;
const ROTATE_SPEED = 0.005;
const INERTIA = 0.925;
const PARALLAX_MAG = 0.05;
const PARALLAX_EASE = 0.12;
const HOVER_MAG = deg2rad(6);
const HOVER_EASE = 0.15;

function Loader({ placeholderSrc }: { placeholderSrc?: string }) {
  const { progress, active } = useProgress();
  if (!active && placeholderSrc) return null;
  return (
    <Html center>
      {placeholderSrc ? (
        <img src={placeholderSrc} width={128} height={128} style={{ filter: "blur(8px)", borderRadius: 8 }} alt="" />
      ) : (
        `${Math.round(progress)}%`
      )}
    </Html>
  );
}

function DesktopControls({ pivot, min, max, zoomEnabled }: { pivot: THREE.Vector3; min: number; max: number; zoomEnabled: boolean }) {
  const controlsRef = useRef<OrbitControlsType>(null);
  useFrame(() => {
    if (controlsRef.current) controlsRef.current.target.copy(pivot);
  });
  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableRotate={false}
      enableZoom={zoomEnabled}
      minDistance={min}
      maxDistance={max}
    />
  );
}

function ModelInner({
  url,
  xOff,
  yOff,
  pivot,
  initYaw,
  initPitch,
  enableMouseParallax,
  enableManualRotation,
  enableHoverRotation,
  autoFrame,
  fadeIn,
  autoRotate,
  autoRotateSpeed,
  onLoaded,
}: {
  url: string;
  xOff: number;
  yOff: number;
  pivot: THREE.Vector3;
  initYaw: number;
  initPitch: number;
  enableMouseParallax: boolean;
  enableManualRotation: boolean;
  enableHoverRotation: boolean;
  autoFrame: boolean;
  fadeIn: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;
  onLoaded?: () => void;
}) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();

  const vel = useRef({ x: 0, y: 0 });
  const tPar = useRef({ x: 0, y: 0 });
  const cPar = useRef({ x: 0, y: 0 });
  const tHov = useRef({ x: 0, y: 0 });
  const cHov = useRef({ x: 0, y: 0 });

  const hasUrl = url.length > 0;

  const pivotW = useRef(new THREE.Vector3());

  useLayoutEffect(() => {
    if (!inner.current) return;
    const g = inner.current;
    g.updateWorldMatrix(true, true);

    const sphere = new THREE.Box3().setFromObject(g).getBoundingSphere(new THREE.Sphere());
    const s = 1 / (sphere.radius * 2);
    g.position.set(-sphere.center.x, -sphere.center.y, -sphere.center.z);
    g.scale.setScalar(s);

    g.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (fadeIn) {
          o.material.transparent = true;
          o.material.opacity = 0;
        }
      }
    });

    g.getWorldPosition(pivotW.current);
    pivot.copy(pivotW.current);
    if (outer.current) outer.current.rotation.set(initPitch, initYaw, 0);

    if (autoFrame && (camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const persp = camera as THREE.PerspectiveCamera;
      const fitR = sphere.radius * s;
      const d = (fitR * 1.2) / Math.sin((persp.fov * Math.PI) / 180 / 2);
      persp.position.set(pivotW.current.x, pivotW.current.y, pivotW.current.z + d);
      persp.near = d / 10;
      persp.far = d * 10;
      persp.updateProjectionMatrix();
    }

    if (fadeIn) {
      let t = 0;
      const id = setInterval(() => {
        t += 0.05;
        const v = Math.min(t, 1);
        g.traverse((o) => {
          if (o instanceof THREE.Mesh) o.material.opacity = v;
        });
        invalidate();
        if (v === 1) {
          clearInterval(id);
          onLoaded?.();
        }
      }, 16);
      return () => clearInterval(id);
    } else onLoaded?.();
  }, []);

  useEffect(() => {
    if (!enableManualRotation || isTouch) return;
    const el = gl.domElement;
    let drag = false;
    let lx = 0;
    let ly = 0;

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      drag = true;
      lx = e.clientX;
      ly = e.clientY;
      window.addEventListener("pointerup", up);
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      if (outer.current) {
        outer.current.rotation.y += dx * ROTATE_SPEED;
        outer.current.rotation.x += dy * ROTATE_SPEED;
      }
      vel.current = { x: dx * ROTATE_SPEED, y: dy * ROTATE_SPEED };
      invalidate();
    };
    const up = () => { drag = false; };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl, enableManualRotation]);

  // Touch events - simplified
  useEffect(() => {
    if (!isTouch) return;
    const el = gl.domElement;
    let drag = false;
    let lx = 0;
    let ly = 0;

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      drag = true;
      lx = e.clientX;
      ly = e.clientY;
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      if (Math.abs(dx) > DECIDE || Math.abs(dy) > DECIDE) {
        if (outer.current) {
          outer.current.rotation.y += dx * ROTATE_SPEED;
          outer.current.rotation.x += dy * ROTATE_SPEED;
        }
        vel.current = { x: dx * ROTATE_SPEED, y: dy * ROTATE_SPEED };
        invalidate();
      }
    };
    const up = () => { drag = false; };

    el.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", up, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [gl]);

  useEffect(() => {
    if (isTouch) return;
    const mm = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (enableMouseParallax) tPar.current = { x: -nx * PARALLAX_MAG, y: -ny * PARALLAX_MAG };
      if (enableHoverRotation) tHov.current = { x: ny * HOVER_MAG, y: nx * HOVER_MAG };
      invalidate();
    };
    window.addEventListener("pointermove", mm);
    return () => window.removeEventListener("pointermove", mm);
  }, [enableMouseParallax, enableHoverRotation]);

  useFrame((_, dt) => {
    let need = false;
    cPar.current.x += (tPar.current.x - cPar.current.x) * PARALLAX_EASE;
    cPar.current.y += (tPar.current.y - cPar.current.y) * PARALLAX_EASE;
    const phx = cHov.current.x;
    const phy = cHov.current.y;
    cHov.current.x += (tHov.current.x - cHov.current.x) * HOVER_EASE;
    cHov.current.y += (tHov.current.y - cHov.current.y) * HOVER_EASE;

    const ndc = pivotW.current.clone().project(camera);
    ndc.x += xOff + cPar.current.x;
    ndc.y += yOff + cPar.current.y;
    if (outer.current) outer.current.position.copy(ndc.unproject(camera));

    if (outer.current) {
      outer.current.rotation.x += cHov.current.x - phx;
      outer.current.rotation.y += cHov.current.y - phy;
    }

    if (autoRotate && outer.current) {
      outer.current.rotation.y += autoRotateSpeed * dt;
      need = true;
    }

    if (outer.current) {
      outer.current.rotation.y += vel.current.x;
      outer.current.rotation.x += vel.current.y;
    }
    vel.current.x *= INERTIA;
    vel.current.y *= INERTIA;
    if (Math.abs(vel.current.x) > 1e-4 || Math.abs(vel.current.y) > 1e-4) need = true;

    if (
      Math.abs(cPar.current.x - tPar.current.x) > 1e-4 ||
      Math.abs(cPar.current.y - tPar.current.y) > 1e-4 ||
      Math.abs(cHov.current.x - tHov.current.x) > 1e-4 ||
      Math.abs(cHov.current.y - tHov.current.y) > 1e-4
    )
      need = true;

    if (need) invalidate();
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        {hasUrl ? <ExternalModel url={url} /> : <ProceduralGeometry />}
      </group>
    </group>
  );
}

function ExternalModel({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, groupRef);
  const indexRef = useRef(0);

  useEffect(() => {
    if (names.length === 0) return;
    Object.values(actions).forEach((a) => a?.stop());
    const name = names[indexRef.current % names.length];
    const action = actions[name];
    if (action) {
      action.reset().fadeIn(0.3).play();
      const onFinish = () => {
        indexRef.current++;
        const next = names[indexRef.current % names.length];
        actions[next]?.reset().fadeIn(0.3).play();
      };
      action.getMixer().addEventListener("finished", onFinish);
      return () => {
        action.getMixer().removeEventListener("finished", onFinish);
        action.fadeOut(0.3);
      };
    }
  }, [actions, names]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

function ProceduralGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.3;
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.15) * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 3;
      ringRef.current.rotation.z = clock.elapsedTime * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = clock.elapsedTime * 0.2;
      innerRef.current.rotation.y = clock.elapsedTime * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer wireframe icosahedron */}
      <mesh>
        <icosahedronGeometry args={[1.6, 0]} />
        <meshPhysicalMaterial
          color="#F59E0B"
          wireframe
          transparent
          opacity={0.15}
          emissive="#F59E0B"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Orbiting ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[1.3, 1.45, 64]} />
        <meshPhysicalMaterial
          color="#F59E0B"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          emissive="#F59E0B"
          emissiveIntensity={0.1}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Second ring (tilted) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.2, 48]} />
        <meshPhysicalMaterial
          color="#F59E0B"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          emissive="#F59E0B"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Central torus knot */}
      <mesh ref={innerRef}>
        <torusKnotGeometry args={[0.7, 0.25, 128, 32]} />
        <meshPhysicalMaterial
          color="#F59E0B"
          metalness={0.95}
          roughness={0.1}
          clearcoat={0.5}
          clearcoatRoughness={0.15}
          emissive="#F59E0B"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const theta = (i / 20) * Math.PI * 2;
        const phi = Math.cos(i * 1.3) * 0.5;
        const r = 1.8 + Math.sin(i * 0.7) * 0.2;
        return (
          <mesh
            key={i}
            position={[
              r * Math.cos(theta) * Math.cos(phi),
              r * Math.sin(phi),
              r * Math.sin(theta) * Math.cos(phi),
            ]}
          >
            <octahedronGeometry args={[0.04, 0]} />
            <meshPhysicalMaterial
              color="#F59E0B"
              emissive="#F59E0B"
              emissiveIntensity={0.3}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function ModelViewer({
  url = "",
  width = 400,
  height = 400,
  modelXOffset = 0,
  modelYOffset = 0,
  defaultRotationX = -30,
  defaultRotationY = 15,
  defaultZoom = 1.2,
  minZoomDistance = 0.5,
  maxZoomDistance = 10,
  enableMouseParallax = true,
  enableManualRotation = true,
  enableHoverRotation = true,
  enableManualZoom = true,
  ambientIntensity = 0.2,
  keyLightIntensity = 1.5,
  fillLightIntensity = 0.3,
  rimLightIntensity = 0.6,
  environmentPreset = "city",
  autoFrame = true,
  placeholderSrc,
  showScreenshotButton = false,
  fadeIn = false,
  autoRotate = true,
  autoRotateSpeed = 0.35,
  onModelLoaded,
}: {
  url?: string;
  width?: number | string;
  height?: number | string;
  modelXOffset?: number;
  modelYOffset?: number;
  defaultRotationX?: number;
  defaultRotationY?: number;
  defaultZoom?: number;
  minZoomDistance?: number;
  maxZoomDistance?: number;
  enableMouseParallax?: boolean;
  enableManualRotation?: boolean;
  enableHoverRotation?: boolean;
  enableManualZoom?: boolean;
  ambientIntensity?: number;
  keyLightIntensity?: number;
  fillLightIntensity?: number;
  rimLightIntensity?: number;
  environmentPreset?: string;
  autoFrame?: boolean;
  placeholderSrc?: string;
  showScreenshotButton?: boolean;
  fadeIn?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  onModelLoaded?: () => void;
}) {
  useEffect(() => {
    if (url && (url.endsWith(".glb") || url.endsWith(".gltf"))) useGLTF.preload(url);
  }, [url]);

  const pivot = useRef(new THREE.Vector3()).current;
  const contactRef = useRef<THREE.Group>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const initYaw = deg2rad(defaultRotationX);
  const initPitch = deg2rad(defaultRotationY);
  const camZ = Math.min(Math.max(defaultZoom, minZoomDistance), maxZoomDistance);

  return (
    <div
      style={{
        width: typeof width === "number" ? width : width,
        height: typeof height === "number" ? height : height,
        touchAction: "pan-y pinch-zoom",
        position: "relative",
      }}
    >
      {showScreenshotButton && (
        <button
          onClick={() => {
            const g = rendererRef.current;
            const s = sceneRef.current;
            const c = cameraRef.current;
            if (!g || !s || !c) return;
            g.shadowMap.enabled = false;
            const tmp: { l: THREE.Light; cast: boolean }[] = [];
            s.traverse((o) => {
              if (o instanceof THREE.Light && "castShadow" in o) {
                tmp.push({ l: o, cast: o.castShadow });
                o.castShadow = false;
              }
            });
            if (contactRef.current) contactRef.current.visible = false;
            g.render(s, c);
            const urlPNG = g.domElement.toDataURL("image/png");
            const a = document.createElement("a");
            a.download = "model.png";
            a.href = urlPNG;
            a.click();
            g.shadowMap.enabled = true;
            tmp.forEach(({ l, cast }) => (l.castShadow = cast));
            if (contactRef.current) contactRef.current.visible = true;
            invalidate();
          }}
          style={{
            position: "absolute",
            border: "1px solid rgba(255,255,255,0.2)",
            right: 16,
            top: 16,
            zIndex: 10,
            cursor: "pointer",
            padding: "8px 16px",
            borderRadius: 10,
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            fontSize: 12,
          }}
        >
          Screenshot
        </button>
      )}

      <Canvas
        shadows
        frameloop="demand"
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl: g, scene, camera: c }) => {
          rendererRef.current = g;
          sceneRef.current = scene;
          cameraRef.current = c as THREE.PerspectiveCamera;
          g.toneMapping = THREE.ACESFilmicToneMapping;
          g.outputColorSpace = THREE.SRGBColorSpace;
        }}
        camera={{ fov: 50, position: [0, 0, camZ], near: 0.01, far: 100 }}
        style={{ touchAction: "pan-y pinch-zoom", width: "100%", height: "100%" }}
      >
        {environmentPreset !== "none" && <Environment preset={environmentPreset as any} background={false} />}

        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[5, 5, 5]} intensity={keyLightIntensity} castShadow />
        <directionalLight position={[-5, 2, 5]} intensity={fillLightIntensity} />
        <directionalLight position={[0, 4, -5]} intensity={rimLightIntensity} />

        <ContactShadows ref={contactRef} position={[0, -0.5, 0]} opacity={0.35} scale={10} blur={2} />

        <Suspense fallback={<Loader placeholderSrc={placeholderSrc} />}>
          <ErrorBoundary fallback={<ProceduralGeometry />}>
            <ModelInner
              url={url}
              xOff={modelXOffset}
              yOff={modelYOffset}
              pivot={pivot}
              initYaw={initYaw}
              initPitch={initPitch}
              enableMouseParallax={enableMouseParallax}
              enableManualRotation={enableManualRotation}
              enableHoverRotation={enableHoverRotation}
              autoFrame={autoFrame}
              fadeIn={fadeIn}
              autoRotate={autoRotate}
              autoRotateSpeed={autoRotateSpeed}
              onLoaded={onModelLoaded}
            />
          </ErrorBoundary>
        </Suspense>

        {!isTouch && (
          <DesktopControls pivot={pivot} min={minZoomDistance} max={maxZoomDistance} zoomEnabled={enableManualZoom} />
        )}
      </Canvas>
    </div>
  );
}
