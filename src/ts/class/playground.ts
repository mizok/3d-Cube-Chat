import { Env } from "./env";
import { Base } from "./base";
import { Clock } from "three";
import { Cube } from "../mesh";
import { DomCube } from "./dom-cube";
import { EventEmitter } from "../util";

export class Playground extends EventEmitter {
    env: Env;
    cube: Cube;
    domCube: DomCube;
    ready = false;
    constructor(private base: Base) {
        super();
        this.init();
    }
    init() {
        this.base.getResources().then(() => {
            this.env = new Env(this.base);
            this.cube = new Cube(this.base);
            this.domCube = new DomCube(this.base);
            this.ready = true;
            this.trigger('ready');
        })
    }

    update(delta: number) {
        if (this.ready) {
            this.env.update(delta);
            this.cube.update(delta);
            this.domCube.update(delta);
        }

    }
}