import { Group } from "three";
import { Base } from "./base";
import { Chat } from '../dom';
import { SpaceInvader } from '../dom/space-inavader';
import gsap from "gsap";
import { Clock } from "../dom/clock";
import { cubeLikeConfig } from "../dom/lib/function";

export class DomCube {
    chat: Chat;
    clock: Clock;
    spaceInvader: SpaceInvader;
    groupOuter = new Group();
    groupInner = new Group();
    constructor(private base: Base) {
        this.init();
    }


    init() {
        this.chat = new Chat(this.base);
        this.clock = new Clock(this.base);
        this.spaceInvader = new SpaceInvader(this.base);
        this.groupInner.scale.set(...cubeLikeConfig.initialScale);
        this.groupInner.rotation.set(...cubeLikeConfig.initialRotation);
        this.groupInner.add(this.chat.object);
        this.groupInner.add(this.clock.object);
        this.groupInner.add(this.spaceInvader.object);
        this.groupOuter.add(this.groupInner);
        this.base.scene2.add(this.groupOuter);
        this.doAnimation();
    }

    doAnimation() {
        gsap.to(this.groupInner.rotation, cubeLikeConfig.startAnimationInnerRotationConfig)
        gsap.to(this.groupInner.scale, cubeLikeConfig.startAnimationInnerScalingConfig)
    }

    showChat() {
        gsap.to(this.groupInner.rotation, cubeLikeConfig.showChatAnimationInnerRotationConfig)
        gsap.to(this.groupOuter.rotation, cubeLikeConfig.showChatAnimationOuterRotationConfig)
    }

    update(delta: number) {
        if (!this.base.touched && !this.base.getRotationLockStatus()) {
            this.groupOuter.rotation.y += delta / cubeLikeConfig.updateParameter;
        }
        this.chat.update();
        this.clock.update();
        this.spaceInvader.update();
    }
}