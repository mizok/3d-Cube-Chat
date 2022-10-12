export function updateOcclude(faceType: any) {
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

export const cubeLikeConfig = {
  initialScale: [0, 0, 0] as const,
  initialRotation: [Math.PI / 3, -Math.PI / 3, Math.PI / 3] as const,
  startAnimationInnerRotationConfig: {
    x: 0,
    y: Math.PI / 4,
    z: 0,
    duration: 2
  },
  startAnimationInnerScalingConfig: {
    x: 1,
    y: 1,
    z: 1,
    duration: 2
  },
  showChatAnimationInnerRotationConfig: {
    x: 0,
    y: -Math.PI / 4,
    z: 0,
    duration: 2
  },
  showChatAnimationOuterRotationConfig: {
    x: 0,
    y: 0,
    z: 0,
    duration: 2
  },
  updateParameter: 5
}


export function createElementFromHTML(htmlString: string) {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}

export function getTargetAngle(angle: number) {
  const remain = angle % (2 * Math.PI);
  const minor = angle - remain - 0.25 * Math.PI;
  const major = angle + ((3 * Math.PI / 4) - remain)
  const newAngle = remain < Math.PI ? minor : major;
  return newAngle;
}