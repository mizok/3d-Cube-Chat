import { EventEmitter } from "../util";
const SoundcloudWidget = require('soundcloud-widget');
const iframeEle = document.querySelector('#soundcloud-iframe') as HTMLIFrameElement;
class SCWidget extends EventEmitter {
    instance: typeof SoundcloudWidget;
    constructor(iframeEle: HTMLIFrameElement) {
        super();
        this.instance = new SoundcloudWidget(iframeEle);
        this.init();
    }
    private init() {
        this.instance.on(SoundcloudWidget.events.PLAY, () => {
            this.trigger('play')
        })
        this.instance.on(SoundcloudWidget.events.PLAY_PROGRESS, (ev: any) => {
            const progressPercent = ev.relativePosition * 100;
            this.trigger('play-progress', [progressPercent])
        })
        this.instance.on(SoundcloudWidget.events.PAUSE, () => {
            this.trigger('pause')
        })
        this.instance.on(SoundcloudWidget.events.SEEK, (ev: any) => {
            this.trigger('seek')
        })
    }
    play() {
        this.instance.play();
    }
    pause() {
        this.instance.pause();
    }
    toggle() {
        this.instance.toggle();
    }
    seek(millisecond: number) {
        this.instance.seekTo(millisecond)
    }
    load(url: string) {
        return this.instance.load(url, { auto_play: true }).then(() => {
            this.instance.getCurrentSound().then((soundObject: any) => {
                this.trigger('load', [soundObject])
            })

        })
    }
}

export const widget = new SCWidget(iframeEle);





