const debug = printErr;
let turnAction;

function printObj(key, object) {
    printErr(`${key} : ${JSON.stringify(object, null, 2)}`);
}

class Board {
    constructor() {
        this.tiles = new Map();
        for (let i = 0; i < 7; i++) {
            const inputs = readline().split(' ');
            for (let j = 0; j < 7; j++) {
                const tile = inputs[j];
                this.set([j, i], tile);
            }
        }
    }
    get(key) {
        return this.tiles.get(JSON.stringify(key));
    }
    set(key, value) {
        this.tiles.set(JSON.stringify(key), value);
    }
    print() {
        this.tiles.forEach((value, key) => debug(`${key} : ${value}`));
    }
}

class Player {
    constructor(inputs) {
        this.questsCount = parseInt(inputs[0]);
        this.x = parseInt(inputs[1]);
        this.y = parseInt(inputs[2]);
        this.tile = inputs[3];
    }
    get coord() {
        return [this.x, this.y];
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
            x: parseInt(inputs[1]),
            y: parseInt(inputs[2]),
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

function hasPath(tile, direction) {
    switch(direction) {
        case 'top':
            return parseInt(tile[0]);
        case 'right':
            return parseInt(tile[1]);
        case 'bot':
            return parseInt(tile[2]);
        case 'left':
            return parseInt(tile[3]);
        default:
            return false;
    }
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
    printObj('coord', player.coord);
    printObj('tile', board.get([0, 0]));
    if (hasPath(player.tile, 'right')) {
        move.directions.push('RIGHT');
        debug('RIGHT');
    }
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

    printObj('gameState', gameState);
    gameState.board.print();

    think(gameState);
    act(turnType);
}
