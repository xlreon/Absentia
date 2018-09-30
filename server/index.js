const WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 40510})
const xlsx = require('node-xlsx');
var BST = require('binarysearch-tree')
var tree = new BST()
const regionFile = './data/nanp.xlsx'
var fileData = [];
wss.on('connection', (ws) => {
    ws.on('message', (file) => {
        var numbers = getColumn(file,0)
        getRegion(regionFile,numbers)
    })
})

getColumn = (file,column) => {
    var phoneNumbers = []
    fileData = xlsx.parse(file) 
    fileData[0].data.map((val,index) => {
        if(index != 0) {
            var firstFour = parseInt((val[column]+"").slice(0,4))
            if(!phoneNumbers.includes(firstFour)) {
                phoneNumbers.push(firstFour)
            }
        }
    })
    return phoneNumbers;
}

getRegion = (regionFile,phoneNumbers) => {
    var regionNumbers = getColumn(regionFile,0);
    regionNumbers.map((val,index) => {
        tree.insert(parseInt(val), index)
    })
    phoneNumbers.map((number,ind) => {
        //console.log(number)
        var result = tree.find(number)
        if(result) {
            //console.log(!(result === []))
            console.log(number,"-- Region --> ",fileData[0].data[parseInt(result)][2])
        }
    }) 
}

