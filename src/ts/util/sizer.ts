import { EventEmitter } from './event-emitter'

export class Sizer extends EventEmitter {
    width: number;
    height: number;
    pixelRatio = Math.min(window.devicePixelRatio, 2);

    constructor(public canvas: HTMLCanvasElement) {
        super()
        this.initSizingMechanic();
    }

    initSizingMechanic() {
        this.sizing();
        window.addEventListener('resize', this.sizing.bind(this))
    }
    sizing() {
        const rect = this.canvas.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height
        this.trigger('resize', [this.width, this.height])
    }
}
