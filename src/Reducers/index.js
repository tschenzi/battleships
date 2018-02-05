
import * as consts from './constants';
import { combineReducers } from 'redux'
import { shipPlaced, computerAim, computerShoot, playerShootResult, computerShootResult } from '../Actions/index';
import * as util from '../Util/utils';
import { tryTargetShip, placeShipOnField, unplaceShipOnField, nextComputerTarget } from '../Util/utils';


const getEmptyField = () => {
    var field = [];
    for (var i = 0; i < 100; i++) {
        field.push({key: i, isEmpty: true, isTarget: false})
    }
    return field;
}

const battle = (state = {
    playerShips: [],  // cellIndex, numShip, orientation
    computerShips: [],
    battleActive: false,
    playerAimingField: null, // mouse over computer field
    playerShootTarget: null, // player clicked to shoot
    computerShootTarget: null,
    playerField: [],
    computerField: [],
    playerHits: 0,
    computerHits: 0,
    message: "Make your Turn",
    battleState: consts.BS_PLAYER_AIMING}, action) => {
    
    switch (action.type) {

        case 'START_GAME': {
            let copy = Object.assign({}, state, {battleActive: true});
            // copy playerShips because its from state and it will be changed in initializeField
            copy.playerShips = action.playerShips.map(ship => Object.assign({}, ship)); 
            copy.computerShips = util.placeComputerShips();
            copy.computerField = util.initializeField(copy.computerShips);
            copy.playerField = util.initializeField(copy.playerShips);
            return copy;
        }

        case 'BATTLE_CLICK_ON_CELL': {
            if (state.computerField[action.cellIndex].state !== consts.CS_WATER && 
                state.computerField[action.cellIndex].state !== consts.CS_SHIP) {
                return state;
            }
            let copy = Object.assign({}, state, {
                battleState: consts.BS_PLAYER_SHOT, playerShootTarget: action.cellIndex
            });
            setTimeout(()=> {action.asyncDispatch(playerShootResult())}, 500);
            return copy;
        }

        case 'BATTLE_PLAYER_SHOOT_RESULT': {
            let copy = Object.assign({}, state, {
                battleState: consts.BS_PLAYER_AIMING, 
                playerShootTarget: null,
                computerField: state.computerField.map((cell) => {return Object.assign({}, cell)}),
                computerShips: [...state.computerShips]
            });
            let hit = copy.computerField[state.playerShootTarget].state === consts.CS_SHIP;
         //   copy.playerAimingField = ((hit && (state.playerAimingField === state.playerShootTarget))  ? null : state.playerAimingField);
            copy.computerField[state.playerShootTarget].state = hit? consts.CS_HIT : consts.CS_MISS;
            if (hit) {
                copy.computerShips[state.computerField[state.playerShootTarget].numShip] = Object.assign({}, state.computerShips[state.computerField[state.playerShootTarget].numShip], 
                    {numHits: state.computerShips[state.computerField[state.playerShootTarget].numShip].numHits+1 });
                copy.playerHits++;
                if (copy.playerHits >= consts.NUM_HITS_FOR_VICTORY) {
                    copy.battleState = consts.BS_PLAYER_WON;
                    copy.message = "Congratulations - You Win!";
                    console.log("player won");
                }
            }
            else {
                // computer turn
                action.asyncDispatch(computerAim());
            }
            return copy;
        }

        case 'BATTLE_MOUSE_OVER_CELL': {
            return Object.assign({}, state, {playerAimingField: action.cellIndex});
        }

        case 'BATTLE_MOUSE_OUT_CELL': {
            return Object.assign({}, state, {playerAimingField: null});
        }

        case 'BATTLE_COMPUTER_AIM': {
            console.log("computer is aiming");
            let copy = Object.assign({}, state, {battleState: consts.BS_COMPUTER_AIMING})
            // timeout with dispatch -> computer is looking for next target
            setTimeout(() => {action.asyncDispatch(computerShoot())}, 900);
            return copy;
        }

        case 'BATTLE_COMPUTER_SHOOT': {
            console.log("Computer is shooting");
            // create index of next target
            let targetIndex = nextComputerTarget(state.playerField, state.playerShips);
            let copy = Object.assign({}, state);
            // set new battle state
            copy.battleState = consts.BS_COMPUTER_SHOT
            // set field to aiming
            copy.computerShootTarget = targetIndex;
            // set message
            copy.message = "Enemy is shooting";
             // timeout for shoot result 
            setTimeout(()=> {action.asyncDispatch(computerShootResult())}, 500);
           
            return copy;
        }

        case 'BATTLE_COMPUTER_SHOOT_RESULT': {
            console.log("computer shoot result");
            let copy = Object.assign({}, state, 
                {playerShips: [...state.playerShips], playerField: state.playerField.map((cell) => {return Object.assign({}, cell)})});
            let hit = copy.playerField[copy.computerShootTarget].state === consts.CS_SHIP;
            if (hit) {
                copy.playerField[copy.computerShootTarget].state = consts.CS_HIT;
                copy.playerShips[state.playerField[state.computerShootTarget].numShip] = Object.assign(
                    {}, state.playerShips[state.playerField[state.computerShootTarget].numShip], 
                    {numHits: state.playerShips[state.playerField[state.computerShootTarget].numShip].numHits+1});
                copy.computerHits++;
                if (copy.computerHits >= consts.NUM_HITS_FOR_VICTORY) {
                    copy.state = consts.BS_COMPUTER_WON;
                    copy.message = "The enemy destroyed your fleet - Loser!";
                }
                else {
                    action.asyncDispatch(computerAim());
                }
            }
            else {
                copy.playerField[copy.computerShootTarget].state = consts.CS_MISS;
                copy.battleState = consts.BS_PLAYER_AIMING;
            }
            return copy;
        }
        
        default: return state;
    }
};

