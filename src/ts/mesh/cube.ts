import gsap from "gsap";
import { ExtrudeGeometry, Group, Mesh, MeshMatcapMaterial, Shape } from "three";
import { Base } from "../class/base";
import { MeshType } from "../interface";

export class Cube implements MeshType {
    mesh: Mesh;
    group: Group;
    ready = false;
    constructor(private base: Base) {
        this.setModel();
    }

    createRoundedBoxGeo(width: number, height: number, depth: number, radius0: number, smoothness: number) {
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
        this.mesh.scale.set(0, 0, 0);
        this.mesh.rotation.set(Math.PI / 3, Math.PI / 3, Math.PI / 3);

        this.group.add(this.mesh);

        this.base.scene.add(this.group);

        this.doAnimation();
    }

    doAnimation() {
        gsap.to(this.mesh.rotation, {
            x: 0,
            y: -Math.PI / 2,
            z: 0,
            duration: 1, // 用Tween的方式刻意的讓傳遞數值的動作產生delay
            paused: true
        }).play()
        gsap.to(this.mesh.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 2, // 用Tween的方式刻意的讓傳遞數值的動作產生delay
            paused: true,
            onComplete: () => {
                this.ready = true;
            }
        }).play()
    }

    update(delta: number) {
        if (!this.base.touched) {
            this.group.rotation.y += delta / 5;
        }
    }
}