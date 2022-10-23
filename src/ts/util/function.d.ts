export declare function updateOcclude(faceType: any): void;
export declare function pad(n: number, l: number): string;
export declare const cubeLikeConfig: {
    initialScale: readonly [0, 0, 0];
    initialRotation: readonly [number, number, number];
    startAnimationInnerRotationConfig: {
        x: number;
        y: number;
        z: number;
        duration: number;
    };
    startAnimationInnerScalingConfig: {
        x: number;
        y: number;
        z: number;
        duration: number;
    };
    showChatAnimationInnerRotationConfig: {
        x: number;
        y: number;
        z: number;
        duration: number;
    };
    showMusicAnimationInnerRotationConfig: {
        x: number;
        y: number;
        z: number;
        duration: number;
    };
    showChatAnimationOuterRotationConfig: {
        x: number;
        y: number;
        z: number;
        duration: number;
    };
    updateParameter: number;
};
export declare function createElementFromHTML(htmlString: string): ChildNode;
export declare function getTargetAngle(angle: number): number;
