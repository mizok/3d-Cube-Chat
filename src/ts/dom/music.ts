import { Matrix4, Object3D, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Base } from "../class/base";
import { FaceType } from "../interface";
import { updateOcclude } from "../util/function";
import { widget } from '../util/widget';
import { Waveform, EVENT_CLICK } from '../util/waveform'
const axios = require('axios');



export class Music implements FaceType {
    object: Object3D
    element: HTMLElement
    private offset = 1.7;
    private pos = new Vector3(this.offset, 0, 0);
    private normal = new Vector3(1, 0, 0);
    private cNormal = new Vector3();
    private cPos = new Vector3();
    private m4 = new Matrix4();
    private timer: any;
    private defaultSource = 'https%3A//api.soundcloud.com/tracks/327386009';
    private playStatus = false;
    private waveformInstance: Waveform;
    constructor(private base: Base) {
        this.setElement();
    }
    setElement() {
        this.element = this.base.domBundle.querySelector('#music-player');
        this.object = new CSS3DObject(this.element);
        this.object.position.set(this.offset, 0, 0);
        this.object.rotation.y = Math.PI / 2;
        this.object.scale.set(1 / 160, 1 / 160, 1);
        this.init();
    }

    private bindPlayerUIEvent() {
        const playButton = this.element.querySelector('#music-player-button') as HTMLElement;
        const banner = this.element.querySelector('#music-player-img img') as HTMLImageElement;
        const title = this.element.querySelector('#music-player-title span');
        const artist = this.element.querySelector('#music-player-artist span');
        const permaLink = this.element.querySelector('#music-player-perma-link') as HTMLAnchorElement;
        const waveform = this.element.querySelector('#music-player-waveform') as HTMLElement;
        const waveformRect = waveform.getBoundingClientRect();
        const contrastFactor = 5;
        const contrastOffset = 128;

        playButton.addEventListener('pointerdown', () => {
            if (!this.playStatus) {
                widget.play()
            }
            else {
                widget.pause()
            }
            this.playStatus = !this.playStatus;
        })

        widget.on('play', () => {
            playButton.classList.add('music-player__btn--pause')
            this.playStatus = true;
        })

        widget.on('pause', () => {
            if (!this.waveformInstance) return;
            playButton.classList.remove('music-player__btn--pause')
            this.playStatus = false;
            this.waveformInstance.pause();
        })

        permaLink.addEventListener('pointerdown', (e) => {
            const href = (e.currentTarget as HTMLAnchorElement).href;
            window.open(href, '_blank');
        })


        widget.on('play-progress', (percent: number) => {
            if (!this.waveformInstance) return;
            this.waveformInstance.playProgress(percent);
        })


        widget.on('load', (soundObject: any) => {
            console.log(soundObject);
            let picUrl = '';
            if (!!soundObject.artwork_url) {
                picUrl = soundObject.artwork_url.replace(/(.*)(-large)(\.[a-z0-9]{3}[a-z0-9]?)$/, '$1-t500x500$3')
            }
            else {
                picUrl = './assets/images/not-found.jpg';
            }
            //image
            banner.src = picUrl
            //title
            title.innerHTML = soundObject?.title
            //artist
            artist.innerHTML = soundObject?.publisher_metadata?.artist || 'Unknown';
            //soundcloud link
            permaLink.href = soundObject?.permalink_url;

            //get waveform data and render waveform diagram
            axios({
                url: soundObject.waveform_url
            })
                .then((res: any) => {
                    waveform.innerHTML = '';
                    // some contrast calculation 
                    const data = res.data.samples.map((val: number) => ((val - contrastOffset) / 100) * contrastFactor + contrastOffset / 100);
                    this.waveformInstance = new Waveform(
                        {
                            container: waveform,
                            data: data,
                            width: waveformRect.width,
                            height: waveformRect.height,
                            trackLength: data.length, // for wonder wizkid
                            reflection: 0.3,
                            waveWidth: 2,
                            interpolate: true,
                            fadeOpacity: 0.888,
                            bindResize: false    // to make the waveform bind to the resize event of the window!!
                        }
                    );
                    this.waveformInstance.on(EVENT_CLICK, (percent: number) => {
                        const porpotion = percent / 100;
                        widget.seek(porpotion * soundObject?.duration);
                        widget.play()
                        this.waveformInstance.playProgress(percent);

                    });
                })
                .catch((err: any) => { throw err });


        })


    }

    private init() {
        this.bindPlayerUIEvent();
        widget.load(this.defaultSource)
    }

    update() {
        updateOcclude(this);
    }
}