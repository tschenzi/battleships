import React from 'react';
import { connect } from 'react-redux';
import { autoPlacement } from '../Actions/index';
import { NUM_SHIPS_TO_PLACE } from '../Reducers/constants';
    
const mapStateToProps = state => ({isActive: state.placedShips.numberOfPlacedShips < NUM_SHIPS_TO_PLACE})
  
const Button = ({isActive, auto}) => (
    <button 
        type="button" 
        onClick={isActive ? auto : null}
        disabled={!isActive}>
      Place Ships Automatically </button>
  );
  
export const AutoShipPlacement = connect(
    mapStateToProps,
    {auto: autoPlacement}
  )(Button);