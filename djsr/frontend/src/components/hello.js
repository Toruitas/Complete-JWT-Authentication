import React, { Component } from "react";
import axiosInstance from "../axiosApi";

class Hello extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:"",
        };

        this.getMessage = this.getMessage.bind(this)
    }

    getMessage(){
        try {
            let response = axiosInstance.get('/hello/');
            const message = response.data.hello;
            this.setState({
                message: message,
            });
            return message;
        }catch(error){
            console.log("Error: ", JSON.stringify(error, null, 4));
            throw error;
        }
    }

    componentDidMount(){
        // It's not the most straightforward thing to run an async method in componentDidMount

        // Version 1 - no async: Console.log will output something undefined.
        const messageData1 = this.getMessage();
        console.log("messageData1: ", JSON.stringify(messageData1, null, 4));


    }

    render(){
        return (
            <div>
                <p>{this.state.message}</p>
            </div>
        )
    }
}

export default Hello;