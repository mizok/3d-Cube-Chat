import { Base } from './class/base';
import { io, Socket } from 'socket.io-client';
import { trim } from 'lodash';
class Main extends Base {
    private wrapper: Element = document.querySelector('#wrapper');
    private chatBlock: Element = document.querySelector('#chat-block');
    private chatBlockActive = false;
    private socket: Socket = io('ws://192.168.1.101:5500');
    private myName: string;
    constructor(canvas: HTMLCanvasElement, domCanvas: HTMLElement, domBundle: HTMLElement) {
        super(canvas, domCanvas, domBundle);
        this.initChatUI();
        this.initChatSocket();
    }
    private initChatUI() {
        const toggler = this.chatBlock.querySelector('#chat-block-toggler');
        const rotationLock = this.chatBlock.querySelector('#rotation-lock');
        const loginBtn = this.chatBlock.querySelector('#login-button');
        const sendBtn = this.chatBlock.querySelector('#send-message-button');
        const logoutBtn = this.chatBlock.querySelector('#logout-button');
        toggler.addEventListener('click', () => {
            if (this.chatBlockActive) {
                this.wrapper.classList.remove('wrapper--active');
            }
            else {
                this.wrapper.classList.add('wrapper--active');
            }
            this.chatBlockActive = !this.chatBlockActive;
        })

        rotationLock.addEventListener('click', () => {
            const status = this.getRotationLockStatus();
            if (status) {
                rotationLock.classList.remove('chat-block__rotation-lock--active');
            }
            else {
                rotationLock.classList.add('chat-block__rotation-lock--active');
            }

            this.toggleRotationLock(!status)

        })

        loginBtn.addEventListener('click', () => {
            this.myName = trim((this.chatBlock.querySelector('#login-name') as HTMLInputElement).value);
            if (this.myName) {
                /*發送事件*/
                this.socket.emit('login', { username: this.myName })
            } else {
                alert('Please enter a name :)')
            }
        })

        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        })

        logoutBtn.addEventListener('click', () => {
            let leave = confirm('Are you sure you want to leave?')
            if (leave) {
                /*觸發 logout 事件*/
                this.socket.emit('logout', { username: this.myName });
            }
        })

        document.addEventListener('keydown', (evt: KeyboardEvent) => {
            if (evt.keyCode == 13) {
                this.sendMessage()
            }
        })


    }
    private initChatSocket() {
        /*登入成功*/
        this.socket.on('loginSuccess', (data) => {
            if (data.username === this.myName) {
                this.checkIn(data)
            } else {
                alert('Wrong username:( Please try again!')
            }
        })

        /*登入失敗*/
        this.socket.on('loginFail', () => {
            alert('Duplicate name already exists:0')
        })

        /*加入聊天室提示*/
        this.socket.on('add', (data) => {
            var html = `<p>${data.username} 加入聊天室</p>`
            // $('.chat-con').append(html);
            document.getElementById('chat-title').innerHTML = `在線人數: ${data.userCount}`
        })

        //離開成功
        this.socket.on('leaveSuccess', () => {
            this.checkOut()
        })

        //退出提示
        this.socket.on('leave', (data) => {
            if (data.username != null) {
                let html = `<p>${data.username} 退出聊天室</p>`;
                // $('.chat-con').append(html);
                // document.getElementById('chat-title').innerHTML = `在線人數: ${data.userCount}`;
            }
        })

        //收到訊息
        this.socket.on('receiveMessage', (data) => {

            this.showMessage(data)
        })


    }
    private checkIn(data: any) {
        const loginWrapper = this.chatBlock.querySelector('#login');
        const userNameEle = this.chatBlock.querySelector('#my-name');
        userNameEle.innerHTML = data.username;
        loginWrapper.classList.add('login--logined');
    }

    private checkOut() {
        const loginWrapper = this.chatBlock.querySelector('#login');
        loginWrapper.classList.remove('login--logined');
    }

    private sendMessage() {
        const inputEle = this.chatBlock.querySelector('#message-input');
        const message = (inputEle as HTMLInputElement).value;
        (inputEle as HTMLInputElement).value = ''
        if (message) {
            /*觸發 sendMessage 事件*/
            this.socket.emit('sendMessage', { username: this.myName, message: message });
        }
    }

    private showMessage(data: any) {
        let html;
        if (data.username === this.myName) {
            html = `<div class="chat-main__chat ">
                        <div class="chat-main__bubble-name">You</div>
                        <div class="chat-main__bubble">${data.message}</div>
                    </div>
                    `;
        } else {
            html = `<div class="chat-main__chat chat-main__chat--other">
                        <div class="chat-main__bubble-name">${data.username}</div>
                        <div class="chat-main__bubble">${data.message}</div>
                    </div>
                    `;
        }
        const ele = this.createElementFromHTML(html)
        this.chatBlock.querySelector('#chat-main').appendChild(ele);
        this.wrapper.querySelector('#chat-main-cube').appendChild(ele.cloneNode(true));
    }

    private createElementFromHTML(htmlString: string) {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes.
        return div.firstChild;
    }

}


(() => {
    const cvs = document.querySelector('#canvas');
    const dcvs = document.querySelector('#dom-canvas');
    const domBundle = document.querySelector('#dom-bundle');
    const instance = new Main(cvs as HTMLCanvasElement, dcvs as HTMLElement, domBundle as HTMLElement);
})()