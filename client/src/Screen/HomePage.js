import React from 'react';

export default class HomePage extends React.Component {

    constructor(props) {
        super(props);
    }

    handleUpload = (event) => {
        console.log(event.target.files[0]);
    }

    render() {

        return(
            <center>
                <h1>Welcome to Absentia</h1>
                    <input type='file' onChange={this.handleUpload.bind(this)}/> 
            </center>
        );
    }

}
