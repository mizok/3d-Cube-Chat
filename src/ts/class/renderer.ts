import { WebGLRenderer, PCFSoftShadowMap } from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';

import { Base } from './base';

export class Renderer {
    instance: WebGLRenderer;
    instance2: CSS3DRenderer;
    private sizer = this.base.sizer;
    private canvas = this.base.canvas;
    private domCanvas = this.base.domCanvas;
    private scene = this.base.scene;
    private scene2 = this.base.scene2;
    private camera = this.base.camera;
    constructor(
        private base: Base
    ) {
        this.setInstances()
    }

    setInstances() {
        //instance
        this.instance = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.physicallyCorrectLights = true
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = PCFSoftShadowMap
        this.instance.setClearColor(0xffffff)
        //instance2
        this.instance2 = new CSS3DRenderer({
            element: this.domCanvas
        });
        this.sizing();
    }

    resize() {
        this.sizing();
    }

    sizing() {
        //instance
        this.instance.setSize(this.sizer.width, this.sizer.height);
        this.instance.setPixelRatio(this.sizer.pixelRatio);
        //instance2
        this.instance2.setSize(this.sizer.width, this.sizer.height);
    }

    update() {
        this.instance.render(this.scene, this.camera.instance);
        this.instance2.render(this.scene2, this.camera.instance);
    }
}