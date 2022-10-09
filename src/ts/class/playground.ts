import { Env } from "./env";
import { Base } from "./base";
import { Clock } from "three";

export class Playground {
    env: Env;
    constructor(private base: Base) {
        this.init();
    }
    init() {
        this.base.getResources().then(() => {
            this.env = new Env(this.base);
        })
    }

    update(clock: Clock) {
        this.env.update(clock);
    }
}