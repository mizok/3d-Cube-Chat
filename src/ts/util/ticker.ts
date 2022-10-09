import { EventEmitter } from './event-emitter'
import { Clock } from 'three';

export class Ticker extends EventEmitter {
    private clock: Clock = new Clock();
    constructor() {
        super()
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {
        this.trigger('tick', [this.clock])

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}