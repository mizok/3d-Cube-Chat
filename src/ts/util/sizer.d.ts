import { EventEmitter } from './event-emitter';
export declare class Sizer extends EventEmitter {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    pixelRatio: number;
    constructor(canvas: HTMLCanvasElement);
    private initSizingMechanic;
    sizing(): void;
}