const WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 40510})
const xlsx = require('node-xlsx');
const regionFile = './data/nanp.xlsx'

wss.on('connection', (ws) => {
    ws.on('message', (file) => {
        console.log(getColumn(file,2))
    })
})

getColumn = (file,column) => {
    var fileData = [];
    fileData = xlsx.parse(file) 
    var phoneNumbers = []
    fileData[0].data.map((val,index) => {
        if(index != 0) {
            var firstFour = parseInt((val[0]+"").slice(0,4))
            if(!phoneNumbers.includes(firstFour)) {
                phoneNumbers.push(firstFour)
            }
        }
    })
    return phoneNumbers;
}

