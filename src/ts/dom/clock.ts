import { Matrix4, Object3D, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Base } from "../class/base";
import { FaceType } from "../interface";
import { pad, updateOcclude } from "./lib";

export class Clock implements FaceType {
    object: Object3D
    element: HTMLElement
    private offset = 1.7;
    private pos = new Vector3(-this.offset, 0, 0);
    private normal = new Vector3(-1, 0, 0);
    private cNormal = new Vector3();
    private cPos = new Vector3();
    private m4 = new Matrix4();
    private timer: any;
    constructor(private base: Base) {
        this.setElement();
    }
    setElement() {
        this.element = this.base.domBundle.querySelector('#clock');
        this.object = new CSS3DObject(this.element);
        this.object.position.set(-this.offset, 0, 0);
        this.object.rotation.y = - Math.PI / 2;
        this.object.scale.set(1 / 160, 1 / 160, 1);
        this.initClock();
    }

    updateClock() {
        const now = new Date();
        const
            sec = now.getSeconds(),
            min = now.getMinutes(),
            hou = now.getHours(),
            mo = now.getMonth(),
            dy = now.getDate(),
            yr = now.getFullYear();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const tags = ["mon", "d", "y", "h", "m", "s"],
            corr = [months[mo], dy, yr, pad(hou, 2), pad(min, 2), pad(sec, 2)];
        for (let i = 0; i < tags.length; i++)
            this.element.querySelector(`#${tags[i]}`).innerHTML = corr[i].toString();
    }

    initClock() {
        this.updateClock();//先執行一次避免開場有破綻
        this.timer = setInterval(this.updateClock.bind(this), 1000);
    }

    update() {
        updateOcclude(this);
    }
}