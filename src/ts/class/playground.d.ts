import { Env } from "./env";
import { Base } from "./base";
import { Cube } from "../mesh";
import { DomCube } from "./dom-cube";
export declare class Playground {
    private base;
    env: Env;
    cube: Cube;
    domCube: DomCube;
    ready: boolean;
    constructor(base: Base);
    init(): void;
    update(delta: number): void;
}
