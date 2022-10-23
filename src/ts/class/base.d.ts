import { Renderer } from './renderer';
import { Camera } from './camera';
import { Ticker, Sizer } from '../util';
import { Scene } from 'three';
import { Playground } from './playground';
export declare class Base {
    canvas: HTMLCanvasElement;
    domCanvas: HTMLElement;
    domBundle: HTMLElement;
    sizer: Sizer;
    scene: Scene;
    scene2: Scene;
    ticker: Ticker;
    camera: Camera;
    renderer: Renderer;
    playground: Playground;
    touched: boolean;
    resources: {
        [key: string]: any;
    };
    private touchedReactDelay;
    constructor(canvas: HTMLCanvasElement, domCanvas: HTMLElement, domBundle: HTMLElement);
    private initResizeMechanic;
    private initTickMechanic;
    private initTouchMechanic;
    setRotationLock(status: boolean): void;
    getRotationLockStatus(): boolean;
    setLoginStatus(status: boolean): void;
    getLoginStatus(): boolean;
    getResources(): Promise<void>;
}
