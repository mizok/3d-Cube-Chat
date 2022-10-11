import { Group } from "three";
import { Base } from "./base";
import { Chat } from '../dom';
import { SpaceInvader } from '../dom/space-inavader';
import gsap from "gsap";
import { Clock } from "../dom/clock";

export class DomCube {
    chat: Chat;
    clock: Clock;
    spaceInvader: SpaceInvader;
    groupOuter = new Group();
    groupInner = new Group();
    ready = false;
    constructor(private base: Base) {
        this.init();
    }


    init() {
        this.chat = new Chat(this.base);
        this.clock = new Clock(this.base);
        this.spaceInvader = new SpaceInvader(this.base);
        this.groupInner.scale.set(0, 0, 0);
        this.groupInner.rotation.set(Math.PI / 3, Math.PI / 3, Math.PI / 3);
        this.groupInner.add(this.chat.object);
        this.groupInner.add(this.clock.object);
        this.groupInner.add(this.spaceInvader.object);
        this.groupOuter.add(this.groupInner);
        this.base.scene2.add(this.groupOuter);
        this.doAnimation();
    }

    doAnimation() {
        gsap.to(this.groupInner.rotation, {
            x: 0,
            y: Math.PI / 4,
            z: 0,
            duration: 1, // 用Tween的方式刻意的讓傳遞數值的動作產生delay
            paused: true
        }).play()
        gsap.to(this.groupInner.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 2, // 用Tween的方式刻意的讓傳遞數值的動作產生delay
            paused: true,
            onComplete: () => {
                this.ready = true;
            }
        }).play()
    }

    update(delta: number) {
        if (!this.base.touched && !this.base.getRotationLockStatus()) {
            this.groupOuter.rotation.y += delta / 5;
        }
        this.chat.update();
        this.clock.update();
        this.spaceInvader.update();
    }
}