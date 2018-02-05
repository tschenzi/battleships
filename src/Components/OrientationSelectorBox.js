import React from 'react';
import { connect } from 'react-redux';
import { ORIENTATION_HORIZONTAL, ORIENTATION_VERTICAL } from '../Reducers/constants';
import { turnShip } from '../Actions/index';

const OrientationSelector = ({orientation, orientationSelectorEvent}) => (
    <form>
        <label>
            <input type="radio" value={ORIENTATION_VERTICAL} 
            checked={orientation === ORIENTATION_VERTICAL} 
            onChange={(e) => orientationSelectorEvent(e.target.value)}/>
            Vertical
        </label>
        <label>
        <input type="radio" value={ORIENTATION_HORIZONTAL} 
            checked={orientation === ORIENTATION_HORIZONTAL} 
            onChange={(e) => orientationSelectorEvent(e.target.value)}/>
            Horizontal
        </label> 
    </form>
)
    
const mapStateToProps = state => {
    return {
      orientation: state.shipPlacements.orientation,
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      orientationSelectorEvent: orientation => {
        dispatch(turnShip(orientation))
      }
    }
  }
  
  export const OrientationSelectorBox = connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrientationSelector)