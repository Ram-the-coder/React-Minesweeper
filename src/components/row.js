import React from 'react';
import Cell from './cell';
import './row.css';

const Row = props => {
    // console.log(props);
    let cells = props.cells.map( (cell, index) => (
        <Cell
            data = {cell}
            key = {index}
            onMouseDown = {(data, button)=>props.onMouseDown(data, button)}
        />
    ));
    return <div className="row">{cells}</div>;
}

export default Row;