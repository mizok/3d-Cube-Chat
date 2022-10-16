import { Env } from "./env";
import { Base } from "./base";
import { Cube } from "../mesh";
import { DomCube } from "./dom-cube";
import { EventEmitter } from "../util";
export declare class Playground extends EventEmitter {
    private base;
    env: Env;
    cube: Cube;
    domCube: DomCube;
    ready: boolean;
    constructor(base: Base);
    init(): void;
    showChat(): void;
    update(delta: number): void;
}
