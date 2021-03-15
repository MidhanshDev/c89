import React from 'react';
import LottieView from 'lottie-react-native';
export default class SantaAnimation extends React.Component{
    render(){
        return(
            <LottieView
            source = {require("../assets/11840-christmas-santa-claus.json")}
            style = {{width:"60%"}}
            autoPlay loop
            />

        );
    }
}