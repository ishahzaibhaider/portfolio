"use client";
import { useEffect, useRef } from "react";

/**
 * Interim guide: the static cadnav cat, moon-lit on the front ridge.
 * Swapped for the rigged, animated cat once it passes its checkpoint;
 * this component already owns the loader, lighting, and placement.
 */
export default function CatGuide() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let raf = 0;
    let cleanup: (() => void) | null = null;

    // let the entrance choreography own the first seconds
    const start = window.setTimeout(async () => {
      if (!mount.current || disposed) return;
      const [{ Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight, Box3, Vector3, SRGBColorSpace }, { GLTFLoader }] =
        await Promise.all([import("three"), import("three/examples/jsm/loaders/GLTFLoader.js")]);
      if (!mount.current || disposed) return;

      const holder = mount.current;
      const w = holder.clientWidth;
      const h = holder.clientHeight;

      const scene = new Scene();
      const camera = new PerspectiveCamera(32, w / h, 0.1, 50);
      camera.position.set(0, 0.62, 3.1);
      camera.lookAt(0, 0.42, 0);

      const renderer = new WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(w, h);
      renderer.outputColorSpace = SRGBColorSpace;
      holder.appendChild(renderer.domElement);

      // moonlight: arctic key from high right-behind, steel fill, low ambient
      const key = new DirectionalLight(0xe0e1dd, 2.0);
      key.position.set(1.6, 2.4, -1.2);
      scene.add(key);
      const fill = new DirectionalLight(0x778da9, 0.4);
      fill.position.set(-1.4, 0.8, 1.6);
      scene.add(fill);
      scene.add(new AmbientLight(0x415a77, 0.22));

      const gltf = await new GLTFLoader().loadAsync("/cat.glb");
      if (disposed) return;
      const cat = gltf.scene;

      // normalize whatever scale/origin the FBX shipped with
      const box = new Box3().setFromObject(cat);
      const size = box.getSize(new Vector3());
      const scale = 0.9 / size.y;
      cat.scale.setScalar(scale);
      const box2 = new Box3().setFromObject(cat);
      const center = box2.getCenter(new Vector3());
      cat.position.x -= center.x;
      cat.position.y -= box2.min.y;
      cat.position.z -= center.z;
      cat.rotation.y = -0.55;
      scene.add(cat);

      if (reduce) {
        renderer.render(scene, camera);
      } else {
        let t = 0;
        const loop = () => {
          t += 0.016;
          // idle: a slow breath and the faintest sway, nothing cartoonish
          cat.position.y = Math.sin(t * 1.6) * 0.008;
          cat.rotation.y = -0.55 + Math.sin(t * 0.35) * 0.04;
          renderer.render(scene, camera);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        renderer.dispose();
        renderer.domElement.remove();
      };
    }, 3400);

    return () => {
      disposed = true;
      window.clearTimeout(start);
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={mount}
      aria-hidden
      className="pointer-events-none absolute bottom-[7vh] right-[9%] z-[6] h-[240px] w-[240px] sm:right-[14%] md:h-[280px] md:w-[280px]"
    />
  );
}
