const debug = printErr;
let turnActions;

function printObj(key, object) {
    printErr(`${key} : ${JSON.stringify(object, null, 2)}`);
}

function printMap(map) {
    map.forEach((value, key) => debug(`[${key}] : ${value}`));
}

function getBoard() {
    const board = new Map();
    for (let i = 0; i < 7; i++) {
        const inputs = readline().split(' ');
        for (let j = 0; j < 7; j++) {
            const tile = inputs[j];
            board.set([i, j], tile);
        }
    }
    return board;
}

function getPlayers() {
    const players = [];
    for (let i = 0; i < 2; i++) {
        const inputs = readline().split(' ');
        const player = {
            numCard: parseInt(inputs[0]),
            x: parseInt(inputs[1]),
            y: parseInt(inputs[2]),
            tile: inputs[3],
        };
        players.push(player);
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

// game loop
while (true) {
    turnActions = [];
    const turnType = parseInt(readline()) ? 'MOVE' : 'PUSH';
    const board = getBoard();
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
    printMap(gameState.board);

    if (gameState.turnType === 'PUSH') {
        print('PUSH 0 LEFT'); // PUSH <id> <direction> | MOVE <direction> | PASS
    } else {
        print('PASS');
    }
}
