import { Group } from "three";
import { Base } from "../class/base";
import { Chat } from '../dom';
import { SpaceInvader } from '../dom/space-inavader';
import { Clock } from "../dom/clock";
import { Music } from "../dom/music";
export declare class DomCube {
    private base;
    chat: Chat;
    clock: Clock;
    music: Music;
    spaceInvader: SpaceInvader;
    groupOuter: Group;
    groupInner: Group;
    constructor(base: Base);
    init(): void;
    doAnimation(): void;
    showChat(): void;
    showMusic(): void;
    update(delta: number): void;
}
