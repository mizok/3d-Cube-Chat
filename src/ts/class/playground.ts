import { Env } from "./env";
import { Base } from "./base";
import { Clock } from "three";
import { Cube } from "../mesh";
import { DomCube } from "./dom-cube";

export class Playground {
    env: Env;
    cube: Cube;
    domCube: DomCube;
    ready = false;
    constructor(private base: Base) {
        this.init();
    }
    init() {
        this.base.getResources().then(() => {
            this.env = new Env(this.base);
            this.cube = new Cube(this.base);
            this.domCube = new DomCube(this.base);
            this.ready = true;
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