import { Env } from "./env";
import { Base } from "./base";
import { Cube } from "../mesh";
import { DomCube } from "../mesh/dom-cube";
import { EventEmitter } from "../util";
export declare class Playground extends EventEmitter {
    private base;
    env: Env;
    cube: Cube;
    domCube: DomCube;
    ready: boolean;
    private initTimeout;
    private initTimeoutDuration;
    constructor(base: Base);
    private init;
    showChat(): void;
    showMusic(): void;
    update(delta: number): void;
}
