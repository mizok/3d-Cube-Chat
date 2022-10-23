import { Base } from './base';
import { AmbientLight, Clock, CubeTextureLoader, DirectionalLight } from 'three';

export class Env {
    ambientLight: AmbientLight;
    directionalLight: DirectionalLight;
    constructor(private base: Base) {
        this.setLights();
    }

    private setLights() {
        this.setAmbientLight();
        this.setDirectionalLight();
        this.setBackground();
    }

    private setDirectionalLight() {
        this.directionalLight = new DirectionalLight(0xffffff, 1);
        this.directionalLight.castShadow = true
        this.directionalLight.shadow.mapSize.set(2048, 2048)
        this.directionalLight.shadow.normalBias = 0.05
        this.directionalLight.position.set(3.5, 2, - 1.25)
        this.base.scene.add(this.directionalLight)
    }

    private setAmbientLight() {
        this.ambientLight = new AmbientLight(0xffffff, 1);
        this.base.scene.add(this.ambientLight)
    }

    private setBackground() {
        this.base.scene.background = this.base.resources.gradientCubeTexture

    }


    update(delta: number) {

    }

}