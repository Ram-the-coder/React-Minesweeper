import React, { Component } from 'react';
import './header.css';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0,
            gameStatus: this.props.gameStatus,
            timerStarted: false,
            timerStopped: false,
            reset: false,
        }
    }

    timer = ''; //a variable to hold the setInterval ID for the tick function when the timer is started
                // This ID will be needed to clear the setInterval function

    componentWillUnmount() {
        if(this.state.timerStarted && !this.state.timerStopped)
            this.stopTimer();
    }

    componentDidUpdate() {
        if(!this.state.timerStarted && this.state.gameStatus === 'started')
            this.startTimer();
        else if(!this.state.timerStopped && this.state.gameStatus === 'gameover')
            this.stopTimer();
        if(this.state.reset) {
            this.resetTimer();
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.gameStatus !== prevState.gameStatus) {
            let shouldReset = nextProps.gameStatus === 'waiting';
            return {
                gameStatus: nextProps.gameStatus,
                reset: shouldReset,
            }
        }
        else return null;
    }

    resetTimer = () => {
        this.stopTimer();
        this.setState({
            time: 0,
            gameStatus: this.props.gameStatus,
            timerStarted: false,
            timerStopped: false,
            reset: false,
        });
    }

    tick = () => {
        this.setState({time: this.state.time + 1})
    }

    startTimer = () => {
        this.timer = setInterval( this.tick, 1000);
        this.setState({timerStarted: true})
    }

    stopTimer = () => {
        clearInterval(this.timer);
        this.setState({timerStopped: true});
    }

    refineTime = (time) => {
        if(Math.floor(time/10) === 0)
            return '0'+time;
        else return time;
    }

    render() {
        return (
            <div className="header">
                <div className="counter">{this.props.minesLeft}</div>
                <button className="btn-newGame btn" onClick = {this.props.handleReset}>Reset</button>
                <div className="counter">{this.refineTime(this.state.time)}</div>
            </div>
        )
    }
}
