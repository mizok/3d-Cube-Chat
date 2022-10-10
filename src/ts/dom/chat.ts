import { Object3D, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Base } from "../class/base";

export class Chat {
    object: Object3D
    element: HTMLElement
    private offset = 1.7;
    constructor(private base: Base) {
        this.setElement();
    }
    setElement() {
        this.element = this.base.domBundle.querySelector('#chat-main');
        this.object = new CSS3DObject(this.element);
        this.object.position.set(0, 0, this.offset);
        this.object.scale.set(1 / 160, 1 / 160, 1 / 160);
    }

    update() {
        const bias = -this.offset / 10;
        const objectToward = this.object.getWorldDirection(new Vector3(0, 0, 0));
        const cameraToward = this.base.camera.instance.getWorldDirection(new Vector3(0, 0, 0));
        const dp = objectToward.dot(cameraToward);
        if (dp > bias) {
            this.element.style.opacity = '0';
        }
        else {
            this.element.style.opacity = '1';
        }
    }
}