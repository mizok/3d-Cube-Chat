export function updateOcclude(faceType:any) {
  const box = faceType.base.playground.cube.mesh;

  faceType.cNormal.copy(faceType.normal).applyMatrix3(box.normalMatrix);

  faceType.cPos.copy(faceType.pos).applyMatrix4(faceType.m4.multiplyMatrices(faceType.base.camera.instance.matrixWorldInverse, box.matrixWorld));

  let d = faceType.cPos.negate().dot(faceType.cNormal);
  
  faceType.element.style.visibility = d < 0 ? "hidden" : "visible";
}

export function pad(n: number, l: number) {
    for (var r = n.toString(); r.length < l; r = 0 + r);
    return r;
}