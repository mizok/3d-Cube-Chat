import { WebGLRenderer } from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { Base } from './base';
export declare class Renderer {
    private base;
    instance: WebGLRenderer;
    instance2: CSS3DRenderer;
    private sizer;
    private canvas;
    private domCanvas;
    private scene;
    private scene2;
    private camera;
    constructor(base: Base);
    private setInstances;
    resize(): void;
    private sizing;
    update(): void;
}
