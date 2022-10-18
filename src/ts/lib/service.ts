import { SoundCloudService } from './soundcloud-service';
const soundCloudService = new SoundCloudService({ clientId: 'jOJjarVXJfZlI309Up55k93EUDG7ILW6' })

export function doConfirm(template: string) {
    const frame = document.querySelector('#modal-confirm');
    const activeClass = 'modal-prompt--active'

    let cusRes: any;
    const prm = new Promise((res, rej) => {
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
        e.currentTarget.removeEventListener('click', cb);
        cusRes(confirm)
    }

    frame.querySelector('p').innerHTML = template;
    //show frame;
    frame.classList.add(activeClass);
    frame.addEventListener('click', cb);
    return prm;
}

export function doAlert(template: string) {
    const frame = document.querySelector('#modal-alert');
    const activeClass = 'modal-prompt--active'

    const cb = (e: MouseEvent) => {
        e.preventDefault();
        const action = (e.target as HTMLElement).closest('[action]').getAttribute('action');
        if (action === 'close') {
            e.currentTarget.removeEventListener('click', cb);
            frame.classList.remove(activeClass);
        }

    }

    frame.querySelector('p').innerHTML = template;
    //show frame;
    frame.classList.add(activeClass);
    frame.addEventListener('click', cb);
}

export function searchMusic() {
    const frame = document.querySelector('#modal-music-search');
    const activeClass = 'modal-music-search--active';
    let cusRes: any;
    let chosenId: string;
    const prm = new Promise((res, rej) => {
        cusRes = res;
    })
    const cb = async (e: MouseEvent) => {
        e.preventDefault();
        const actionTarget = (e.target as HTMLElement).closest('[action]') || (e.target as HTMLElement);
        const action = actionTarget.getAttribute('action');
        if (action === 'close') {
            e.currentTarget.removeEventListener('click', cb);
            frame.classList.remove(activeClass);
            cusRes(false);
        }
        else if (action === 'search') {
            const container = frame.querySelector('#search-music-result');
            const keyword = (frame.querySelector('#music-search-input') as HTMLInputElement).value;
            const searchResult: any = await soundCloudService.search({
                q: keyword,
                limit: 50
            });
            const embedableTracks = searchResult?.collection.filter((o: any) => {
                return o.embeddable_by === 'all'
            })
            console.log(embedableTracks)


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
        else if (action === 'choose') {
            chosenId = actionTarget.getAttribute('dataId') || '';
            e.currentTarget.removeEventListener('click', cb);
            frame.classList.remove(activeClass);
            cusRes(chosenId);
        }
    }

    frame.classList.add(activeClass);
    frame.addEventListener('click', cb);
    return prm;
}


