import { widget } from '../util/widget'
import { SoundCloudService } from './soundcloud-service';
const isMobile = require('is-mobile')
const soundCloudService = new SoundCloudService({ clientId: 'jOJjarVXJfZlI309Up55k93EUDG7ILW6' })

export const pointerEvent = isMobile() ? 'touchstart' : 'click';

export function doConfirm(template: string) {
    const frame = document.querySelector('#modal-confirm');
    const activeClass = 'modal-prompt--active'

    let cusRes: any;
    const prm = new Promise((res) => {
        cusRes = res;
    })
    let confirm = false;
    const cb = (e: MouseEvent) => {
        e.preventDefault();
        switch ((e.target as HTMLElement).closest('[action]').getAttribute('action')) {
            case 'yes':
                confirm = true;
                frame.classList.remove(activeClass);
                break;
            case 'no':
                confirm = false;
                frame.classList.remove(activeClass);
                break;
            case 'close':
                frame.classList.remove(activeClass);
                break;
        }
        e.currentTarget.removeEventListener(pointerEvent, cb);
        cusRes(confirm)
    }

    frame.querySelector('p').innerHTML = template;
    //show frame;
    frame.classList.add(activeClass);
    frame.addEventListener(pointerEvent, cb);
    return prm;
}

export function doAlert(template: string) {
    const frame = document.querySelector('#modal-alert');
    const activeClass = 'modal-prompt--active'

    const cb = (e: MouseEvent) => {
        e.preventDefault();
        const action = (e.target as HTMLElement).closest('[action]').getAttribute('action');
        if (action === 'close') {
            e.currentTarget.removeEventListener(pointerEvent, cb);
            frame.classList.remove(activeClass);
        }

    }

    frame.querySelector('p').innerHTML = template;
    //show frame;
    frame.classList.add(activeClass);
    frame.addEventListener(pointerEvent, cb);
}

async function renderSearchView(frame: Element, keywordInput: HTMLInputElement) {
    if (!soundCloudService) return;
    const container = frame.querySelector('#search-music-result');
    const keyword = keywordInput.value;
    if (!keyword) return;
    container.innerHTML = `
        <li class="modal-music-search__li modal-music-search__li--loading">
           <img src="./assets/images/ripple.svg">
        </li>
        `
    const searchResult: any = await soundCloudService.search({
        q: keyword,
        limit: 100
    }).then((searchResult) => {
        widget.trigger('search', [searchResult])
        return searchResult;
    });

    const embedableTracks = searchResult?.collection.filter((o: any) => {
        return o.embeddable_by === 'all' && !!o.title
    })
    const htmlBundle = embedableTracks.map((o: any, index: number) => {
        return `
            <li class="modal-music-search__li music-search-item" style="animation-delay:${100 * index}ms">
                <div class="music-search-item__inner">
                    <div class="music-search-item__head">
                        <div class="music-search-item__img">
                            <img src="${o.artwork_url}" onerror="this.parentNode.classList.add('music-search-item__img--not-found')" >
                        </div>
                    </div>
                    <div class="music-search-item__body">
                        <div class="music-search-item__title">
                            <span>${o.title}</span>
                        </div>
                        <div class="music-search-item__descrp">
                            <div class="music-search-item__artist">
                            ${o.publisher_metadata?.artist || 'Unknown'}
                            </div>
                            <div class="music-search-item__album-title">${o.publisher_metadata?.album_title || ''}</div>
                        </div>
                    </div>
                    <button class="music-search-item__play" action="choose" data-id="${o.id}">
                    </button>
                </div>
            </li>
            `
    }).join('');
    container.scrollTop = 0;
    container.innerHTML = htmlBundle;
}

export function searchMusic(): Promise<false | string> {
    const frame = document.querySelector('#modal-music-search');
    const activeClass = 'modal-music-search--active';
    const keywordInput = frame.querySelector('#music-search-input') as HTMLInputElement;
    let cusRes: (value: (false | string)) => void;
    let chosenId: string;
    const prm = new Promise((res: (value: (false | string)) => void, rej) => {
        cusRes = res;
    })

    const keydownCallback = (evt: KeyboardEvent) => {
        if (evt.keyCode == 13) {
            if (keywordInput.value && document.activeElement === keywordInput) {
                renderSearchView(frame, keywordInput);
            }
        }
    }

    const cb = async (e: MouseEvent) => {
        e.preventDefault();
        const actionTarget = (e.target as HTMLElement).closest('[action]') || (e.target as HTMLElement);
        const action = actionTarget.getAttribute('action');
        if (action === 'close') {
            e.currentTarget.removeEventListener(pointerEvent, cb);
            document.removeEventListener('keydown', keydownCallback);
            frame.classList.remove(activeClass);
            cusRes(false);
        }
        else if (action === 'search') {
            renderSearchView(frame, keywordInput);
        }
        else if (action === 'choose') {
            chosenId = actionTarget.getAttribute('data-id') || '';
            e.currentTarget.removeEventListener(pointerEvent, cb);
            document.removeEventListener('keydown', keydownCallback);
            frame.classList.remove(activeClass);
            cusRes(chosenId);
        }

    }

    frame.classList.add(activeClass);
    frame.addEventListener(pointerEvent, cb);
    document.addEventListener('keydown', keydownCallback);
    return prm;
}

export function playViaIframe(trackId: string) {
    const source = `https%3A//api.soundcloud.com/tracks/${trackId}`
    return widget.load(source).then(
        () => {
            widget.play();
        }
    )
}



