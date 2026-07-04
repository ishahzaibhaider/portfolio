"use client";
import { useEffect, useRef } from "react";

/**
 * Amber's entrance performance:
 * she walks in from the right when the scene has settled, arrives at her
 * spot, hops a hello, then idles while her head follows the visitor's cursor.
 */
export default function CatGuide() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let raf = 0;
    let cleanup: (() => void) | null = null;

    const start = window.setTimeout(async () => {
      if (!mount.current || disposed) return;
      const [three, { GLTFLoader }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/GLTFLoader.js"),
      ]);
      if (!mount.current || disposed) return;
      const {
        Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight,
        Box3, Vector3, SRGBColorSpace, AnimationMixer, Clock, LoopRepeat, LoopOnce, Bone,
      } = three;

      const holder = mount.current;
      let w = holder.clientWidth;
      let h = holder.clientHeight;

      const scene = new Scene();
      const camera = new PerspectiveCamera(30, w / h, 0.1, 50);
      camera.position.set(0, 0.66, 4.2);
      camera.lookAt(0, 0.42, 0);

      const renderer = new WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(w, h);
      renderer.outputColorSpace = SRGBColorSpace;
      holder.appendChild(renderer.domElement);

      // brighter moonlight: strong arctic key, steel fill, back rim for pop
      const key = new DirectionalLight(0xe8ebe4, 3.1);
      key.position.set(1.4, 2.6, 1.8);
      scene.add(key);
      const fill = new DirectionalLight(0x9db4d0, 0.75);
      fill.position.set(-1.6, 1.0, 1.4);
      scene.add(fill);
      const rim = new DirectionalLight(0xdfe6ee, 1.1);
      rim.position.set(-0.8, 1.8, -2.2);
      scene.add(rim);
      scene.add(new AmbientLight(0x5b7396, 0.42));

      const loader = new GLTFLoader();
      const [base, walkG, jsG, jeG] = await Promise.all([
        loader.loadAsync("/amber.glb"),
        loader.loadAsync("/amber-walk.glb"),
        loader.loadAsync("/amber-jump-start.glb"),
        loader.loadAsync("/amber-jump-end.glb"),
      ]);
      if (disposed) return;

      const cat = base.scene;
      const box = new Box3().setFromObject(cat);
      const size = box.getSize(new Vector3());
      const scale = 0.92 / size.y;
      cat.scale.setScalar(scale);
      const box2 = new Box3().setFromObject(cat);
      const center = box2.getCenter(new Vector3());
      const groundY = -box2.min.y;
      cat.position.set(-center.x, groundY, -center.z);
      scene.add(cat);

      // resting spot: right of center, clamped inside narrow viewports
      const halfW = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * (w / h);
      const restX = Math.min(1.0, halfW * 0.52);
      const enterX = halfW + 0.9;

      // head bones for cursor tracking
      const neckBones: InstanceType<typeof Bone>[] = [];
      cat.traverse((o) => {
        if ((o as { isBone?: boolean }).isBone && /^(neck0|neck1|head0)$/.test(o.name)) {
          neckBones.push(o as InstanceType<typeof Bone>);
        }
      });

      const mixer = new AnimationMixer(cat);
      const clips = {
        idle: base.animations[0],
        walk: walkG.animations[0],
        jumpStart: jsG.animations[0],
        jumpEnd: jeG.animations[0],
      };
      const idle = mixer.clipAction(clips.idle);
      idle.setLoop(LoopRepeat, Infinity);
      const walk = mixer.clipAction(clips.walk);
      walk.setLoop(LoopRepeat, Infinity);
      const jumpStart = mixer.clipAction(clips.jumpStart);
      jumpStart.setLoop(LoopOnce, 1);
      const jumpEnd = mixer.clipAction(clips.jumpEnd);
      jumpEnd.setLoop(LoopOnce, 1);

      // pointer state for head tracking
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

      if (reduce) {
        cat.position.x = restX;
        cat.rotation.y = -0.45;
        idle.play();
        mixer.update(0);
        renderer.render(scene, camera);
      } else {
        // -------- the performance --------
        let phase: "enter" | "hopWait" | "hop" | "live" = "enter";
        let phaseT = 0;
        cat.position.x = enterX;
        cat.rotation.y = -Math.PI / 2 + 0.12; // profile, walking left
        walk.play();

        const WALK_SPEED = 0.72; // world units per second
        const clock = new Clock();
        let headYaw = 0, headPitch = 0;

        mixer.addEventListener("finished", (e) => {
          if (e.action === jumpStart) {
            jumpEnd.reset().crossFadeFrom(jumpStart, 0.05, false).play();
          } else if (e.action === jumpEnd) {
            idle.reset().crossFadeFrom(jumpEnd, 0.3, false).play();
            phase = "live";
          }
        });

        const loop = () => {
          const dt = Math.min(clock.getDelta(), 0.05);
          phaseT += dt;

          if (phase === "enter") {
            cat.position.x -= WALK_SPEED * dt;
            if (cat.position.x <= restX) {
              cat.position.x = restX;
              idle.reset().crossFadeFrom(walk, 0.35, false).play();
              phase = "hopWait";
              phaseT = 0;
            }
          } else if (phase === "hopWait") {
            // turn to three-quarter view, then say hi with a hop
            cat.rotation.y += (-0.45 - cat.rotation.y) * Math.min(1, dt * 3.2);
            if (phaseT > 0.85) {
              jumpStart.reset().crossFadeFrom(idle, 0.08, false).play();
              phase = "hop";
              phaseT = 0;
            }
          }

          mixer.update(dt);

          // head follows the visitor once she has settled
          if (phase === "live" && neckBones.length) {
            const stale = performance.now() - lastMove > 4000;
            const targetYaw = stale ? 0 : Math.max(-0.4, Math.min(0.4, -px * 0.5 - 0.1));
            const targetPitch = stale ? 0 : Math.max(-0.22, Math.min(0.3, py * 0.32));
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
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        renderer.domElement.remove();
      };
    }, 4600); // after the scene entrance settles

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
      className="pointer-events-none absolute inset-x-0 bottom-[2vh] z-[6] h-[220px] sm:h-[280px] md:h-[340px]"
    />
  );
}
