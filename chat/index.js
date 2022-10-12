const {createServer} = require('http');
const {Server} = require("socket.io");

//app.js
/*建立http服務*/
const app = createServer()
/*引入socket.io*/
const io = new Server(app, {
    cors: {
        origin: ["https://mizok.github.io", "http://localhost:8080", "http://192.168.1.101:8080"],
        allowedHeaders: ["custom-header"],
        credentials: true,
        methods: ["GET", "POST"]
    }
})
/*自訂監聽端口*/
const port = 5500;
app.listen(port);

console.log('app listen at ' + port)





/*用戶陣列*/
let users= [];

io.on('connection', (socket) => {
    /*是否為新用戶*/
    let isNewPerson = true;
    /*當前登入用戶*/
    let username= null;

    //監聽登入
    socket.on('login', (data) => {
        for (var i = 0; i < users.length; i++) {
            isNewPerson = (users[i].username === data.username) ? false : true;
        }
        if (isNewPerson) {
            username = data.username
            users.push({
                username: data.username,
                id: socket.id
            })
            data.userCount = users.length
            data.users = users;
            /*發送 登入成功 事件*/
            socket.emit('loginSuccess', data)
            /*向所有連接的用戶廣播 add 事件*/
            io.sockets.emit('add', data);
        } else {
            /*發送 登入失敗 事件*/
            socket.emit('loginFail', '');
            socket.disconnect();
        }
    })

    //監聽登出
    socket.on('logout', (data) => {
        /* 發送 離開成功 事件 */

        socket.emit('leaveSuccess')
        /* 向所有連接的用戶廣播 有人登出 */
        users = users.filter((val) => {
            return (val.username !== data.username)
        })
        io.sockets.emit('leave', { username: data.username, userCount: users.length,users:users });
        socket.disconnect();
    })

    socket.on('disconnect', () => {
        socket.emit('leaveSuccess')

        const userLeft = users.filter((val) => {
            return (val.id === socket.id)
        })[0]?.username

        users = users.filter((val) => {
            return (val.id !== socket.id)
        })

        io.sockets.emit('leave', { username: userLeft, userCount: users.length,users:users })
    })

    socket.on('sendMessage', function (data) {
        /*發送receiveMessage事件*/
        io.sockets.emit('receiveMessage', data)
    })
})
