import React, { useCallback } from "react";
import { Html, OrbitControls, PerspectiveCamera, View } from "@react-three/drei";
import * as THREE from 'three';
import Lights from './Lights';
import Loader from './Loader';
import IPhone from './Iphone';
import { Suspense, useMemo } from "react";


const ModelView = React.memo(({ index, groupRef, gsapType, controlRef, setRotationState, size, item }) => {

  const targetVector = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  const handleRotationEnd = useCallback(() => {
    if (controlRef.current) {
      setRotationState(controlRef.current.getAzimuthalAngle());
    }
  }, [controlRef, setRotationState]);

  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
    >
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />

      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      <Lights />

      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={targetVector}
        onEnd={handleRotationEnd}
      />

      <group 
      ref={groupRef} 
      name={`${index === 1 ? 'small' : 'large'}`} position={[0, 0 ,0]}
      >
        <Suspense fallback={<Loader />}>
          <IPhone 
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  );
});

export default ModelView;
