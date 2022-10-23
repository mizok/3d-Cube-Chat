export declare class SoundCloudService {
    private config;
    constructor(config: {
        clientId: string;
    });
    search(params: {
        q: string;
        limit?: number;
        client_id?: string;
    }): Promise<unknown>;
}
