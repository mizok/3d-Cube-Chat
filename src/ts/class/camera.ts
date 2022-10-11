import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Base } from './base';

export class Camera {
    instance: PerspectiveCamera;
    controls: OrbitControls;
    private sizer = this.base.sizer;
    private canvas = this.base.domCanvas;
    private scene = this.base.scene;

    constructor(
        private base: Base
    ) {
        this.setInstance()
        this.setControls()
    }

    setInstance() {
        const camera = new PerspectiveCamera(35, this.sizer.width / this.sizer.height, 0.1, 100);
        camera.position.set(-7.942670134404548, 1.246140969776503, 5.624623934002567);
        // camera.position.set(0, 0, 10);
        this.instance = camera;
        this.scene.add(this.instance)
        // //@ts-ignore
        // window.cm = camera;

    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true;
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
    }

    resize() {
        this.instance.aspect = this.sizer.width / this.sizer.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}