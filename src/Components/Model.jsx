import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import ModelView from "./ModelView";
import { yellowImg } from "../utils";
import * as THREE from 'three';
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { models, sizes } from '../Constants';
import { animateWithGsapTimeline } from "../utils/animations";

const Model = () => {
  const [size, setSize] = useState('small');
  const [model, setModel] = useState({
    title: 'iPhone 15 Pro in Natural Titanium',
    color: ['#8F8A81', '#FFE7B9', '#6F6C64'],
    img: yellowImg,
  });

  const cameraControlSmall = useRef();
  const cameraControlLarge = useRef();

  const small = useRef(new THREE.Group());
  const large = useRef(new THREE.Group());

  const [smallRotation, setSmallRotation] = useState(0);
  const [largeRotation, setLargeRotation] = useState(0);

  const tl = gsap.timeline();

  const smallModelObserver = useRef(null);
  const largeModelObserver = useRef(null);

  const startRotation = (modelRef) => {
    gsap.to(modelRef.rotation, {
      y: "+=6.28", // 360 degrees in radians
      repeat: -1, // Repeat indefinitely
      duration: 10, // Rotate in 10 seconds
      ease: "none", // No easing, continuous rotation
    });
  };

  const stopRotation = (modelRef) => {
    gsap.killTweensOf(modelRef.rotation); // Stop rotation
  };

  useEffect(() => {
    // Animate iPhone model rotation when the size changes (either small or large)
    if (size === 'large') {
      animateWithGsapTimeline(tl, small, smallRotation, '#view1', '#view2', {
        transform: 'translateX(-100%)',
        duration: 2
      });
      stopRotation(small.current); // Stop small model rotation
      startRotation(large.current); // Start large model rotation
    }

    if (size === 'small') {
      animateWithGsapTimeline(tl, large, largeRotation, '#view2', '#view1', {
        transform: 'translateX(0)',
        duration: 2
      });
      stopRotation(large.current); // Stop large model rotation
      startRotation(small.current); // Start small model rotation
    }
  }, [size]);

  useEffect(() => {
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.5, // Trigger when 50% of the model is in view
    };

    // Observer callback for small model
    const smallModelObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startRotation(small.current); // Start rotation when in view
        } else {
          stopRotation(small.current); // Stop rotation when out of view
        }
      });
    };

    // Observer callback for large model
    const largeModelObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startRotation(large.current); // Start rotation when in view
        } else {
          stopRotation(large.current); // Stop rotation when out of view
        }
      });
    };

    // Creating observers for both models
    smallModelObserver.current = new IntersectionObserver(smallModelObserverCallback, options);
    largeModelObserver.current = new IntersectionObserver(largeModelObserverCallback, options);

    // Start observing the models' container DOM elements (wrappers)
    const smallModelElement = document.getElementById('small-model');
    const largeModelElement = document.getElementById('large-model');

    if (smallModelElement) {
      smallModelObserver.current.observe(smallModelElement);
    }

    if (largeModelElement) {
      largeModelObserver.current.observe(largeModelElement);
    }

    // Cleanup observers on unmount
    return () => {
      if (smallModelObserver.current) {
        smallModelObserver.current.disconnect();
      }
      if (largeModelObserver.current) {
        largeModelObserver.current.disconnect();
      }
    };
  }, []);

  useGSAP(() => {
    gsap.to('#heading', { y: 0, opacity: 1 });
  }, []);

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading">
          Take a closer look.
        </h1>

        <div className="flex flex-col items-center mt-5">
          <div className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative">
            {/* Wrapper div for small model */}
            <div id="small-model">
              <ModelView 
                index={1}
                groupRef={small}
                gsapType="view1"
                controlRef={cameraControlSmall}
                setRotationState={setSmallRotation}
                item={model}
                size={size}
              />
            </div>

            {/* Wrapper div for large model */}
            <div id="large-model">
              <ModelView 
                index={2}
                groupRef={large}
                gsapType="view2"
                controlRef={cameraControlLarge}
                setRotationState={setLargeRotation}
                item={model}
                size={size}
              />
            </div>

            <Canvas
              className="w-full h-full"
              style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: 'hidden'
              }}
              eventSource={document.getElementById('root')}
            >
              <View.Port />
            </Canvas>
          </div>

          <div className="mx-auto w-full">
            <p className="text-sm font-light text-center mb-5">{model.title}</p>

            <div className="flex-center">
              <ul className="color-container">
                {models.map((item, i) => (
                  <li key={i} className="w-6 h-6 rounded-full mx-2 cursor-pointer" style={{ backgroundColor: item.color[0] }} onClick={() => setModel(item)} />
                ))}
              </ul>

              <button className="size-btn-container">
                {sizes.map(({ label, value }) => (
                  <span key={label} className="size-btn" style={{ backgroundColor: size === value ? 'white' : 'transparent', color: size === value ? 'black' : 'white'}} onClick={() => setSize(value)}>
                    {label}
                  </span>
                ))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Model;
