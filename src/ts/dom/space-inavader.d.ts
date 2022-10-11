import { Object3D } from "three";
import { Base } from "../class/base";
import { FaceType } from "../interface";
export declare class SpaceInvader implements FaceType {
    private base;
    object: Object3D;
    element: HTMLElement;
    private offset;
    constructor(base: Base);
    setElement(): void;
    update(): void;
}
