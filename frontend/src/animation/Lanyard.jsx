/* eslint-disable react/no-unknown-property */
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

extend({ MeshLineGeometry, MeshLineMaterial });

/* ================= ROOT ================= */
export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
}) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        {/* <color attach="background" args={["#050505"]} /> */}
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={3}
            position={[0, -1, 5]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={5}
            position={[-10, 0, 14]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

/* ================= BAND ================= */
function Band({ maxSpeed = 50, minSpeed = 0, isMobile }) {
  const bandRef = useRef(null);
  const lineGeoRef = useRef(null);

  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const vec = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);

  const { nodes, materials } = useGLTF("/card.glb");
  const texture = useTexture("/line.png");

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
    []
  );

  const [dragged, setDragged] = useState(false);
  const [hovered, setHovered] = useState(false);

  /* ================= JOINTS ================= */
  const segmentProps = {
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  /* ================= CURSOR ================= */
  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => (document.body.style.cursor = "auto");
  }, [hovered, dragged]);

  /* ================= FRAME ================= */
  useFrame((state, delta) => {
    if (
      !bandRef.current ||
      !lineGeoRef.current ||
      !fixed.current ||
      !card.current
    )
      return;

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    [j1, j2].forEach((ref) => {
      if (!ref.current) return;
      if (!ref.current.lerped)
        ref.current.lerped = ref.current.translation().clone();

      const dist = ref.current.lerped.distanceTo(ref.current.translation());
      const speed = Math.max(
        0.1,
        Math.min(1, dist) * (maxSpeed - minSpeed) + minSpeed
      );

      ref.current.lerped.lerp(ref.current.translation(), delta * speed);
    });

    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(j2.current.lerped);
    curve.points[2].copy(j1.current.lerped);
    curve.points[3].copy(fixed.current.translation());

    lineGeoRef.current.setPoints(curve.getPoints(isMobile ? 16 : 32));

    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
  });

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  curve.curveType = "chordal";

  if (!nodes?.card || !nodes?.clip || !nodes?.clamp) return null;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} type="fixed" />
        <RigidBody ref={j1} position={[0.5, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j2} position={[1, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j3} position={[1.5, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          ref={card}
          position={[2, 0, 0]}
          type={dragged ? "kinematicPosition" : "dynamic"}
          {...segmentProps}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={(e) =>
              setDragged(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(card.current.translation())
              )
            }
            onPointerUp={() => setDragged(false)}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                clearcoat={isMobile ? 0 : 1}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={bandRef}>
        <meshLineGeometry ref={lineGeoRef} />
        <meshLineMaterial
          color="white"
          depthTest={false}
          lineWidth={1}
          useMap
          map={texture}
          repeat={[-4, 1]}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
        />
      </mesh>
    </>
  );
}

useGLTF.preload("/card.glb");
