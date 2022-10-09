import { Env } from "./env";
import { Base } from "./base";
import { Clock } from "three";
import { Cube } from "../mesh";

export class Playground {
    env: Env;
    cube: Cube;
    ready = false;
    constructor(private base: Base) {
        this.init();
    }
    init() {
        this.base.getResources().then(() => {
            this.env = new Env(this.base);
            this.cube = new Cube(this.base);
            this.ready = true;
        })
    }

    update(clock: Clock) {
        if (this.ready) {
            this.env.update(clock);
            this.cube.update(clock);
        }

    }
}