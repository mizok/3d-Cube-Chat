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
    touchedReactDelay: number;
    resources: {
        [key: string]: any;
    };
    constructor(canvas: HTMLCanvasElement, domCanvas: HTMLElement, domBundle: HTMLElement);
    initResizeMechanic(): void;
    initTickMechanic(): void;
    initTouchMechanic(): void;
    toggleRotationLock(status: boolean): void;
    getRotationLockStatus(): boolean;
    getResources(): Promise<void>;
}
