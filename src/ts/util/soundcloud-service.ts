const axios = require('axios');

export class SoundCloudService {
    private config: { clientId: string }
    constructor(config: { clientId: string }) {
        this.config = config;
    }

    search(params: { q: string, limit?: number, client_id?: string }) {
        return new Promise((resolve, reject) => {
            const type = '/search';
            const cors = `https://cors-proxy-server.onrender.com/`;
            params.client_id = params.client_id ? params.client_id : this.config.clientId;
            const urlParameters = Object.entries(params)
                .map((e) => e.join("="))
                .join("&");

            const url = `${cors}https://api-v2.soundcloud.com${type}?${urlParameters}`;

            axios({
                url: url
            })
                .then((res: any) => resolve(res.data))
                .catch((err: any) => reject(err));
        });
    }
}