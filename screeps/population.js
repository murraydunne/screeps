function calculateSourceBusiness(source) {
    var sourcePos = source.pos;
    var open = 0.0;
    var hasCreep = 0.0;
    var surroundingSquares = [];
    
    surroundingSquares.push(new RoomPosition(sourcePos.x - 1, sourcePos.y - 1, source.room.name));
    surroundingSquares.push(new RoomPosition(sourcePos.x,     sourcePos.y - 1, source.room.name));
    surroundingSquares.push(new RoomPosition(sourcePos.x + 1, sourcePos.y - 1, source.room.name));
    
    surroundingSquares.push(new RoomPosition(sourcePos.x - 1, sourcePos.y    , source.room.name));
    surroundingSquares.push(new RoomPosition(sourcePos.x + 1, sourcePos.y    , source.room.name));
    
    surroundingSquares.push(new RoomPosition(sourcePos.x + 1, sourcePos.y + 1, source.room.name));
    surroundingSquares.push(new RoomPosition(sourcePos.x    , sourcePos.y + 1, source.room.name));
    surroundingSquares.push(new RoomPosition(sourcePos.x - 1, sourcePos.y + 1, source.room.name));
    
    for(var i in surroundingSquares) {
        var pos = surroundingSquares[i];
        
        if(pos && pos.lookFor('terrain').length === 0) {
            console.log('found terrain');
            open = open + 1.0;
        }
        if(pos && pos.lookFor('creep').length > 0) {
            hasCreep = hasCreep + 1.0;
        }
    }
    
    console.log(hasCreep + "/" + open);
    return hasCreep / open;
}

function openSpacesAround(pos) {
    var room = Game.rooms[pos.roomName];
    var objectsInArea = room.lookAtArea(pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1);
    var open = 0;
    
    for(var i in objectsInArea) {
        for(var j in objectsInArea[i]) {
            console.log(i + ' ' + j);
            if(i !== pos.y && j !== pos.x) {
                console.log('ok');
                for(var k in objectsInArea[i][j]) {
                    if(objectsInArea[i][j][k]['type'] === 'terrain' && objectsInArea[i][j][k]['terrain'] === 'wall') {
                        open = open + 1;
                    }
                }
            }
        }
    }
    
    return open;
}

module.exports = function() {
    Game.spawns['spawn1'].room.find(FIND_SOURCES).forEach(function (source) {
        console.log(openSpacesAround(source.pos));
    });
};