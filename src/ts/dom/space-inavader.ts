import { Object3D, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Base } from "../class/base";
import { FaceType } from "../interface";
import { updateOcclude } from "./lib";

export class SpaceInvader implements FaceType {
    object: Object3D
    element: HTMLElement
    private offset = 1.7;
    constructor(private base: Base) {
        this.setElement();
    }
    setElement() {
        this.element = this.base.domBundle.querySelector('#space-invader');
        this.object = new CSS3DObject(this.element);
        this.object.position.set(0, 0, -this.offset);
        this.object.rotation.y = - Math.PI;
        this.object.scale.set(1 / 160, 1 / 160, 1);
    }

    update() {
        updateOcclude(this.offset, this.element, this.object, this.base);
    }
}