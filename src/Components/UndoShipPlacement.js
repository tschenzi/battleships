import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { ORIENTATION_HORIZONTAL } from '../Reducers/constants';
import { undoPlaceShip } from '../Actions/index';
    
const mapStateToProps = state => {
    return {
      isActive: state.placedShips.numberOfPlacedShips > 0,
      cellIndex: state.placedShips.numberOfPlacedShips > 0 ? state.placedShips.ships[state.placedShips.numberOfPlacedShips-1].cellIndex : 0,
      orientation: state.placedShips.numberOfPlacedShips > 0? state.placedShips.ships[state.placedShips.numberOfPlacedShips-1].orientation : ORIENTATION_HORIZONTAL
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      onClick: (cellIndex, orientation) => {
        dispatch(undoPlaceShip(cellIndex, orientation))
      }
    }
  }

  // eslint-disable-next-line
  const MyButton1 = ({isActive, onClick, cellIndex, orientation}) => (
    <button 
        type="button" 
        onClick={isActive ? () => {onClick(cellIndex, orientation)} : null}>
      Undo last ship </button>
  );

  class MyButton2 extends Component {
    render() {
    
      return (
        <button
          type='button'
          onClick={this.props.isActive? () => { 
           this.props.onClick(this.props.cellIndex, this.props.orientation);} : null }
          disabled={!this.props.isActive} >
          Undo last ship
        </button>
      );
    }
  } 
 
  
  export const UndoShipPlacement = connect(
    mapStateToProps,
    mapDispatchToProps
  )(MyButton2);