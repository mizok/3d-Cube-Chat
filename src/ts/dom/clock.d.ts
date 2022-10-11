import { Object3D } from "three";
import { Base } from "../class/base";
import { FaceType } from "../interface";
export declare class Clock implements FaceType {
    private base;
    object: Object3D;
    element: HTMLElement;
    private offset;
    private timer;
    constructor(base: Base);
    setElement(): void;
    updateClock(): void;
    initClock(): void;
    update(): void;
}
