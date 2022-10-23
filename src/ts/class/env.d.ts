import { Base } from './base';
import { AmbientLight, DirectionalLight } from 'three';
export declare class Env {
    private base;
    ambientLight: AmbientLight;
    directionalLight: DirectionalLight;
    constructor(base: Base);
    private setLights;
    private setDirectionalLight;
    private setAmbientLight;
    private setBackground;
    update(delta: number): void;
}
