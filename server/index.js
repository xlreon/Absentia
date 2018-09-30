var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 40510})

wss.on('connection', (ws) => {
    ws.on('message', (file) => {
        console.log(file)
    })
})
