import { ExtrudeGeometry, Group, Mesh } from "three";
import { Base } from "../class/base";
import { MeshType } from "../interface";
export declare class Cube implements MeshType {
    private base;
    mesh: Mesh;
    group: Group;
    ready: boolean;
    constructor(base: Base);
    createRoundedBoxGeo(width: number, height: number, depth: number, radius0: number, smoothness: number): ExtrudeGeometry;
    setModel(): void;
    doAnimation(): void;
    update(delta: number): void;
}
