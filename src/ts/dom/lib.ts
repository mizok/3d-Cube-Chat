import { Object3D, Vector3 } from "three";
import { Base } from "../class/base";


export function updateOcclude(offset: number, element: HTMLElement, object: Object3D, base: Base) {
    const bias = - offset / 10;
    const objectToward = object.getWorldDirection(new Vector3(0, 0, 0));
    const cameraToward = base.camera.instance.getWorldDirection(new Vector3(0, 0, 0));
    const dp = objectToward.dot(cameraToward);
    if (dp > bias) {
        element.style.opacity = '0';
    }
    else {
        element.style.opacity = '1';
    }
}

export function pad(n: number, l: number) {
    for (var r = n.toString(); r.length < l; r = 0 + r);
    return r;
}