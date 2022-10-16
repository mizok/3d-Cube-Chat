export function doConfirm(template: string) {
    const frame = document.querySelector('#modal-confirm');
    let cusRes: any;
    const prm = new Promise((res, rej) => {
        cusRes = res;
    })
    let confirm = false;
    const cb = (e: MouseEvent) => {
        e.preventDefault();
        switch ((e.target as HTMLElement).getAttribute('option')) {
            case 'yes':
                confirm = true;
                frame.classList.remove('modal--active');
                break;
            case 'no':
                confirm = false;
                frame.classList.remove('modal--active');
                break;
            case 'close':
                frame.classList.remove('modal--active');
                break;
        }
        e.currentTarget.removeEventListener('click', cb);
        cusRes(confirm)
    }

    frame.querySelector('p').innerHTML = template;
    //show frame;
    frame.classList.add('modal--active');
    frame.addEventListener('click', cb);
    return prm;
}

export function doAlert(template: string) {
    const frame = document.querySelector('#modal-alert');

    const cb = (e: MouseEvent) => {
        e.preventDefault();
        const option = (e.target as HTMLElement).getAttribute('option');
        if (option === 'close') {
            e.currentTarget.removeEventListener('click', cb);
            frame.classList.remove('modal--active');
        }

    }

    frame.querySelector('p').innerHTML = template;
    //show frame;
    frame.classList.add('modal--active');
    frame.addEventListener('click', cb);
}