import React from 'react';

export default class HomePage extends React.Component {

    constructor(props) {
        super(props);
    }

    handleUpload = (event) => {
        var file = event.target.files[0];
        const ws = new WebSocket("ws://localhost:40510")

        ws.onopen = () => {
            console.log("websocket")
            ws.send(file)
        }

        ws.onmessage = (ev) => {
            console.log(ev);
            var url = window.URL.createObjectURL(ev.data);
            var tempLink = document.createElement('a');
            tempLink.href = url;
            tempLink.setAttribute('download', 'newData.xlsx');
            tempLink.click();
            }
    }

    render() {

        return(
            <center>
                <h1>Welcome to Absentia</h1>
                    <input type='file' onChange={this.handleUpload.bind(this)} accept=".xls,.xlsx"/> 
            </center>
        );
    }

}
