import { Group } from "three";
import { Base } from "../class/base";
import { Chat } from '../dom';
import { SpaceInvader } from '../dom/space-inavader';
import gsap from "gsap";
import { Clock } from "../dom/clock";
import { cubeLikeConfig, getTargetAngle } from "../util/function";
import { Music } from "../dom/music";

export class DomCube {
    chat: Chat;
    clock: Clock;
    music: Music;
    spaceInvader: SpaceInvader;
    groupOuter = new Group();
    groupInner = new Group();
    constructor(private base: Base) {
        this.init();
    }


    init() {
        this.chat = new Chat(this.base);
        this.clock = new Clock(this.base);
        this.music = new Music(this.base);
        this.spaceInvader = new SpaceInvader(this.base);
        this.groupInner.scale.set(...cubeLikeConfig.initialScale);
        this.groupInner.rotation.set(...cubeLikeConfig.initialRotation);
        this.groupInner.add(this.chat.object);
        this.groupInner.add(this.clock.object);
        this.groupInner.add(this.music.object);
        this.groupInner.add(this.spaceInvader.object);
        this.groupOuter.add(this.groupInner);
        this.base.scene2.add(this.groupOuter);
        this.doAnimation();
    }

    private doAnimation() {
        gsap.to(this.groupInner.rotation, cubeLikeConfig.startAnimationInnerRotationConfig)
        gsap.to(this.groupInner.scale, cubeLikeConfig.startAnimationInnerScalingConfig)
    }

    showChat() {
        gsap.to(this.groupInner.rotation, cubeLikeConfig.showChatAnimationInnerRotationConfig);
        const angle = getTargetAngle(this.groupOuter.rotation.y)
        gsap.to(this.groupOuter.rotation, {
            x: 0,
            y: angle,
            z: 0,
            duration: 2
        })
    }
    showMusic() {
        gsap.to(this.groupInner.rotation, cubeLikeConfig.showMusicAnimationInnerRotationConfig);
        const angle = getTargetAngle(this.groupOuter.rotation.y)
        gsap.to(this.groupOuter.rotation, {
            x: 0,
            y: angle - Math.PI / 4,
            z: 0,
            duration: 2
        })
    }

    update(delta: number) {
        if (!this.base.touched && !this.base.getRotationLockStatus()) {
            this.groupOuter.rotation.y += delta / cubeLikeConfig.updateParameter;
        }
        this.chat.update();
        this.clock.update();
        this.music.update();
        this.spaceInvader.update();
    }
}