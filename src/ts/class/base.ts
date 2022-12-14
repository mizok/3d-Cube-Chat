import { Renderer } from './renderer';
import { Camera } from './camera';
import { Ticker, Sizer } from '../util';
import { Scene, Clock, Vector2 } from 'three';
import { getResources } from '../resource';
import { Playground } from './playground';

let rotationLocked: boolean = false;
let loginStatus: boolean = false;

export class Base {
    sizer = new Sizer(this.canvas)
    scene = new Scene();
    scene2 = new Scene();
    ticker = new Ticker();
    camera = new Camera(this);
    renderer = new Renderer(this);
    playground = new Playground(this);
    touched = false;
    resources: {
        [key: string]: any
    }
    private touchedReactDelay = 2000;


    constructor(public canvas: HTMLCanvasElement, public domCanvas: HTMLElement, public domBundle: HTMLElement) {
        this.initResizeMechanic();
        this.initTickMechanic();
        this.initTouchMechanic();
    }

    private initResizeMechanic() {
        this.sizer.on('resize', () => {
            this.renderer.resize();
            this.camera.resize();
        })
    }

    private initTickMechanic() {
        this.ticker.on('tick', (clock: Clock) => {
            const delta = clock.getDelta();
            this.renderer.update();
            this.camera.update();
            this.playground.update(delta);
        })
    }


    private initTouchMechanic() {
        let startLocation = new Vector2();
        let endLocation = new Vector2();
        let timeout: any;
        const cbStart = (e: MouseEvent) => {
            startLocation.x = e.clientX;
            startLocation.y = e.clientY;
            this.touched = true;
        }
        const cbEnd = (e: MouseEvent) => {
            endLocation.x = e.clientX;
            endLocation.y = e.clientY;
            const delay = startLocation.distanceTo(endLocation) > 5 ? this.touchedReactDelay : 0;
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                this.touched = false;
            }, delay)
        }
        this.domCanvas.addEventListener('mousedown', cbStart)
        this.domCanvas.addEventListener('touchstart', cbStart)
        this.domCanvas.addEventListener('mouseup', cbEnd)
        this.domCanvas.addEventListener('touchend', cbEnd)
        this.domCanvas.addEventListener('mouseleave', cbEnd)
    }

    setRotationLock(status: boolean) {
        rotationLocked = status;
    }


    getRotationLockStatus() {
        return rotationLocked;
    }

    setLoginStatus(status: boolean) {
        loginStatus = status;
    }

    getLoginStatus() {
        return loginStatus;
    }

    async getResources() {
        this.resources = await getResources()
    }
}