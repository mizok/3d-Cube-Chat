import { Object3D } from "three";
import { Base } from "../class/base";
import { FaceType, ShowScreenTargets } from "../interface";
import { EventEmitter } from "../util";
export declare class Chat extends EventEmitter implements FaceType {
    private base;
    object: Object3D;
    element: HTMLElement;
    chatMainInner: HTMLElement;
    loginGuide: HTMLElement;
    guestList: HTMLElement;
    private loginGuideBtn;
    private offset;
    private pos;
    private normal;
    private cNormal;
    private cPos;
    private m4;
    private timer;
    constructor(base: Base);
    setElement(): void;
    showScreen(target: ShowScreenTargets): void;
    refreshGuestList(list: {
        username: string;
        id: string;
    }[]): void;
    private bindElementEvents;
    setGuestNumber(data: number): void;
    update(): void;
}
