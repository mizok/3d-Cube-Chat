import { WebGLRenderer, PCFSoftShadowMap } from 'three';
import { Base } from './base';

export class Renderer {
    instance: WebGLRenderer;
    private sizer = this.base.sizer;
    private canvas = this.base.canvas;
    private scene = this.base.scene;
    private camera = this.base.camera;
    constructor(
        private base: Base
    ) {
        this.setInstance()
    }

    setInstance() {
        this.instance = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.physicallyCorrectLights = true
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = PCFSoftShadowMap
        this.instance.setClearColor(0xffffff)
        this.resize();
    }

    resize() {
        this.instance.setSize(this.sizer.width, this.sizer.height);
        this.instance.setPixelRatio(this.sizer.pixelRatio);
    }

    update() {
        this.instance.render(this.scene, this.camera.instance)
    }
}