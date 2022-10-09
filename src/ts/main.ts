import { Clock } from 'three';
import { Base } from './class/base';
class Main extends Base {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }
}

(() => {
    const cvs = document.querySelector('canvas');
    const instance = new Main(cvs);
})()