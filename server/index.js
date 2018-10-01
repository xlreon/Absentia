const WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 40510})
const xlsx = require('node-xlsx');
var buffer
var BST = require('binarysearch-tree')
var tree = new BST()
var uploadData = []
const regionFile = './data/nanp.xlsx'
var phoneNumbers = [];
var sheetLengths = [];
var fileData = xlsx.parse(regionFile) 
var regionNumbers = getColumn(regionFile,0,"data");

var count = 0
var nodes = 0
sheetLengths.map((val,index) => {
    for(var i=count;i<=val;i++) {
        tree.insert(parseInt(regionNumbers[nodes]), nodes-count)
        nodes++;
    }
    count=val
})

var newData = []

wss.on('connection', (ws) => {
    ws.on('message', (file) => {
        var numbers = getColumn(file,0,"phone") 
        getRegion(numbers)
        createFile(0)
        ws.send(buffer)
    })
})

function getColumn(file,column,profile) {

    phoneNumbers = []
    var sum = 0
    uploadData = xlsx.parse(file)
    if(profile === 'data')
    {
        uploadData.map(value =>  {
        sum += value.data.length-1
        sheetLengths.push(sum)
         value.data.map((val,index) => {
             if(index != 0) {
                 var firstFour = parseInt((val[column]+"").slice(0,4))
                 if(!phoneNumbers.includes(firstFour) && typeof(firstFour) === 'number') {
                     phoneNumbers.push(firstFour)
                 }
             }
             })
        })
    }
    else {
     uploadData[0].data.map((val,index) => {
         if(index != 0) {
             var firstFour = parseInt((val[column]+"").slice(0,4))
             if(!phoneNumbers.includes(firstFour) && typeof(firstFour) === 'number') {
                 phoneNumbers.push(firstFour)
             }
         }
         })
    }
    return phoneNumbers;
}

function getRegion(phoneNumbers) {
    phoneNumbers.map((number,ind) => {
        var result = tree.find(number)
        if(result) {
            fileData.map((value) => {
                if(value.data[parseInt(result)+1] !== undefined && value.data[result+1][0] === number)
                {
                    newData.push([number,value.data[parseInt(result)+1][2]])
                    //console.log(number,"-- Region --> ",value.data[parseInt(result)+1][2])
                }
            })
        }
    })
}

function createFile(column) {
    uploadData[0].data.map((val,index) => {
        if(index != 0) {
            var firstFour = parseInt((val[column]+"").slice(0,4))
            if(typeof(firstFour) === 'number') {
                newData.map((value) => {
                    if(!uploadData[0].data[index].includes(value[1]) && value[0] === firstFour) {
                        var insertIndex = uploadData[0].data[0].indexOf('Country') 
                        if(insertIndex !== -1)
                        {
                            uploadData[0].data[index][insertIndex] = value[1]
                        }
                        else {
                            uploadData[0].data[index].push(value[1])
                        }
                    }
                }) 
            }
        }
    })
    if(!uploadData[0].data[0].includes('Country'))
    {
        uploadData[0].data[0].push('Country')
    }
    buffer = xlsx.build([{name: "updateSheet", data: uploadData[0].data}]);
}
