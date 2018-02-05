import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tryPlaceShip, untryShip, placeShip } from '../Actions/index';
import { OrientationSelectorBox } from './OrientationSelectorBox';
import { UndoShipPlacement } from './UndoShipPlacement'; 
import { AutoShipPlacement } from './AutoShipPlacement';
import { StartGame } from './StartGame';
import { NUM_SHIPS_TO_PLACE } from '../Reducers/constants';
import Battle from './Battle';

class Box extends Component{

  render(){
   
    return(
      <div className={'box'}> 
        {this.props.field.map(cell => (
          <Cell
            key={cell.key}
            sign={cell.isEmpty? '' : 'O'}
            onMouseOver={this.props.isActive? () => this.props.mouseOverEvent(cell.key) : null}
            onMouseOut={this.props.isActive? () => this.props.mouseOutEvent(cell.key) : null}
            onClick={this.props.isActive? () => this.props.mouseClickEvent(cell.key) : null}      
            targetStatus={cell.isTarget? this.props.targetStatus : 'noTarget'}
            isActive={this.props.isActive}
          />))}
      </div>
    );
  }
}

class Cell extends Component{

  render() { return(<div 
    className = {!this.props.isActive? 'cell-inactive' : this.props.targetStatus === 'noTarget' ? 'cell' : (this.props.targetStatus === 'targetOK' ? 'cell-targetOk' : 'cell-targetNotOk')} 
    onMouseOver = {this.props.onMouseOver} 
    onMouseOut = {this.props.onMouseOut}
    onClick = {this.props.onClick} >
    {this.props.sign}
    </div>);
  }
}

class App extends Component {
  render() {
    return (
      this.props.battleActive ? 
      <div className='noselect'>
        <Battle />
      </div> : 
      <div className='noselect'>
       <div className = 'playground'> 
         <PlacementBox />
         <div className='placement-sidebox'>
           <div><OrientationSelectorBox /></div>
           <UndoShipPlacement />
           <AutoShipPlacement />
           <div><StartGame /></div>
         </div>
       </div>   
     </div> 
    );
  }
}


const mapStateToProps = state => {
  return {
    field: state.shipPlacements.field,
    targetStatus: state.shipPlacements.targetStatus,
    isActive: state.shipPlacements.numShip < NUM_SHIPS_TO_PLACE,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    mouseOverEvent: cellIndex => {
        dispatch(tryPlaceShip(cellIndex))
    },
    mouseOutEvent: cellIndex => {
      dispatch(untryShip(cellIndex))
    },
    mouseClickEvent: (cellIndex) => {
      dispatch(placeShip(cellIndex))
    }
    
  }
}

const PlacementBox = connect(
  mapStateToProps,
  mapDispatchToProps
)(Box)


const mapStateToPropsMasterApp = state => ({battleActive: state.battle.battleActive});
const MasterApp = connect(mapStateToPropsMasterApp)(App);
export default MasterApp;
