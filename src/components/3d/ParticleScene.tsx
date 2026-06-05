// @ts-nocheck
import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Points,
  Mesh,
  Color,
  Vector2,
  TorusGeometry,
  SphereGeometry,
  ShaderMaterial,
  AdditiveBlending,
  MathUtils,
} from "three";
import { useUIStore } from "../../lib/uiStore";

// Custom shader material for cinematic particle glow & color interpolation
const NeuralParticleShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uMouseDistortion;
    uniform vec2 uMouse;
    uniform float uTypingIntensity;
    uniform float uPasswordActive;
    uniform float uDestabilize;
    uniform float uSuccess;
    attribute float aSpeed;
    attribute float aRandom;
    varying vec3 vColor;
    varying float vAlpha;

    // Simplex Noise Generator for procedural organic ripple distortion
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vec3 pos = position;

      // 1. Kinetic organic drift
      float driftTime = uTime * aSpeed * 0.4;
      pos.x += sin(driftTime + aRandom) * 0.8;
      pos.y += cos(driftTime * 0.8 + aRandom) * 0.8;
      pos.z += sin(driftTime * 1.2 + aRandom) * 0.5;

      // 2. Mouse gravity repulsion (Bending space)
      vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
      float distToMouse = distance(worldPos.xy, uMouse * 15.0);
      if (distToMouse < 6.0) {
        float force = (1.0 - (distToMouse / 6.0)) * 2.5;
        vec2 dir = normalize(worldPos.xy - uMouse * 15.0);
        pos.xy += dir * force;
      }

      // 3. Typing pulse wave expansion
      float ripple = sin(length(pos.xy) * 0.4 - uTime * 6.0) * uTypingIntensity * 1.5;
      pos.z += ripple;

      // 4. Password masking encryption distortion
      if (uPasswordActive > 0.0) {
        float noise = snoise(pos * 0.15 + vec3(0.0, 0.0, uTime * 4.0));
        pos.xy += noise * uPasswordActive * 1.8;
      }

      // 5. Destabilization explosion
      if (uDestabilize > 0.0) {
        float explode = snoise(pos * 0.1 + uTime) * uDestabilize * 8.0;
        pos += normalize(pos) * explode;
      }

      // 6. Success portal warp tunnel
      if (uSuccess > 0.0) {
        float speedUp = uSuccess * 18.0;
        pos.z += speedUp;
        // Circular compression
        float angle = atan(pos.y, pos.x);
        float radius = length(pos.xy);
        radius = mix(radius, 0.2, uSuccess * 0.6);
        pos.x = cos(angle + uTime * 3.0) * radius;
        pos.y = sin(angle + uTime * 3.0) * radius;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Point size attenuation
      gl_PointSize = (22.0 * aRandom) / -mvPosition.z;
      
      // Amplified point size during success/typing
      gl_PointSize *= (1.0 + uTypingIntensity * 0.5 + uSuccess * 1.5);

      // Colors mapping
      vAlpha = clamp(0.3 + aRandom * 0.7, 0.0, 1.0);
      if (uDestabilize > 0.5) {
        vColor = vec3(1.0, 0.1, 0.2); // Intense glitch crimson red
      } else {
        // Normal state color interpolated by shader
        vColor = color;
      }
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    varying float vAlpha;
    uniform float uTime;

    void main() {
      // Circular volumetric soft rendering
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) discard;

      // Soft glow falloff
      float glow = 1.0 - (dist * 2.0);
      glow = pow(glow, 2.2);

      gl_FragColor = vec4(vColor, glow * vAlpha);
    }
  `,
};

function DynamicParticles({ count = 2000 }) {
  const meshRef = useRef<Points>(null!);
  const materialRef = useRef<ShaderMaterial>(null!);
  
  const uiStore = useUIStore();
  const theme = uiStore.selectedTheme;
  const destabilize = uiStore.destabilizeTrigger;
  const success = uiStore.successTrigger;

  // Track colors dynamically based on selected theme
  const particleColors = useMemo(() => {
    const baseColor = new Color("#63f3ff"); // Default Cyan
    if (theme === "purple") baseColor.set("#c084fc");
    if (theme === "amber") baseColor.set("#fbbf24");
    return baseColor;
  }, [theme]);

  // Set up particle attributes
  const { positions, colors, speeds, randoms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    const rnd = new Float32Array(count);

    const c = new Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spherical distribution with layered shell densities
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.0 + Math.pow(Math.random(), 2.0) * 16.0;

      pos[i3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      // Interpolate colors slightly to add beautiful chromatic diversity
      const randColorChoice = Math.random();
      if (randColorChoice > 0.75) {
        c.copy(particleColors).multiplyScalar(0.7); // darker variant
      } else if (randColorChoice > 0.4) {
        c.set(theme === "cyan" ? "#a5f3fc" : theme === "purple" ? "#f3e8ff" : "#fef3c7"); // whiter variant
      } else {
        c.copy(particleColors);
      }

      col[i3 + 0] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;

      sp[i] = 0.5 + Math.random() * 2.0;
      rnd[i] = Math.random();
    }

    return { positions: pos, colors: col, speeds: sp, randoms: rnd };
  }, [count, particleColors, theme]);

  // Update buffers when colors change
  useEffect(() => {
    if (meshRef.current) {
      const colorAttr = meshRef.current.geometry.attributes.color;
      if (colorAttr) {
        const c = new Color();
        const array = colorAttr.array as Float32Array;
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const choice = randoms[i];
          if (choice > 0.75) {
            c.copy(particleColors).multiplyScalar(0.7);
          } else if (choice > 0.4) {
            c.set(theme === "cyan" ? "#a5f3fc" : theme === "purple" ? "#f3e8ff" : "#fef3c7");
          } else {
            c.copy(particleColors);
          }
          array[i3 + 0] = c.r;
          array[i3 + 1] = c.g;
          array[i3 + 2] = c.b;
        }
        colorAttr.needsUpdate = true;
      }
    }
  }, [particleColors, count, theme, randoms]);

  // Uniform object declaration
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uMouseDistortion: { value: 0.1 },
      uMouse: { value: new Vector2(0, 0) },
      uTypingIntensity: { value: 0 },
      uPasswordActive: { value: 0 },
      uDestabilize: { value: 0 },
      uSuccess: { value: 0 },
    };
  }, []);

  useFrame((state) => {
    const { pointer } = state;
    const time = state.clock.getElapsedTime();

    // Decay typing intensity reactively
    uiStore.decayTypingIntensity();

    // Sync uniforms
    uniforms.uTime.value = time;
    
    // Smooth lerp mouse coordinates
    uniforms.uMouse.value.lerp(new Vector2(pointer.x, pointer.y), 0.1);
    
    // Lerp other intensities
    uniforms.uTypingIntensity.value = MathUtils.lerp(uniforms.uTypingIntensity.value, uiStore.typingIntensity, 0.15);
    uniforms.uPasswordActive.value = MathUtils.lerp(uniforms.uPasswordActive.value, uiStore.isPasswordActive ? 1.0 : 0.0, 0.1);
    uniforms.uDestabilize.value = MathUtils.lerp(uniforms.uDestabilize.value, destabilize ? 1.0 : 0.0, 0.1);
    uniforms.uSuccess.value = MathUtils.lerp(uniforms.uSuccess.value, success ? 1.0 : 0.0, 0.05);

    // Orbit whole particle field slightly
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.05 + pointer.x * 0.2;
      meshRef.current.rotation.x = pointer.y * 0.1;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-aSpeed" count={speeds.length} array={speeds} itemSize={1} />
        <bufferAttribute attach="attributes-aRandom" count={randoms.length} array={randoms} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={NeuralParticleShader.vertexShader}
        fragmentShader={NeuralParticleShader.fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

// 3D Orbital Rings orbiting the central AI core
function CyberRings() {
  const ringRef1 = useRef<Mesh>(null!);
  const ringRef2 = useRef<Mesh>(null!);
  const ringRef3 = useRef<Mesh>(null!);
  
  const theme = useUIStore((s) => s.selectedTheme);
  const success = useUIStore((s) => s.successTrigger);
  const destabilize = useUIStore((s) => s.destabilizeTrigger);

  const ringColor = useMemo(() => {
    if (destabilize) return "#ef4444"; // Glitch red
    if (theme === "purple") return "#c084fc";
    if (theme === "amber") return "#fbbf24";
    return "#22d3ee";
  }, [theme, destabilize]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pulseScale = 1.0 + Math.sin(t * 3.0) * 0.05;

    // First Ring
    if (ringRef1.current) {
      ringRef1.current.rotation.x = t * 0.15;
      ringRef1.current.rotation.y = t * 0.25;
      ringRef1.current.scale.setScalar(pulseScale * (success ? mix(1.0, 0.02, t) : 1.0));
    }

    // Second Ring (Opposite Axis)
    if (ringRef2.current) {
      ringRef2.current.rotation.x = -t * 0.2;
      ringRef2.current.rotation.z = t * 0.3;
      ringRef2.current.scale.setScalar(pulseScale * 1.4 * (success ? mix(1.0, 0.02, t) : 1.0));
    }

    // Third outer orbital Ring
    if (ringRef3.current) {
      ringRef3.current.rotation.y = -t * 0.35;
      ringRef3.current.rotation.z = -t * 0.15;
      ringRef3.current.scale.setScalar(pulseScale * 2.0 * (success ? mix(1.0, 0.02, t) : 1.0));
    }
  });

  // Simple helper to lerp during success portal transition
  const mix = (a: number, b: number, t: number) => a + (b - a) * Math.min(1, t * 0.02);

  return (
    <group position={[0, 0, 0]}>
      {/* Central Neon sphere representing the AI Core */}
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial
          color={destabilize ? "#ef4444" : ringColor}
          transparent
          opacity={success ? 0.05 : 0.8}
          wireframe
        />
      </mesh>
      
      {/* Volumetric glow core */}
      <mesh scale={[1.8, 1.8, 1.8]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial
          color={destabilize ? "#ef4444" : ringColor}
          transparent
          opacity={success ? 0.0 : 0.25}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Orbit Ring 1 */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[3.2, 0.03, 8, 64]} />
        <meshBasicMaterial color={ringColor} transparent opacity={0.65} />
      </mesh>

      {/* Orbit Ring 2 */}
      <mesh ref={ringRef2}>
        <torusGeometry args={[3.2, 0.015, 6, 64]} />
        <meshBasicMaterial color={ringColor} transparent opacity={0.4} />
      </mesh>

      {/* Orbit Ring 3 */}
      <mesh ref={ringRef3}>
        <torusGeometry args={[3.2, 0.02, 8, 64]} />
        <meshBasicMaterial color={ringColor} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

// Controller to animate camera based on Signup Steps and portal animations
function SceneCameraHandler() {
  const { camera } = useThree();
  const signupStep = useUIStore((s) => s.activeSignupStep);
  const success = useUIStore((s) => s.successTrigger);
  const destabilize = useUIStore((s) => s.destabilizeTrigger);

  useFrame(() => {
    // 1. Success portal zoom
    if (success) {
      camera.position.z = MathUtils.lerp(camera.position.z, 0.1, 0.05);
      return;
    }

    // 2. Destabilization shake
    if (destabilize) {
      camera.position.x = MathUtils.lerp(camera.position.x, (Math.random() - 0.5) * 1.5, 0.3);
      camera.position.y = MathUtils.lerp(camera.position.y, (Math.random() - 0.5) * 1.5, 0.3);
      camera.position.z = MathUtils.lerp(camera.position.z, 22.0, 0.2);
      return;
    }

    // 3. Signup Step camera shifts
    // Step 0: Center wide [0, 0, 20]
    // Step 1: Pan left [-4, 0, 16]
    // Step 2: Pan right [4, 2, 14]
    // Step 3: Zoom close center [0, 0, 8]
    let targetX = 0;
    let targetY = 0;
    let targetZ = 18;

    if (signupStep === 1) {
      targetX = -3.5;
      targetY = 0.5;
      targetZ = 15;
    } else if (signupStep === 2) {
      targetX = 3.5;
      targetY = -0.5;
      targetZ = 13;
    } else if (signupStep === 3) {
      targetX = 0;
      targetY = 0;
      targetZ = 9;
    }

    camera.position.x = MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.position.y = MathUtils.lerp(camera.position.y, targetY, 0.04);
    camera.position.z = MathUtils.lerp(camera.position.z, targetZ, 0.04);
  });

  return null;
}

export default function ParticleScene() {
  return (
    <div className="w-full h-full relative bg-radial-gradient">
      {/* Premium Cyber Grid Overlay */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.06] bg-[linear-gradient(rgba(18,150,255,0.15)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(18,150,255,0.15)_1.5px,transparent_1.5px)] bg-[size:32px_32px]"
      />
      <div 
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-black via-transparent to-black"
      />

      <Canvas 
        camera={{ position: [0, 0, 18], fov: 60 }} 
        style={{ width: "100%", height: "100%", background: "#030305" }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 10, 10]} intensity={0.5} />
        <pointLight position={[0, 0, 5]} intensity={1.5} color="#00ffff" />
        
        <DynamicParticles count={2800} />
        <CyberRings />
        <SceneCameraHandler />
      </Canvas>
    </div>
  );
}
