import { EventEmitter } from './event-emitter';
export declare class Ticker extends EventEmitter {
    private clock;
    constructor();
    tick(): void;
}
