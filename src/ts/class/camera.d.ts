import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Base } from './base';
export declare class Camera {
    private base;
    instance: PerspectiveCamera;
    controls: OrbitControls;
    private sizer;
    private canvas;
    private scene;
    constructor(base: Base);
    setInstance(): void;
    setControls(): void;
    resize(): void;
    update(): void;
}
