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
    var open = 0;
    
    if(new RoomPosition(pos.x - 1, pos.y - 1, pos.roomName).lookFor('terrain').length) {
        open = open + 1;
    }
    if(new RoomPosition(pos.x    , pos.y - 1, pos.roomName).lookFor('terrain').length) {
        open = open + 1;
    }
    if(new RoomPosition(pos.x + 1, pos.y - 1, pos.roomName).lookFor('terrain').length) {
        open = open + 1;
    }
    if(new RoomPosition(pos.x - 1, pos.y    , pos.roomName).lookFor('terrain').length) {
        open = open + 1;
    }
    if(new RoomPosition(pos.x + 1, pos.y    , pos.roomName).lookFor('terrain').length) {
        open = open + 1;
    }
    if(new RoomPosition(pos.x - 1, pos.y + 1, pos.roomName).lookFor('terrain').length) {
        open = open + 1;
    }
    if(new RoomPosition(pos.x    , pos.y + 1, pos.roomName).lookFor('terrain').length) {
        open = open + 1;
    }
    if(new RoomPosition(pos.x + 1, pos.y + 1, pos.roomName).lookFor('terrain').length) {
        open = open + 1;
    }
    
    return open;
}

module.exports = function() {
    Game.spawns['spawn1'].room.find(FIND_SOURCES).forEach(function (source) {
        console.log(openSpacesAround(source.pos));
    });
};