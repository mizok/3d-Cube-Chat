import { Matrix4, Object3D, Scene, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Base } from "../class/base";
import { FaceType, ShowScreenTargets } from "../interface";
import { EventEmitter } from "../util";
import { createElementFromHTML, updateOcclude } from "./lib/function";


export class Chat extends EventEmitter implements FaceType {
    object: Object3D
    element: HTMLElement;
    chatMainInner: HTMLElement;
    loginGuide: HTMLElement;
    guestList: HTMLElement;
    private loginGuideBtn: HTMLElement;
    private offset = 1.7;
    private pos = new Vector3(0, 0, this.offset);
    private normal = new Vector3(0, 0, 1);
    private cNormal = new Vector3();
    private cPos = new Vector3();
    private m4 = new Matrix4();
    private timer: any;
    constructor(private base: Base) {
        super();
        this.setElement();
    }
    setElement() {
        this.element = this.base.domBundle.querySelector('#chat-main-cube');
        this.chatMainInner = this.element.querySelector('#chat-main-inner');
        this.loginGuide = this.element.querySelector('#login-guide');
        this.guestList = this.element.querySelector('#guest-list');
        this.loginGuideBtn = this.element.querySelector('#login-guide-button');
        this.object = new CSS3DObject(this.element);
        this.object.position.set(0, 0, this.offset);
        this.object.scale.set(1 / 160, 1 / 160, 1);
        this.bindElementEvents();
    }

    showScreen(target: ShowScreenTargets) {
        const hideClass = 'chat-main__inner--hide';
        const targets = ['chatMainInner', 'loginGuide', 'guestList'];
        this[target].classList.remove(hideClass);
        targets.filter((val) => val !== target).forEach((unchosen) => {
            (this[unchosen as keyof this] as (HTMLElement | any))?.classList.add(hideClass)
        })
    }

    refreshGuestList(list: { username: string, id: string }[]) {
        const containerEle = this.guestList.querySelector('#guest-list-container');
        containerEle.innerHTML = '';
        let total = '';
        const transitionGap = 200;
        list.forEach((guest, index) => {
            const item =
                `
           <li class="guest-list__li guest" style="animation-delay:${transitionGap * index}ms">
                <div class="guest__name">${guest.username}</div>
            </li>
            `
            total += item;
        })
        containerEle.innerHTML = total;
    }

    bindElementEvents() {
        this.loginGuideBtn.addEventListener('pointerdown', () => {
            this.trigger('cube-login-button-click');
        })
    }

    setGuestNumber(data: number) {
        const containerEle = this.guestList.querySelector('#guest-number');
        containerEle.innerHTML = `NOW ONLINE: ${data}`
    }


    update() {
        updateOcclude(this);
    }
}