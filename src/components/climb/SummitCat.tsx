"use client";
import { useEffect, useRef } from "react";

/**
 * The guide again, at the top. She walked the visitor in at base camp;
 * when they finish the climb she is already here, sitting by the flag,
 * watching them arrive. Mounted lazily: nothing loads until the summit
 * is near the viewport, and amber.glb is already in the browser cache
 * from the hero.
 */
export default function SummitCat() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const holder = mount.current;
    if (!holder) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let raf = 0;
    let cleanup: (() => void) | null = null;

    const boot = async () => {
      if (!mount.current || disposed) return;
      const [three, { GLTFLoader }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/GLTFLoader.js"),
      ]);
      if (!mount.current || disposed) return;
      const {
        Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight,
        Box3, Vector3, SRGBColorSpace, AnimationMixer, Clock, LoopRepeat, Bone,
      } = three;

      let w = holder.clientWidth;
      let h = holder.clientHeight;

      const scene = new Scene();
      const camera = new PerspectiveCamera(30, w / h, 0.1, 50);
      camera.position.set(0, 0.68, 3.3);
      camera.lookAt(0, 0.42, 0);

      const renderer = new WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(w, h);
      renderer.outputColorSpace = SRGBColorSpace;
      holder.appendChild(renderer.domElement);

      const key = new DirectionalLight(0xe8ebe4, 3.0);
      key.position.set(1.2, 2.8, 1.6);
      scene.add(key);
      const fill = new DirectionalLight(0x9db4d0, 0.7);
      fill.position.set(-1.6, 1.0, 1.4);
      scene.add(fill);
      const rim = new DirectionalLight(0xdfe6ee, 1.2);
      rim.position.set(-0.6, 1.9, -2.2);
      scene.add(rim);
      scene.add(new AmbientLight(0x5b7396, 0.42));

      const gltf = await new GLTFLoader().loadAsync("/amber.glb");
      if (disposed) return;

      const cat = gltf.scene;
      const box = new Box3().setFromObject(cat);
      const scale = 0.98 / box.getSize(new Vector3()).y;
      cat.scale.setScalar(scale);
      const box2 = new Box3().setFromObject(cat);
      const center = box2.getCenter(new Vector3());
      cat.position.set(-center.x, -box2.min.y, -center.z);
      cat.rotation.y = -0.38;
      scene.add(cat);

      const neckBones: InstanceType<typeof Bone>[] = [];
      cat.traverse((o) => {
        if ((o as { isBone?: boolean }).isBone && /^(neck0|neck1|head0)$/.test(o.name)) {
          neckBones.push(o as InstanceType<typeof Bone>);
        }
      });

      const mixer = new AnimationMixer(cat);
      const idle = mixer.clipAction(gltf.animations[0]);
      idle.setLoop(LoopRepeat, Infinity);
      idle.play();

      holder.style.opacity = "1";

      if (reduce) {
        mixer.update(0.1);
        renderer.render(scene, camera);
      } else {
        let px = 0, py = 0, lastMove = 0;
        const onMove = (e: PointerEvent) => {
          px = (e.clientX / window.innerWidth - 0.5) * 2;
          py = (e.clientY / window.innerHeight - 0.5) * 2;
          lastMove = performance.now();
        };
        window.addEventListener("pointermove", onMove, { passive: true });

        const onResize = () => {
          w = holder.clientWidth;
          h = holder.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener("resize", onResize);

        const clock = new Clock();
        let headYaw = 0, headPitch = 0;
        const loop = () => {
          const dt = Math.min(clock.getDelta(), 0.05);
          mixer.update(dt);
          // the running idle rewrites bones each frame, so additive is safe
          if (neckBones.length) {
            const stale = performance.now() - lastMove > 4000;
            const targetYaw = stale ? 0 : Math.max(-0.4, Math.min(0.4, -px * 0.5));
            const targetPitch = stale ? 0 : Math.max(-0.22, Math.min(0.3, py * 0.34));
            headYaw += (targetYaw - headYaw) * Math.min(1, dt * 4.5);
            headPitch += (targetPitch - headPitch) * Math.min(1, dt * 4.5);
            neckBones.forEach((b) => {
              b.rotation.y += headYaw / neckBones.length;
              b.rotation.x += headPitch / neckBones.length;
            });
          }
          renderer.render(scene, camera);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("resize", onResize);
          renderer.dispose();
          renderer.domElement.remove();
        };
        return;
      }

      cleanup = () => {
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // load only when the summit is approaching
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          boot();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(holder);

    return () => {
      disposed = true;
      io.disconnect();
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={mount}
      aria-hidden
      className="pointer-events-none mx-auto -mb-2 h-[clamp(150px,20vh,200px)] w-[min(340px,80%)] opacity-0 transition-opacity duration-1000"
    />
  );
}
