import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ──────────────────────────────────────────────────────
// UTILS
// ──────────────────────────────────────────────────────

// Linearly interpolate between two THREE.Color objects
function lerpThreeColor(target: THREE.Color, a: THREE.Color, b: THREE.Color, t: number) {
  target.r = THREE.MathUtils.lerp(a.r, b.r, t);
  target.g = THREE.MathUtils.lerp(a.g, b.g, t);
  target.b = THREE.MathUtils.lerp(a.b, b.b, t);
}

// Map Heat Index (°C) to a 0–1 heat factor aligned to DOLE/NWS thresholds:
//   0   → SAFE  (HI < 27°C)       — comfortable, cool sky
//   0.19 → CAUTION (HI 27°C)       — mild warmth begins
//   0.56 → EXTREME CAUTION (HI 32°C)
//   0.93 → DANGER  (HI 41°C)
//   1   → EXTREME DANGER (HI ≥ 54°C) — burnt orange haze
function heatFactor(hi: number): number {
  return Math.min(Math.max((hi - 27) / 27, 0), 1);
}

// ──────────────────────────────────────────────────────
// LIGHTING APPROACH
// ──────────────────────────────────────────────────────
//
//  AmbientLight   = "base daylight from the sky"
//  DirectionalLight (sun) = "the actual sun"
//  DirectionalLight (fill) = "bounce light" — softens harsh shadows
//  Fog + Scene BG = "atmosphere / heat haze"
//
//  When temperature rises:
//    → Sun gets more intense AND shifts to warm golden/orange
//    → Ambient dims (shadows deepen) AND shifts warm
//    → Fill light fades out (harsher contrast)
//    → Fog gets thicker AND shifts to warm haze
//    → Scene background shifts from cool sky to hot haze
//
//  The key: change BOTH color AND intensity together.
//  That's what makes it look like actual heat, not a color filter.
// ──────────────────────────────────────────────────────

// Pre-allocated color objects (avoid GC churn in render loop)
const SUN_COOL  = new THREE.Color("#ffffff");   // Clean white daylight
const SUN_HOT   = new THREE.Color("#ff9933");   // Deep warm orange sun
const AMB_COOL  = new THREE.Color("#b0d0ff");   // Cool blue sky fill
const AMB_HOT   = new THREE.Color("#ffcc88");   // Warm golden ambient
const FOG_COOL  = new THREE.Color("#a8c8e8");   // Clear sky blue
const FOG_HOT   = new THREE.Color("#e8a050");   // Thick orange haze
const BG_COOL   = new THREE.Color("#87CEEB");   // Sky blue
const BG_HOT    = new THREE.Color("#c87830");   // Hazy burnt orange sky

interface EnvironmentProps {
  temperature: number;
}

// Updates lights, fog, and background every frame based on temperature
function DynamicEnvironment({ temperature }: EnvironmentProps) {
  const { scene } = useThree();
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const ambRef = useRef<THREE.AmbientLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);
  const fogRef = useRef<THREE.Fog>(null);

  // Create fog once
  useEffect(() => {
    const fog = new THREE.Fog("#a8c8e8", 800, 3000);
    scene.fog = fog;
    fogRef.current = fog;
    return () => { scene.fog = null; };
  }, [scene]);

  // Smoothly update every frame so slider dragging feels responsive
  useFrame(() => {
    const t = heatFactor(temperature);

    // ── Sun (DirectionalLight) ─────────────────────
    // Intensity: 1.5 at cool → 3.5 at extreme heat
    //   Higher intensity = brighter highlights, deeper shadows
    // Color: white → deep warm orange
    if (sunRef.current) {
      sunRef.current.intensity = THREE.MathUtils.lerp(1.5, 3.5, t);
      lerpThreeColor(sunRef.current.color, SUN_COOL, SUN_HOT, t);
    }

    // ── Ambient Light ──────────────────────────────
    // Intensity: 0.65 at cool → 0.25 at extreme
    //   Lower ambient = more shadow contrast (harsh midday feel)
    // Color: cool sky blue → warm golden
    if (ambRef.current) {
      ambRef.current.intensity = THREE.MathUtils.lerp(0.65, 0.25, t);
      lerpThreeColor(ambRef.current.color, AMB_COOL, AMB_HOT, t);
    }

    // ── Fill Light (bounce / secondary) ────────────
    // Fades out as heat rises to increase shadow drama
    if (fillRef.current) {
      fillRef.current.intensity = THREE.MathUtils.lerp(0.4, 0.05, t);
    }

    // ── Fog ────────────────────────────────────────
    // Pushed far out so the model is always fully visible
    // Fog only affects distant background, never the foreground model
    if (fogRef.current) {
      fogRef.current.near = THREE.MathUtils.lerp(2000, 500, t);
      fogRef.current.far = THREE.MathUtils.lerp(8000, 2000, t);
      lerpThreeColor(fogRef.current.color, FOG_COOL, FOG_HOT, t);
    }

    // ── Scene Background ──────────────────────────
    // Synced with fog so the horizon blends naturally
    if (!scene.background) scene.background = new THREE.Color();
    lerpThreeColor(scene.background as THREE.Color, BG_COOL, BG_HOT, t);
  });

  return (
    <>
      {/* Ambient: sky fill light */}
      <ambientLight ref={ambRef} intensity={0.65} />

      {/* Sun: main directional light — high angle for long, dramatic shadows */}
      <directionalLight
        ref={sunRef}
        position={[15, 25, 20]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      {/* Fill: soft bounce light from opposite side — prevents pitch-black shadows */}
      <directionalLight
        ref={fillRef}
        position={[-8, 5, -12]}
        intensity={0.4}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────
// CITY MODEL — loads GLB, enables shadows, auto-fits camera
// ──────────────────────────────────────────────────────

function CityModel() {
  const { scene } = useGLTF("/models/city.glb");
  const { camera, invalidate } = useThree();

  useEffect(() => {
    // Enable shadows on every mesh in the model
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Auto-fit camera to the model's bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.set(
      center.x + maxDim * 0.25,
      center.y + maxDim * 0.15,
      center.z + maxDim * 0.25
    );
    camera.lookAt(center);
    camera.near = maxDim * 0.01;
    camera.far = maxDim * 10;
    camera.updateProjectionMatrix();
    invalidate();
  }, [scene, camera, invalidate]);

  return <primitive object={scene} />;
}

// ──────────────────────────────────────────────────────
// EXPORTED COMPONENT
// ──────────────────────────────────────────────────────

export function CityScene({ temperature }: { temperature: number }) {
  return (
    <Canvas
      shadows
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 45, near: 0.1, far: 100000 }}
      resize={{ debounce: 0 }}
    >
      <DynamicEnvironment temperature={temperature} />
      <Suspense fallback={null}>
        <CityModel />
      </Suspense>
      {/* Still draggable — logs position to console so you can find your angle */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        autoRotate={false}
        onChange={(e) => {
          const cam = e?.target.object;
          if (cam) {
            console.log(
              `Camera: [${cam.position.x.toFixed(2)}, ${cam.position.y.toFixed(2)}, ${cam.position.z.toFixed(2)}]`
            );
          }
        }}
      />
    </Canvas>
  );
}

useGLTF.preload("/models/city.glb");
