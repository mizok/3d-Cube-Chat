interface Name {
    original: string;
    value: string;
    namespace: string;
}
export declare class EventEmitter {
    callbacks: any;
    constructor();
    on(_names: string, callback: Function): false | this;
    off(_names: string): false | this;
    trigger(_name: string, _args?: any[]): any;
    resolveNames(_names: string): string[];
    resolveName(name: string): Name;
}
export {};