const placedShips = (state = {
    numberOfPlacedShips: 0,
    ships: []}, action) => {

    switch (action.type) {

        case 'UNDO_PLACE_SHIP': {
            let copy = Object.assign({}, state, {ships: [...state.ships]});
            copy.ships.pop();
            copy.numberOfPlacedShips--;
            return copy;
        }

        case 'SHIP_PLACED': {
            console.log('placedShips: ship placed received');
            let copy = Object.assign({}, state, {ships: [...state.ships]});
            copy.ships.push({cellIndex: action.cellIndex,
                numShip: action.numShip,
                orientation: action.orientation});
            copy.numberOfPlacedShips++;
            console.log("num of placed ships in ship placements: "+copy.numberOfPlacedShips)
            return copy;
        }
        default: return state;
    }
}


const shipPlacements = (state = {
    numShip: 0,
    shipToPlace: consts.SHIPS_TO_PLACE[0], 
    field: getEmptyField(), 
    targetStatus: 'noTarget',
    orientation: consts.ORIENTATION_VERTICAL}, action) => {
    switch(action.type) {

        case 'TRY_PLACE_SHIP': {
            let copy = Object.assign({}, state, {field: state.field.map(cell => Object.assign({}, cell))});
            let targetResult = tryTargetShip(copy.field, copy.shipToPlace, action.cellIndex, copy.orientation);
            copy.targetStatus = targetResult ? 'targetOK' : 'targetNotOk';
            return copy;
        }

        case 'AUTO_PLACEMENT': {
            console.log("auto placement received");
            let copy = Object.assign({}, state, {field: state.field.map(cell => Object.assign({}, cell))});
            let {placedShips, newShipIndex: numShip} = util.autoShipPlacement(copy.field, copy.numShip);
            copy.numShip = numShip;
            console.log('num ship: '+numShip);
            placedShips.forEach(ship => {action.asyncDispatch(shipPlaced(ship.cellIndex, ship.numShip, ship.orientation))});
            console.log("ship placed: "+placedShips.length)
            if (copy.numShip < consts.NUM_SHIPS_TO_PLACE)
            {
                copy.shipToPlace = consts.SHIPS_TO_PLACE[copy.numShip];
            }
            else{
                copy.shipToPlace = null;
                console.log("no more ship");
            }
            return copy;
        }

        case 'UNTRY_SHIP':
           
            return Object.assign({}, state, {
                targetStatus: 'noTarget', 
                field: state.field.map(cell => Object.assign({}, cell, {isTarget: false})
            )});
            
        case 'PLACE_SHIP': {
            if (state.targetStatus !== 'targetOK') { 
                return state;
            }
            let copy = Object.assign({}, state, {field: state.field.map(cell => Object.assign({}, cell))});
            placeShipOnField(copy.field, copy.shipToPlace, action.cellIndex, copy.orientation);
            action.asyncDispatch(shipPlaced(action.cellIndex, copy.numShip, copy.orientation));
            copy.numShip++;
            if (copy.numShip < consts.NUM_SHIPS_TO_PLACE)
            {
                copy.shipToPlace = consts.SHIPS_TO_PLACE[copy.numShip];
            }
            else{
                copy.shipToPlace = null;
            }
            copy.targetStatus = 'noTarget';

            return copy;
        }

        case 'UNDO_PLACE_SHIP': {
            let copy = Object.assign({}, state, {field: state.field.map(cell => Object.assign({}, cell))});
            copy.numShip--;
            copy.shipToPlace = consts.SHIPS_TO_PLACE[copy.numShip];
            unplaceShipOnField(copy.field, copy.shipToPlace, action.cellIndex, action.orientation);     
            return copy;     
        }


        case 'TURN_SHIP':{
            return Object.assign({}, state, {
                orientation: action.explicitOrientation === undefined ? 
                    (state.orientation === consts.ORIENTATION_HORIZONTAL? consts.ORIENTATION_VERTICAL: consts.ORIENTATION_HORIZONTAL) :
                    action.explicitOrientation });
        }

        default:
          return state;
    }
}

export const shipsApp = combineReducers({
    shipPlacements,
    placedShips,
    battle
  })
  


