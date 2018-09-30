const WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 40510})
const xlsx = require('node-xlsx');
const regionFile = './data/nanp.xlsx'

wss.on('connection', (ws) => {
    ws.on('message', (file) => {
        //console.log(file)
        console.log(getColumn(file,2))
        //console.log(fileData[0].data[0])
    })
})

getColumn = (file,column) => {
    var fileData = [];
    fileData = xlsx.parse(file) 
    var phoneNumbers = []
    fileData[0].data.map((val,index) => {
        if(index != 0) {
            phoneNumbers.push(val[0])
        }
    })
    return phoneNumbers;
}

