import { Html } from '@react-three/drei';
import React from 'react';

// A rotating 3D ring loader component with improved visibility and contrast
const Loader = () => {
  return (
    <Html>
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
        {/* Loader Ring */}
        <div className="relative w-[15vw] h-[15vw] flex justify-center items-center">
          <div className="absolute w-full h-full rounded-full border-t-4 border-t-yellow-500 border-gray-400 animate-spin "></div>
          <div className="absolute w-[50%] h-[50%] rounded-full border-t-4 border-t-blue-500 border-gray-400 animate-spin" style={{ animationDuration: '1s' }}></div>
          <div className="absolute text-xl font-semibold text-white">Loading...</div>
        </div>
      </div>
    </Html>
  );
};

export default Loader;
