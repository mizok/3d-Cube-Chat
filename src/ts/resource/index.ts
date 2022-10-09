import { textureSources } from './textures';
import { TextureLoader, CubeTextureLoader } from 'three';

interface SourceObj {
	name: string,
	content: any
}


const textureLoader = new TextureLoader();
const cubeTextureLoader = new CubeTextureLoader();

const getTexture = (source: any) => {
	const prm: Promise<SourceObj> = new Promise((res, rej) => {
		textureLoader.load(
			source.path,
			(texture) => {
				res({
					name: source.name,
					content: texture
				});
			},
			null,
			rej
		);
	});
	return prm;
};

const getCubeTexture = (source: any) => {
	const prm: Promise<SourceObj> = new Promise((res, rej) => {
		cubeTextureLoader.load(
			source.paths,
			(texture) => {
				res({
					name: source.name,
					content: texture
				});
			},
			null,
			rej
		);
	});
	return prm;
}



export const getResources = () => {

	const promiseArr: Promise<SourceObj>[] = [];

	for (let textureSource of textureSources) {
		switch (textureSource.type) {
			case 'cubeTexture': promiseArr.push(getCubeTexture(textureSource))
			case 'texture': promiseArr.push(getTexture(textureSource))
		}
	}

	return Promise.all(promiseArr).then((values) => {
		const result: {
			[key: string]: any
		} = {};
		values.forEach((sourceObj) => {
			result[sourceObj.name] = sourceObj.content;
		})
		return result;
	})
}


