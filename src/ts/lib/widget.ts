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
    init() {
        this.instance.on(SoundcloudWidget.events.PLAY, () => {
            this.trigger('play')
        })
    }
    play() {
        this.instance.play();
    }
    toggle() {
        this.instance.toggle();
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





