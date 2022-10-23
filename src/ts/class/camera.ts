import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Base } from './base';

export class Camera {
    instance: PerspectiveCamera;
    controls: OrbitControls;
    bestPoint = new Vector3(-8, 1, 8);
    minimunDrawbackAngle = Math.PI / 3;
    private sizer = this.base.sizer;
    private canvas = this.base.domCanvas;
    private scene = this.base.scene;

    constructor(
        private base: Base
    ) {
        this.setInstance()
        this.setControls()
    }

    private setInstance() {
        const camera = new PerspectiveCamera(35, this.sizer.width / this.sizer.height, 0.1, 100);
        camera.position.set(this.bestPoint.x, this.bestPoint.y, this.bestPoint.z);
        this.instance = camera;
        this.scene.add(this.instance)
        // //@ts-ignore
        // window.cm = camera;

    }

    private setControls() {
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