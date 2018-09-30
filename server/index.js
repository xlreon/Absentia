const WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 40510})
var fs = require('fs');
var wstream = fs.createWriteStream('newFile.xlsx');

const xlsx = require('node-xlsx');

var BST = require('binarysearch-tree')
var tree = new BST()
var uploadData = []
const regionFile = './data/nanp.xlsx'
var phoneNumbers = [];
var fileData = xlsx.parse(regionFile) 
var regionNumbers = getColumn(regionFile,0);
regionNumbers.map((val,index) => {
    tree.insert(parseInt(val), index)
})

var newData = []

wss.on('connection', (ws) => {
    ws.on('message', (file) => {
        //console.log(numbers)
        var numbers = getColumn(file,0) 
        getRegion(numbers)
        createFile(0)
    })
})

function getColumn(file,column) {
    phoneNumbers = []
    uploadData = xlsx.parse(file)
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
            newData.push([number,fileData[0].data[parseInt(result)][2]])
            //console.log(number,"-- Region --> ",fileData[0].data[parseInt(result)][2])
        }
    })
}

function createFile(column) {
    uploadData[0].data.map((val,index) => {
        if(index != 0) {
            var firstFour = parseInt((val[column]+"").slice(0,4))
            if(typeof(firstFour) === 'number') {
                newData.map((value) => {
                    if(value[0] === firstFour) {
                        //console.log(value)
                        uploadData[0].data[index].push(value[1])
                    }
                }) 
            }
        }
    })
    uploadData[0].data[0].push('Country')
    console.log(uploadData[0].data)
    var buffer = xlsx.build([{name: "updateSheet", data: uploadData[0].data}]);
    console.log(buffer)
    wstream.write(buffer);
}
