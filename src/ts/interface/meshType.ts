import { Clock } from "three";

export interface MeshType {
    setModel: () => void,
    update: (clock: Clock) => void,
}