const WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 40510})

const xlsx = require('node-xlsx');

var BST = require('binarysearch-tree')
var tree = new BST()

const regionFile = './data/nanp.xlsx'
var phoneNumbers = [];
var fileData = xlsx.parse(regionFile) 
var regionNumbers = getColumn(regionFile,0);
regionNumbers.map((val,index) => {
    tree.insert(parseInt(val), index)
})

wss.on('connection', (ws) => {
    ws.on('message', (file) => {
        //console.log(numbers)
        var numbers = getColumn(file,0) 
        getRegion(numbers)
    })
})

function getColumn(file,column) {
    phoneNumbers = []
    var uploadData = xlsx.parse(file)
    uploadData[0].data.map((val,index) => {
        if(index != 0) {
            var firstFour = parseInt((val[column]+"").slice(0,4))
            if(!phoneNumbers.includes(firstFour) && typeof(firstFour) === 'number') {
                phoneNumbers.push(firstFour)
            }
        }
    })
    return phoneNumbers;
}

function getRegion(phoneNumbers) {
    phoneNumbers.map((number,ind) => {
        var result = tree.find(number)
        if(result) {
            console.log(number,"-- Region --> ",fileData[0].data[parseInt(result)][2])
        }
    }) 
}

