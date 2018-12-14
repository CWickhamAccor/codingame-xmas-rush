const debug = printErr;
let turnAction;

function printObj(key, object) {
    printErr(`${key} : ${JSON.stringify(object, null, 2)}`);
}

class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get value() {
        return [this.x, this.y];
    }
    get up() {
        const y = this.y > 0 ? this.y - 1 : 6;
        return [this.x, y];
    }
    get down() {
        const y = this.y < 6 ? this.y + 1 : 0;
        return [this.x, y];
    }
    get left() {
        const x = this.x > 0 ? this.x - 1 : 6;
        return [x, this.y];
    }
    get right() {
        const x = this.x < 6 ? this.x + 1 : 0;
        return [x, this.y];
    }
    getRelativePosition(coord) {
        const relPos = [];
        if (coord.x > this.x) { relPos.push(Math.abs(coord.x - this.x) < 3 ? 'LEFT' : 'RIGHT'); }
        if (coord.x < this.x) { relPos.push(Math.abs(coord.x - this.x) < 3 ? 'RIGHT' : 'LEFT'); }
        if (coord.y > this.y) { relPos.push(Math.abs(coord.y - this.y) < 3 ? 'UP' : 'DOWN'); }
        if (coord.y < this.y) { relPos.push(Math.abs(coord.y - this.y) < 3 ? 'DOWN' : 'UP'); }
        return relPos;
    }
    toString() {
        return this.value;
    }
}

class Tile {
    constructor(input) {
        this._value = input;
        this._directions = [];
        this._directionCount = 0;
    }
    get directions() {
        if (this._directions.length > 0) {
            return this._directions;
        }
        ['UP', 'RIGHT', 'DOWN', 'LEFT'].forEach((dir, i) => {
            if (parseInt(this._value[i])) {
                this._directions.push(dir);
            }
        });
        return this._directions;
    }
    get directionCount() {
        return this._directionCount ?
            this._directionCount : this.directions.length;
    }
    get value() {
        return this._value;
    }
    toString() {
        return this._value.toString();
    }
}

class Board {
    constructor() {
        this.tiles = new Map();
        for (let i = 0; i < 7; i++) {
            const inputs = readline().split(' ');
            for (let j = 0; j < 7; j++) {
                const tile = new Tile(inputs[j]);
                const coord = new Coord(j, i);
                this.set(coord, tile);
            }
        }
    }
    get(key) {
        if (key.value) {
            return this.tiles.get(JSON.stringify(key.value));
        }
        return this.tiles.get(JSON.stringify(key));
    }
    set(key, value) {
        if (key.value) {
            this.tiles.set(JSON.stringify(key.value), value);
        } else {
            this.tiles.set(JSON.stringify(key), value);
        }
    }
    print() {
        this.tiles.forEach((value, key) => debug(`${key} : ${value}`));
    }
    validMove(coord, direction) {
        switch (direction) {
            case 'UP':
                return this.get(coord.up).directions.includes('DOWN');
            case 'RIGHT':
                return this.get(coord.right).directions.includes('LEFT');
            case 'DOWN':
                return this.get(coord.down).directions.includes('UP');
            case 'LEFT':
                return this.get(coord.left).directions.includes('RIGHT');
            default:
                debug('ERROR, unknown direction');
                return false;
        }
    }
    getValidMoves(coord) {
        const tile = this.get(coord);
        return tile.directions.filter(dir => this.validMove(coord, dir));
    }
}

class Player {
    constructor(inputs) {
        this.questsCount = parseInt(inputs[0]);
        const x = parseInt(inputs[1]);
        const y = parseInt(inputs[2]);
        this.coord = new Coord(x, y);
        this.tile = new Tile(inputs[3]);
    }
}


function getPlayers() {
    const players = [];
    for (let i = 0; i < 2; i++) {
        const inputs = readline().split(' ');
        players.push(new Player(inputs));
    }
    return players;
}

function getItems() {
    const myItems = [];
    const oppItems = [];
    const numItems = parseInt(readline()); // the total number of items available on board and on player tiles
    for (let i = 0; i < numItems; i++) {
        const inputs = readline().split(' ');
        const item = {
            name: inputs[0],
            coord: new Coord(inputs[1], inputs[2]),
        };
        const playerId = parseInt(inputs[3]);
        playerId ? oppItems.push(item) : myItems.push(item);
    }
    return [myItems, oppItems];
}

function getQuests() {
    const myQuests = [];
    const oppQuests = [];
    const numQuests = parseInt(readline()); // the total number of revealed quests for both players
    for (let i = 0; i < numQuests; i++) {
        const inputs = readline().split(' ');
        const quest = inputs[0];
        const playerId = parseInt(inputs[1]);
        playerId ? oppQuests.push(quest) : myQuests.push(quest);
    }
    return [myQuests, oppQuests];
}

function getPushAction(gameState) {
    const directions = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
    const randDirection = directions[Math.floor(Math.random() * 4)];
    const randId = Math.floor(Math.random() * 7);
    return {
        id: randId,
        direction: randDirection,
    };
}

function getMoveAction(gameState) {
    const move = {
        directions: [],
    };
    const { board, player } = gameState;
    const coord = player.coord;
    const directions = board.getValidMoves(coord);
    if (directions.length === 0) {
        debug('no valid direction');
        return move;
    }
    printObj('available directions', directions);
    const relativePos = player.items.map(item => item.coord.getRelativePosition(player.coord));
    printObj('quest 0 position', relativePos[0]);
    const goodDirections = directions.filter(dir => relativePos[0].includes(dir));
    if (goodDirections.length === 0) {
        debug('no good direction');
        return move;
    }
    const chosenDirection = goodDirections[Math.floor(Math.random() * goodDirections.length)];
    move.directions.push(chosenDirection);
    debug(chosenDirection);
    return move;
}

function think(gameState) {
    if (gameState.turnType === 'PUSH') {
        turnAction = getPushAction(gameState);
    } else {
        turnAction = getMoveAction(gameState);
    }
}

function act(turnType) {
    if (turnType === 'PUSH') {
        const pushQuery = `PUSH ${turnAction.id} ${turnAction.direction}`;
        print(pushQuery);
    }
    if (turnType === 'MOVE') {
        const moveQuery = turnAction.directions.length ? `MOVE ${turnAction.directions.join(' ')}` : 'PASS';
        print(moveQuery);
    }
}

// game loop
while (true) {
    turnAction = { push: {}, move: {} };
    const turnType = parseInt(readline()) ? 'MOVE' : 'PUSH';
    const board = new Board();
    const [player, opponent] = getPlayers();
    const [myItems, oppItems] = getItems();
    const [myQuests, oppQuests] = getQuests();
    player.items = myItems;
    player.quests = myQuests;
    opponent.items = oppItems;
    opponent.quests = oppQuests;
    const gameState = {
        turnType,
        board,
        player,
        opponent,
    };

    // printObj('gameState', gameState);
    // gameState.board.print();

    think(gameState);
    act(turnType);
}
