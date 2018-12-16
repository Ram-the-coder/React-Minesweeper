import React, { Component } from 'react';
import Row from './row.js';
import './board.css'

export default class Board extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: Board.createBoard(this.props.rows, this.props.mines),
            mines: this.props.mines,
            gameStatus: this.props.gameStatus,
            error: '',
            cellsRevelead: 0,
            cellsFlagged: 0,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.rows !== prevState.rows.length || nextProps.mines !== prevState.mines) { //if any props have been changed
            if(nextProps.mines >= nextProps.rows*nextProps.rows) // if mines > total cells
                return {
                    error: '❌ERROR: The number of mines should be less than the total number of squares on the board. Decrease the number of mines or increase the rows', 
                }
            else { // no errorneous values for mines or rows, now reset the board
                document.documentElement.style.setProperty('--rows', nextProps.rows);

                return {
                    rows: Board.createBoard(nextProps.rows, nextProps.mines),
                    mines: nextProps.mines,
                    error: '',
                    cellsRevelead: 0,
                    cellsFlagged: 0,
                }
            }
        }
        else if(nextProps.gameStatus !== prevState.gameStatus) //if gamestatus has changed
        {
            if(nextProps.gameStatus === 'waiting') //if the game has been reset
                return {
                    rows: Board.createBoard(nextProps.rows, nextProps.mines),
                    mines: nextProps.mines,
                    gameStatus: nextProps.gameStatus,
                    error: '',
                    cellsRevelead: 0,
                    cellsFlagged: 0,
                }
            else return { //game has not been reset
                gameStatus: nextProps.gameStatus
            }
        }
        else return null; //no change in props
    }

    static createBoard = (rows, mines) => {
        let board = [];

        for(let i = 0; i < rows; i++) {
            board.push([]);

            for(let j = 0; j < rows; j++) {
                board[i].push({
                    x: i,
                    y: j,
                    content: '',
                    isOpen: false,
                    isFlagged: false,
                    hasMine: false,
                });
            }
        }

        //plant mines
        for(let i = 0; i < mines; i++) {
            const randomRow = Math.floor(Math.random()*rows);
            const randomCol = Math.floor(Math.random()*rows);
            const cell = board[randomRow][randomCol]
            cell.hasMine ? i-- : (cell.hasMine = true);
        }

        //count the neighbouring mines
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < rows; j++) {
                let mineCount = 0;
                if(board[i][j].hasMine)
                    mineCount = -1;
                else {
                    if(i !== 0) { //if above needs to be checked
                        if(board[i-1][j].hasMine) // check north
                            ++mineCount;
                        if(j !== rows - 1) { //if right
                            if(board[i-1][j+1].hasMine) // check NE
                                ++mineCount;
                        }
                        if(j !== 0) { //if left
                            if(board[i-1][j-1].hasMine) //check NW
                                ++mineCount;
                        }
                    }
                    if(i !== rows - 1) { //if below
                        if(board[i+1][j].hasMine) //check south
                            ++mineCount;
                        if(j !== rows - 1) { //if right
                            if(board[i+1][j+1].hasMine) //check SE
                                ++mineCount;
                        }
                        if(j !== 0) { //if left
                            if(board[i+1][j-1].hasMine) //check SW
                                ++mineCount;
                        }
                    }
                    if(j !== rows - 1) { //if right
                        if(board[i][j+1].hasMine) //check E
                            ++mineCount;
                    }
                    if(j !== 0) { //if left
                        if(board[i][j-1].hasMine) //check W
                            ++mineCount;
                    }
                }
                board[i][j].content = (mineCount === -1) ? '💣' : (mineCount === 0 ? '' : mineCount); 
            }
        }


        return board;
    }

    revealMines = () => {
        let rows = this.state.rows;
        const mines = [].concat(...rows.map( row => row.filter( cell => cell.content === '💣')));
        mines.forEach( mine => {
            let rows = this.state.rows;
            const cell = rows[mine.x][mine.y];
            cell.isOpen = true; 
            this.setState({rows});
        } );
        setTimeout(() => {
            mines.forEach( mine => {
                let rows = this.state.rows;
                const cell = rows[mine.x][mine.y];
                cell.content = '💥'; 
                this.setState({rows});
            } );
        }, 500)
        setTimeout(() => window.alert('You lost'), 600);
    }

    open = data => {
        let rows = this.state.rows;
        const cell = rows[data.x][data.y];
        if(cell.isFlagged || cell.isOpen)
            return;
        cell.isOpen = true; 
        this.setState( 
            (state) => ( {rows: rows, cellsRevelead: state.cellsRevelead+1} ), this.checkforWin 
        );

        if(cell.content === '💣') {
            setTimeout(this.revealMines, 500);   
            this.props.handleGameStatusUpdate('gameover');         
        }

        if(cell.content === '') {
            const i = cell.x, j = cell.y;
            if(i !== 0) { //if above needs to be checked
                this.open(this.state.rows[i-1][j]) // check north
                if(j !== this.props.rows - 1) { //if right
                    this.open(this.state.rows[i-1][j+1]) // check NE
                }
                if(j !== 0) { //if left
                    this.open(this.state.rows[i-1][j-1]) //check NW
                }
            }
            if(i !== this.props.rows - 1) { //if below
                this.open(this.state.rows[i+1][j]) //check south
                if(j !== this.props.rows - 1) { //if right
                    this.open(this.state.rows[i+1][j+1]) //check SE
                }
                if(j !== 0) { //if left
                    this.open(this.state.rows[i+1][j-1]) //check SW
                }
            }
            if(j !== this.props.rows - 1) { //if right
                this.open(this.state.rows[i][j+1]) //check E
            }
            if(j !== 0) { //if left
                this.open(this.state.rows[i][j-1]) //check W
            }
        }
    }

    flagCell = (data) => {
        let rows = this.state.rows;
        const cell = rows[data.x][data.y]
        if(cell.isOpen)
            return;
        if(cell.isFlagged) {
            cell.isFlagged = false;
            this.setState( {rows: rows, cellsFlagged: this.state.cellsFlagged-1}, this.checkforWin);    
            this.props.handleFlag(-1);
        }
        else {
            cell.isFlagged = true;
            this.setState( {rows: rows, cellsFlagged: this.state.cellsFlagged+1}, this.checkforWin );
            this.props.handleFlag(1)
        }
    }

    checkforWin = () => {
        if((this.state.cellsRevelead + this.state.cellsFlagged === this.props.rows*this.props.rows) && this.state.cellsFlagged === this.props.mines) {
            this.props.handleGameStatusUpdate('gameover');
            window.alert('You Won!');
        }
    }

    handleMouseDown = (data, button) => {
        if(this.props.gameStatus === 'gameover')
            return;
        if(this.props.gameStatus === 'waiting')
            this.props.handleGameStatusUpdate('started');

        if(button === 0)
            this.open(data);
        if(button === 2)
            this.flagCell(data);
    }

    render() {
        let rows = this.state.rows.map( (cells, index) => (
            <Row 
                cells = {cells}
                key = {index}
                onMouseDown = {this.handleMouseDown}
            />
        ));
        return (
            <div className="board">
                <div className="error-msg">{this.state.error}</div>
                <div>{rows}</div>
            </div>
        )
    }
}
