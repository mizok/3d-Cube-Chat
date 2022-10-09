interface Source {
    name: string,
    type: string,
    paths?: string[],
    path?: string
}

export const textureSources: Source[] = [
    {
        name: 'gradientCubeTexture',
        type: 'cubeTexture',
        paths: [
            './assets/images/cubemap/gs-gradient/px.png',
            './assets/images/cubemap/gs-gradient/nx.png',
            './assets/images/cubemap/gs-gradient/py.png',
            './assets/images/cubemap/gs-gradient/ny.png',
            './assets/images/cubemap/gs-gradient/pz.png',
            './assets/images/cubemap/gs-gradient/nz.png'
        ]
    },
    {
        name: 'cubeMatcap',
        type: 'texture',
        path: './assets/images/matcap/BlackRough.png'
    }
]

