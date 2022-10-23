import gsap from "gsap";
import { ExtrudeGeometry, Group, Mesh, MeshMatcapMaterial, Shape } from "three";
import { Base } from "../class/base";
import { cubeLikeConfig, getTargetAngle } from "../util/function";
import { MeshType } from "../interface";

export class Cube implements MeshType {
    mesh: Mesh;
    group: Group;
    constructor(private base: Base) {
        this.setModel();
    }

    private createRoundedBoxGeo(width: number, height: number, depth: number, radius0: number, smoothness: number) {
        let shape = new Shape();
        let eps = 0.00001;
        let radius = radius0 - eps;
        let faceRadius = 0.25;
        shape.absarc(eps, eps, faceRadius, -Math.PI / 2, -Math.PI, true);
        shape.absarc(eps, height - radius * 2, faceRadius, Math.PI, Math.PI / 2, true);
        shape.absarc(width - radius * 2, height - radius * 2, faceRadius, Math.PI / 2, 0, true);
        shape.absarc(width - radius * 2, eps, faceRadius, 0, -Math.PI / 2, true);
        let geometry = new ExtrudeGeometry(shape, {
            depth: depth - radius0,
            bevelEnabled: true,
            bevelSegments: smoothness * 2,
            steps: 1,
            bevelSize: radius,
            bevelThickness: radius0,
            curveSegments: smoothness
        });

        geometry.center();

        return geometry;
    }

    setModel() {
        const geo = this.createRoundedBoxGeo(3, 3, 3, 0.4, 20);
        const mat = new MeshMatcapMaterial({
            matcap: this.base.resources.cubeMatcap
        })
        this.group = new Group();

        this.mesh = new Mesh(geo, mat);
        this.mesh.scale.set(...cubeLikeConfig.initialScale);
        this.mesh.rotation.set(...cubeLikeConfig.initialRotation);

        this.group.add(this.mesh);

        this.base.scene.add(this.group);

        this.doAnimation();
    }

    private doAnimation() {
        gsap.to(this.mesh.rotation, cubeLikeConfig.startAnimationInnerRotationConfig)
        gsap.to(this.mesh.scale, cubeLikeConfig.startAnimationInnerScalingConfig)
    }

    showChat() {
        gsap.to(this.base.camera.instance.position, {
            x: this.base.camera.bestPoint.x,
            y: this.base.camera.bestPoint.y,
            z: this.base.camera.bestPoint.z,
            duration: 4,
            onStart: () => {
                this.base.camera.controls.enabled = false;
                this.base.camera.controls.enableDamping = false;
            },
            onComplete: () => {
                this.base.camera.controls.enabled = true;
                this.base.camera.controls.enableDamping = true;
            }
        })
        gsap.to(this.mesh.rotation, cubeLikeConfig.showChatAnimationInnerRotationConfig)
        const angle = getTargetAngle(this.group.rotation.y)
        gsap.to(this.group.rotation, {
            x: 0,
            y: angle,
            z: 0,
            duration: 2
        })



    }

    showMusic() {
        gsap.to(this.base.camera.instance.position, {
            x: this.base.camera.bestPoint.x,
            y: this.base.camera.bestPoint.y,
            z: this.base.camera.bestPoint.z,
            duration: 4,
            onStart: () => {
                this.base.camera.controls.enabled = false;
                this.base.camera.controls.enableDamping = false;
            },
            onComplete: () => {
                this.base.camera.controls.enabled = true;
                this.base.camera.controls.enableDamping = true;
            }
        })
        gsap.to(this.mesh.rotation, cubeLikeConfig.showMusicAnimationInnerRotationConfig)
        const angle = getTargetAngle(this.group.rotation.y)
        gsap.to(this.group.rotation, {
            x: 0,
            y: angle - Math.PI / 4,
            z: 0,
            duration: 2
        })

    }

    update(delta: number) {
        if (!this.base.touched && !this.base.getRotationLockStatus()) {
            this.group.rotation.y += delta / cubeLikeConfig.updateParameter;
        }
    }
}