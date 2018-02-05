import React from 'react';
import { connect } from 'react-redux';
import { startGame } from '../Actions/index';
import { NUM_SHIPS_TO_PLACE } from '../Reducers/constants';
    
const mapStateToProps = state => ({isActive: state.placedShips.numberOfPlacedShips >= NUM_SHIPS_TO_PLACE,
  myShips: state.placedShips.ships})
  
const Button = ({isActive, startGame, myShips}) => (
    <button 
        type="button" 
        onClick={isActive ? () => startGame(myShips) : null}
        disabled={!isActive}>
      Start the Battle now!</button>
  );
  
export const StartGame = connect(
    mapStateToProps,
    {startGame: startGame}
  )(Button);