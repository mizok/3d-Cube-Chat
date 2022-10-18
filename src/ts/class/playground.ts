import { Env } from "./env";
import { Base } from "./base";
import { Cube } from "../mesh";
import { DomCube } from "../mesh/dom-cube";
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

    showChat() {
        this.cube.showChat()
        this.domCube.showChat()
        if (this.base.getLoginStatus()) {
            this.domCube.chat.showScreen('guestList');
        }
        else {
            this.domCube.chat.showScreen('loginGuide');
        }
    }

    update(delta: number) {
        if (this.ready) {
            this.env.update(delta);
            this.cube.update(delta);
            this.domCube.update(delta);
        }

    }
}