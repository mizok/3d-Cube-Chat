import { Object3D } from "three";
import { Base } from "../class/base";
import { FaceType } from "../interface";
export declare class Music implements FaceType {
    private base;
    object: Object3D;
    element: HTMLElement;
    private offset;
    private pos;
    private normal;
    private cNormal;
    private cPos;
    private m4;
    private timer;
    private defaultSource;
    private playStatus;
    private waveformInstance;
    constructor(base: Base);
    setElement(): void;
    private bindPlayerUIEvent;
    private init;
    update(): void;
}
