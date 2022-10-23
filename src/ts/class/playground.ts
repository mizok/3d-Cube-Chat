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
    private initTimeout: any;
    private initTimeoutDuration = 1000;
    constructor(private base: Base) {
        super();
        this.init();
    }
    private init() {
        this.base.getResources().then(() => {
            this.env = new Env(this.base);
            this.trigger('env-ready');
            clearTimeout(this.initTimeout)
            this.initTimeout = setTimeout(() => {
                this.cube = new Cube(this.base);
                this.domCube = new DomCube(this.base);
                this.ready = true;
                this.trigger('ready');
            }, this.initTimeoutDuration)
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

    showMusic() {
        this.cube.showMusic()
        this.domCube.showMusic()
    }

    update(delta: number) {
        if (this.ready) {
            this.env.update(delta);
            this.cube.update(delta);
            this.domCube.update(delta);
        }

    }
}