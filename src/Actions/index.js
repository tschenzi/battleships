

export const tryPlaceShip = (cellIndex) => {
    return {
        type: 'TRY_PLACE_SHIP',
        cellIndex
    }
}

export const untryShip = (cellIndex) => {
    return{
        type: 'UNTRY_SHIP',
        cellIndex
    }
}

export const placeShip = (cellIndex) => {
    return{
        type: 'PLACE_SHIP',
        cellIndex
    }
} 

export const mouseOverFieldcell = cellIndex => (
    { type: 'BATTLE_MOUSE_OVER_CELL',
      cellIndex }
)

export const mouseOutFieldcell = cellIndex => (
    { type: 'BATTLE_MOUSE_OUT_CELL',
      cellIndex }
)

export const clickOnFieldcell = cellIndex => (
    { type: 'BATTLE_CLICK_ON_CELL',
      cellIndex }
)

export const shipPlaced = (cellIndex, numShip, orientation) => {
    return{
        type: 'SHIP_PLACED',
        cellIndex,
        numShip,
        orientation,
    }
} 

export const undoPlaceShip = (cellIndex, orientation) => {
    return{
        type: 'UNDO_PLACE_SHIP',
        cellIndex,
        orientation,
    }
} 

export const turnShip = (explicitOrientation) => {
    return{
        type: 'TURN_SHIP',
        explicitOrientation
    }
}

export const computerAim = () => ({type: 'BATTLE_COMPUTER_AIM'});
export const computerShoot = () => ({type: 'BATTLE_COMPUTER_SHOOT'});
export const computerShootResult = () => ({type: 'BATTLE_COMPUTER_SHOOT_RESULT'});
export const playerShootResult = () => ({type: 'BATTLE_PLAYER_SHOOT_RESULT'});

export const autoPlacement = () => {return{type: 'AUTO_PLACEMENT'};};

export const startGame = (myShips) => {return{type: 'START_GAME', playerShips: myShips}}