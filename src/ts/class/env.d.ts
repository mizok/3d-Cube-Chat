import { Base } from './base';
import { AmbientLight, DirectionalLight } from 'three';
export declare class Env {
    private base;
    ambientLight: AmbientLight;
    directionalLight: DirectionalLight;
    constructor(base: Base);
    setLights(): void;
    setDirectionalLight(): void;
    setAmbientLight(): void;
    setBackground(): void;
    update(delta: number): void;
}
