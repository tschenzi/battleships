import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as consts from '../Reducers/constants';
import { mouseOverFieldcell, mouseOutFieldcell, clickOnFieldcell } from '../Actions/index';

class PlayerFieldDisplay extends Component{

  render(){
   
    return(
      <div className={'box'}> 
        {this.props.field.map(cell => (
          <FieldCell
            key={cell.key}
            cellClassName = {(this.props.battleState === consts.BS_COMPUTER_SHOT && cell.key === this.props.computerShootTarget? 
              (cell.state === consts.CS_SHIP? 'fieldcell-shooting-hit' : 'fieldcell-shooting-miss') : 'fieldcell')}
            sign={cell.state === consts.CS_SHIP? 'O' : (cell.state === consts.CS_HIT? 'X' : (cell.state === consts.CS_MISS? '-' : ' '))}
            onMouseOver={null}
            onMouseOut={null}
            onClick={null}      
            //isActive={false}
          />))}
      </div>
    );
  }
}

class ComputerFieldDisplay extends Component{
  
    render(){
     
      return(
        <div className={'box'}> 
          {this.props.field.map(cell => (
            <FieldCell
              key={cell.key}
              cellClassName= {(this.props.battleState === consts.BS_PLAYER_AIMING && cell.key === this.props.playerAimingField ?  
                (cell.state === consts.CS_WATER || cell.state === consts.CS_SHIP ? 'fieldcell-target' : 'fieldcell-invalidTarget' )
                : (this.props.battleState === consts.BS_PLAYER_SHOT && this.props.playerShootTarget === cell.key ? 'fieldcell-shooting' : 'fieldcell')) } 
              sign={cell.state === consts.CS_SHIP? ' ' : (cell.state === consts.CS_HIT? (this.props.ships[cell.numShip].numHits < cell.shipSize ? 'X' : cell.shipSize) : (cell.state === consts.CS_MISS? '-' : ' '))}
              onMouseOver= {this.props.battleState !== consts.BS_PLAYER_WON && this.props.battleState !== consts.BS_COMPUTER_WON ?  
                () => this.props.onMouseOver(cell.key) 
                : null}
              onMouseOut={() => this.props.onMouseOut(cell.key)}
              onClick={this.props.isActive? () => this.props.onClick(cell.key) : null} 
            />))}
        </div>
      );
    }
  }

class FieldCell extends Component{

  render() { return(<div 
    className = {this.props.cellClassName} 
    onMouseOver = {this.props.onMouseOver} 
    onMouseOut = {this.props.onMouseOut}
    onClick = {this.props.onClick} >
    {this.props.sign}
    </div>);
  }
}


const mapStateToPropsComputerField = state => {
  return {
    battleState: state.battle.battleState,
    isActive: state.battle.battleState === consts.BS_PLAYER_AIMING, // only used for click event
    playerShootTarget: state.battle.playerShootTarget,
    field: state.battle.computerField,
    ships: state.battle.computerShips,
    playerAimingField: state.battle.playerAimingField
  }
}

const mapDispatchToPropsComputerField = dispatch => ({
    onMouseOver: (key) => {dispatch(mouseOverFieldcell(key))},
    onClick: (key) => {dispatch(clickOnFieldcell(key))} ,
    onMouseOut: (key) => {dispatch(mouseOutFieldcell(key))} 
})

const mapStateToPropsPlayerField = state => ({
    battleState: state.battle.battleState,
    field: state.battle.playerField,
    computerShootTarget: state.battle.computerShootTarget,
    ships: state.battle.playerShips
  }
)

const PlayerField = connect(
  mapStateToPropsPlayerField
)(PlayerFieldDisplay)

const ComputerField = connect(
  mapStateToPropsComputerField,
  mapDispatchToPropsComputerField
)(ComputerFieldDisplay)

const BattleMessageBox = () => (<div></div>); 


class Battle extends Component {
  render() {
    return (
      <div>
        <div className='playground'>
          <PlayerField />
          <ComputerField />
        </div >
        <div>
          <BattleMessageBox />
        </div>
      </div>
    );
  }
}
export default Battle;
