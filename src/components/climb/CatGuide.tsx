"use client";
import { useEffect, useRef } from "react";

/**
 * The hybrid guide, as decided by Shahzaib:
 * the striped cat (Meshy rig) owns the WALK, because her legs are clean;
 * the mehbilli cat (Animate Anything rig) owns everything after arrival,
 * because its idle and jumps are the good ones. The swap happens the
 * instant she stops, disguised by the turn toward the visitor.
 */
const START_DELAY = 4600;
const WALK_SPEED = 0.62;
const CAT_HEIGHT = 1.08; // world units; bigger presence per feedback

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
      camera.position.set(0, 0.7, 4.4);
      camera.lookAt(0, 0.46, 0);

      const renderer = new WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(w, h);
      renderer.outputColorSpace = SRGBColorSpace;
      holder.appendChild(renderer.domElement);

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
      const [walker, sitter, jsG, jeG] = await Promise.all([
        loader.loadAsync("/amber2.glb"), // striped: clean walk
        loader.loadAsync("/amber.glb"), // mehbilli: idle lives inside
        loader.loadAsync("/amber-jump-start.glb"),
        loader.loadAsync("/amber-jump-end.glb"),
      ]);
      if (disposed) return;

      // --- the walker (striped, Meshy rig) ---
      const wCat = walker.scene;
      const wBox = new Box3().setFromObject(wCat);
      const wScale = CAT_HEIGHT / wBox.getSize(new Vector3()).y;
      wCat.scale.setScalar(wScale);
      const wCenter = new Box3().setFromObject(wCat).getCenter(new Vector3());
      wCat.position.set(-wCenter.x, 0.55 * (CAT_HEIGHT / 0.95), -wCenter.z);
      scene.add(wCat);

      const wMixer = new AnimationMixer(wCat);
      const walk = wMixer.clipAction(walker.animations[0]);
      walk.setLoop(LoopRepeat, Infinity);
      walk.timeScale = 0.85;
      walk.play();

      // --- the performer (mehbilli, Animate Anything rig) ---
      const pCat = sitter.scene;
      const pBox = new Box3().setFromObject(pCat);
      const pScale = CAT_HEIGHT / pBox.getSize(new Vector3()).y;
      pCat.scale.setScalar(pScale);
      const pBox2 = new Box3().setFromObject(pCat);
      const pCenter = pBox2.getCenter(new Vector3());
      pCat.position.set(-pCenter.x, -pBox2.min.y, -pCenter.z);
      pCat.visible = false;
      scene.add(pCat);

      const neckBones: InstanceType<typeof Bone>[] = [];
      pCat.traverse((o) => {
        if ((o as { isBone?: boolean }).isBone && /^(neck0|neck1|head0)$/.test(o.name)) {
          neckBones.push(o as InstanceType<typeof Bone>);
        }
      });

      const pMixer = new AnimationMixer(pCat);
      const idle = pMixer.clipAction(sitter.animations[0]);
      idle.setLoop(LoopRepeat, Infinity);
      const jumpStart = pMixer.clipAction(jsG.animations[0]);
      jumpStart.setLoop(LoopOnce, 1);
      const jumpEnd = pMixer.clipAction(jeG.animations[0]);
      jumpEnd.setLoop(LoopOnce, 1);

      const halfW = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * (w / h);
      const restX = Math.min(1.05, halfW * 0.48);
      const enterX = halfW + 1.0;

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

      const state = { x: enterX, wRotY: -Math.PI / 2 + 0.1, pRotY: -Math.PI / 2 + 0.12 };
      const apply = () => {
        wCat.position.x = state.x - wCenter.x * wScale;
        wCat.rotation.y = state.wRotY;
        pCat.position.x = state.x - pCenter.x * pScale;
        pCat.rotation.y = state.pRotY;
      };

      if (reduce) {
        state.x = restX;
        state.pRotY = -0.45;
        wCat.visible = false;
        pCat.visible = true;
        idle.play();
        pMixer.update(0.1);
        apply();
        renderer.render(scene, camera);
      } else {
        let phase: "enter" | "hopWait" | "hop" | "live" = "enter";
        let phaseT = 0;
        const clock = new Clock();
        let headYaw = 0, headPitch = 0;

        pMixer.addEventListener("finished", (e) => {
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
            state.x -= WALK_SPEED * dt;
            wMixer.update(dt);
            if (state.x <= restX) {
              state.x = restX;
              // the swap: walker bows out, performer takes the stage
              wCat.visible = false;
              pCat.visible = true;
              idle.reset().play();
              phase = "hopWait";
              phaseT = 0;
            }
          } else {
            pMixer.update(dt);

            // turn three-quarters toward the visitor
            state.pRotY += (-0.45 - state.pRotY) * Math.min(1, dt * 2.8);

            if (phase === "hopWait" && phaseT > 0.85) {
              jumpStart.reset().crossFadeFrom(idle, 0.08, false).play();
              phase = "hop";
              phaseT = 0;
            }

            // the head follows the cursor; the running idle rewrites bones
            // every frame, so these additive nudges can never accumulate
            if (phase === "live" && neckBones.length) {
              const stale = performance.now() - lastMove > 4000;
              const targetYaw = stale ? 0 : Math.max(-0.4, Math.min(0.4, -px * 0.5 - 0.1));
              const targetPitch = stale ? 0 : Math.max(-0.22, Math.min(0.28, py * 0.32));
              headYaw += (targetYaw - headYaw) * Math.min(1, dt * 4.5);
              headPitch += (targetPitch - headPitch) * Math.min(1, dt * 4.5);
              neckBones.forEach((b) => {
                b.rotation.y += headYaw / neckBones.length;
                b.rotation.x += headPitch / neckBones.length;
              });
            }
          }

          apply();
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
    }, START_DELAY);

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
      className="pointer-events-none absolute inset-x-0 bottom-[5vh] z-[6] h-[290px] sm:h-[350px] md:h-[420px]"
    />
  );
}
