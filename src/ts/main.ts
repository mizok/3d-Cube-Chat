import { Base } from './class/base';
import { io, Socket } from 'socket.io-client';
import { trim } from 'lodash';
import { ShowScreenTargets } from './interface';
import { createElementFromHTML } from './lib/function';
import { doAlert, doConfirm } from './lib/service';
class Main extends Base {
    private wrapper: Element = document.querySelector('#wrapper');
    private chatBlock: Element = document.querySelector('#chat-block');
    private rotationLock: Element = this.chatBlock.querySelector('#rotation-lock');
    private chatBlockActive = false;
    private socket: Socket;
    private myName: string;
    private path = 'https://3d-cube-chat.fly.dev';
    // private path = 'http://192.168.1.101:5500';
    constructor(canvas: HTMLCanvasElement, domCanvas: HTMLElement, domBundle: HTMLElement) {
        super(canvas, domCanvas, domBundle);
        this.initChatUI();
    }

    toggleRotationLockFromUI(): void {
        const status = this.getRotationLockStatus();
        if (status) {
            this.rotationLock.classList.remove('chat-block__rotation-lock--active');
        }
        else {
            this.rotationLock.classList.add('chat-block__rotation-lock--active');
        }

        this.setRotationLock(!status)
    }
    setRotationLockFromUI(status: boolean): void {
        if (status) {
            this.rotationLock.classList.add('chat-block__rotation-lock--active');
        }
        else {
            this.rotationLock.classList.remove('chat-block__rotation-lock--active');
        }

        this.setRotationLock(status)
    }

    private initChatUI() {
        const toggler = this.chatBlock.querySelector('#chat-block-toggler');
        const loginBtn = this.chatBlock.querySelector('#login-button');
        const sendBtn = this.chatBlock.querySelector('#send-message-button');
        const logoutBtn = this.chatBlock.querySelector('#logout-button');
        const panelToggle = () => {
            let showTarget: ShowScreenTargets
            if (this.chatBlockActive) {
                //準備關閉側選單
                this.wrapper.classList.remove('wrapper--active');
                showTarget = this.getLoginStatus() ? 'chatMainInner' : 'loginGuide';
                this.setRotationLockFromUI(false);
            }
            else {
                //準備開啟側選單
                this.wrapper.classList.add('wrapper--active');
                showTarget = this.getLoginStatus() ? 'guestList' : 'loginGuide';
                this.setRotationLockFromUI(true);
                this.playground.showChat();
            }
            this.playground.domCube.chat.showScreen(showTarget)
            this.chatBlockActive = !this.chatBlockActive;
        }
        const panelSet = (status: boolean) => {
            let showTarget: ShowScreenTargets
            if (status == true) {
                //準備開啟側選單
                this.wrapper.classList.add('wrapper--active');
                showTarget = this.getLoginStatus() ? 'guestList' : 'loginGuide';
                if (this.getLoginStatus()) {
                    this.setRotationLockFromUI(true);
                }
                this.playground.showChat();
            }
            else {
                //準備關閉側選單
                this.wrapper.classList.remove('wrapper--active');
                showTarget = this.getLoginStatus() ? 'chatMainInner' : 'loginGuide';
                this.setRotationLockFromUI(false);
            }
            this.playground.domCube.chat.showScreen(showTarget)
            this.chatBlockActive = status;

        }

        toggler.addEventListener('click', panelToggle)

        this.playground.on('ready', () => {
            this.playground.domCube.chat.showScreen('loginGuide');
            this.playground.domCube.chat.on('cube-login-button-click', () => {
                this.setRotationLockFromUI(true);
                panelSet(true);
            })
        })


        this.rotationLock.addEventListener('click', this.toggleRotationLockFromUI.bind(this))

        loginBtn.addEventListener('click', () => {
            this.myName = trim((this.chatBlock.querySelector('#login-name') as HTMLInputElement).value);
            if (this.myName) {
                /*發送事件*/
                this.socket = io(this.path);
                this.initChatSocket();
                this.socket.emit('login', { username: this.myName })
            } else {
                doAlert('Please enter a name :)')
            }
        })

        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        })

        logoutBtn.addEventListener('click', async () => {
            let leave = await doConfirm('Are you sure you want to leave the chat?')
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
                doAlert('Wrong username:( Please try again!')
            }
        })

        /*登入失敗*/
        this.socket.on('loginFail', () => {
            doAlert('Duplicate name already exists :(')
        })

        /*加入聊天室提示*/
        this.socket.on('add', (data) => {
            var html = `<p>${data.username} 加入聊天室</p>`
            // $('.chat-con').append(html);
            this.playground.domCube.chat.setGuestNumber(data.userCount);
            this.playground.domCube.chat.refreshGuestList(data?.users);
        })

        //離開成功
        this.socket.on('leaveSuccess', () => {
            this.checkOut()
        })

        //退出提示
        this.socket.on('leave', (data) => {
            if (data.username != null) {
                this.playground.domCube.chat.refreshGuestList(data?.users)
                let html = `<p>${data.username} 退出聊天室</p>`;
                // $('.chat-con').append(html);
                this.playground.domCube.chat.setGuestNumber(data.userCount)
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
        this.setRotationLockFromUI(true);
        this.setLoginStatus(true);
        this.playground.showChat();
    }

    private checkOut() {
        const loginWrapper = this.chatBlock.querySelector('#login');
        loginWrapper.classList.remove('login--logined');
        this.playground.domCube.chat.showScreen('loginGuide');
        this.chatBlock.querySelector('#chat-main').innerHTML = '';
        this.setLoginStatus(false);
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
        const ele = createElementFromHTML(html)
        const containerMain = this.chatBlock.querySelector('#chat-main');
        const containerCube = this.wrapper.querySelector('#chat-main-cube .chat-main__inner#chat-main-inner');
        containerMain.appendChild(ele);
        containerCube.appendChild(ele.cloneNode(true));
        containerMain.parentElement.scrollTop = containerMain.scrollHeight;
        containerCube.scrollTop = containerCube.scrollHeight;
    }


}


(() => {
    const cvs = document.querySelector('#canvas');
    const dcvs = document.querySelector('#dom-canvas');
    const domBundle = document.querySelector('#dom-bundle');
    const instance = new Main(cvs as HTMLCanvasElement, dcvs as HTMLElement, domBundle as HTMLElement);
})()