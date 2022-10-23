import { Group, Mesh } from "three";
import { Base } from "../class/base";
import { MeshType } from "../interface";
export declare class Cube implements MeshType {
    private base;
    mesh: Mesh;
    group: Group;
    constructor(base: Base);
    private createRoundedBoxGeo;
    setModel(): void;
    private doAnimation;
    showChat(): void;
    showMusic(): void;
    update(delta: number): void;
}
