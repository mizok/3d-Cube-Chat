import { EventEmitter } from "../util";
declare const SoundcloudWidget: any;
declare class SCWidget extends EventEmitter {
    instance: typeof SoundcloudWidget;
    constructor(iframeEle: HTMLIFrameElement);
    init(): void;
    play(): void;
    pause(): void;
    toggle(): void;
    seek(millisecond: number): void;
    load(url: string): any;
}
export declare const widget: SCWidget;
export {};
