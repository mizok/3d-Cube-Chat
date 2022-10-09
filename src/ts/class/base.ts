import { Env } from './env';
import { Renderer } from './renderer';
import { Camera } from './camera';
import { Ticker, Sizer } from '../util';
import { Scene, Clock } from 'three';
import { getResources } from '../resource';
import { Playground } from './playground';

export class Base {
    sizer = new Sizer(this.canvas)
    scene = new Scene();
    ticker = new Ticker();
    camera = new Camera(this);
    renderer = new Renderer(this);
    playground = new Playground(this);
    resources: {
        [key: string]: any
    }

    constructor(public canvas: HTMLCanvasElement) {
        this.initResizeMechanic();
        this.initTickMechanic();
    }

    initResizeMechanic() {
        this.sizer.on('resize', () => {
            this.renderer.resize();
            this.camera.resize();
        })
    }

    initTickMechanic() {
        this.ticker.on('tick', (clock: Clock) => {
            this.renderer.update();
            this.camera.update();
            this.playground.update(clock);
        })
    }

    async getResources() {
        this.resources = await getResources()
    }
}