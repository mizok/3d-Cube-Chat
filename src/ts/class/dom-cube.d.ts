import { Group } from "three";
import { Base } from "./base";
import { Chat } from '../dom';
import { SpaceInvader } from '../dom/space-inavader';
import { Clock } from "../dom/clock";
export declare class DomCube {
    private base;
    chat: Chat;
    clock: Clock;
    spaceInvader: SpaceInvader;
    groupOuter: Group;
    groupInner: Group;
    ready: boolean;
    constructor(base: Base);
    init(): void;
    doAnimation(): void;
    update(delta: number): void;
}
