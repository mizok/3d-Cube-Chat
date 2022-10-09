interface Source {
    name: string,
    type: string,
    paths?: string[],
    path?: string
}

export const textureSources: Source[] = [
    {
        name: 'someTexture',
        type: 'texture',
        path: 'https://picsum.photos/seed/picsum/200/300'
    }
]

