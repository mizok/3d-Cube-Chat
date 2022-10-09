import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Base } from './base';

export class Camera {
    instance: PerspectiveCamera;
    controls: OrbitControls;
    private sizer = this.base.sizer;
    private canvas = this.base.canvas;
    private scene = this.base.scene;

    constructor(
        private base: Base
    ) {
        this.setInstance()
        this.setControls()
    }

    setInstance() {
        const camera = new PerspectiveCamera(35, this.sizer.width / this.sizer.height, 0.1, 100);
        camera.position.set(0, 0, 5);
        this.instance = camera;
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize() {
        this.instance.aspect = this.sizer.width / this.sizer.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}