import React from 'react';
import './cell.css';

const Cell = props => {
    let className = props.data.isOpen ? 'cell cell-revealed' : 'cell cell-unrevealed';
    return (
        <div 
            className={className} 
            onMouseDown={(event) => props.onMouseDown(props.data, event.button)} 
            onContextMenu = {e => e.preventDefault()}
            >
        { props.data.isOpen ? props.data.content : (props.data.isFlagged ? '🚩' : '')}
        </div>
    )
}
        
export default Cell;