import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "./Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./books/scene.gltf");

  return (
    <mesh>
      <pointLight position={[0, 10, -5]} intensity={700} color="white" />
      <pointLight position={[0, -10, 5]} intensity={300} color="blue" />
      <pointLight position={[0, 10, 5]} intensity={300} color="blue" />
      <pointLight position={[0, 10, 5]} intensity={300} color="blue" />

      <primitive
        object={computer.scene}
        scale={isMobile ? 30 : 15}
        position={isMobile ? [0, -1.5, 0] : [0, -1, -0.5]}
        rotation={[-0.01, -2.1, -0.1]}
      />
    </mesh>
  );
};

const Threemodel = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    const mediaQuery = window.matchMedia("(max-width: 1000px)");
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: isMobile ? [25, 0, 25] : [20, 3, 5], fov: 20 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 3}
          minPolarAngle={Math.PI / 3}
          autoRotate
          autoRotateSpeed={0.25}
        />
        <Computers isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default Threemodel;
