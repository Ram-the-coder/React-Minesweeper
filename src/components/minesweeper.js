import React, { Component } from 'react';
import Board from './board';
import Header from './header';
import './minesweeper.css';

export default class Minesweeper extends Component {
    
    constructor() {
        super();
        this.state = {
            rows: 8,
            mines: 10,
            gameStatus: 'waiting',
            minesLeft: 10,

        }
    }

    updateMines = (event) => {this.setState({
        mines: +event.target.value, 
        minesLeft:+event.target.value,
        gameStatus: 'waiting',
    })}

    updateRows = (event) => {
        this.setState({rows: +event.target.value, gameStatus: 'waiting'});
        document.documentElement.style.setProperty('--rows', event.target.value);
        // console.log('updated-rows');
    }

    handleReset = () => {this.setState({
        gameStatus: 'waiting',
        minesLeft: this.state.mines,
    })}

    handleGameStatusUpdate = (status) => {
        this.setState({gameStatus: status});
    }

    handleFlag = (num) => {
        this.setState({minesLeft: this.state.minesLeft - num});
    }
   
    render() {

        return (
            <div className="container">
                <div className="settings">
                    <form onSubmit = {this.handleSubmit}>
                        <label>Number of rows/columns</label>
                        <br />
                        <input 
                            type="number" 
                            name="rows" 
                            value={this.state.rows} 
                            min = {Math.ceil(Math.sqrt(this.state.mines+1))}
                            onChange = {this.updateRows} 
                        />
                        <br />
                        <label>Number of mines</label>
                        <br />
                        <input 
                            type="number" 
                            name="mines" 
                            value={this.state.mines} 
                            max = {this.state.rows*this.state.rows -1}
                            onChange = {this.updateMines} 
                        />
                        <br />
                        {/* <button type="submit">New Game</button> */}
                    </form>
                </div>
                <div>
                    <Header 
                        minesLeft={this.state.minesLeft} 
                        gameStatus = {this.state.gameStatus}
                        handleReset = {this.handleReset} 
                        />
                    <Board 
                        rows={this.state.rows} 
                        mines={this.state.mines}
                        gameStatus = {this.state.gameStatus}
                        handleGameStatusUpdate = {this.handleGameStatusUpdate}
                        handleFlag = {this.handleFlag}
                        className="board-component" 
                        />
                </div>
            </div>
        )
    }
}