# MehSecondBILLI, ready for Animate Anything (UI flow)

amber2-upload.glb · 86,924 triangles · from the PLAIN static Meshy download,
same pipeline that passed before. Preview will show a cat this time.

## Steps (the flow you know)
1. animateanything.ai -> upload amber2-upload.glb
2. Name: MehSecondBILLI · Type: CAT
3. Rotation: check against reference, symmetry: symmetrical
4. Bone style: pyramid, verify leg chains sit inside legs
5. Add ALL available animations (idle, walk, run, jumps...)
6. AFTER processing: look for an "add more animations" option on the
   processed model page and grab lie_down / paw_attack / bite_attack
   if the UI offers them (the API lists them for cats).
7. Export GLB with animations -> drop the folder in the repo.
