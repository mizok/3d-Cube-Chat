import { Base } from './base';
import { AmbientLight, Clock, CubeTextureLoader, DirectionalLight } from 'three';

export class Env {
    ambientLight: AmbientLight;
    directionalLight: DirectionalLight;
    constructor(private base: Base) {
        this.setLights();
    }

    setLights() {
        this.setAmbientLight();
        this.setDirectionalLight();
        this.setBackground();
    }

    setDirectionalLight() {
        this.directionalLight = new DirectionalLight(0xffffff, 1);
        this.directionalLight.castShadow = true
        this.directionalLight.shadow.mapSize.set(2048, 2048)
        this.directionalLight.shadow.normalBias = 0.05
        this.directionalLight.position.set(3.5, 2, - 1.25)
        this.base.scene.add(this.directionalLight)
    }

    setAmbientLight() {
        this.ambientLight = new AmbientLight(0xffffff, 1);
        this.base.scene.add(this.ambientLight)
    }

    setBackground() {
        this.base.scene.background = this.base.resources.gradientCubeTexture

    }


    update(clock: Clock) {

    }

}