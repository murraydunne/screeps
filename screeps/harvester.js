function spawnsInRoom(room) {
    return room.find(FIND_SOURCES_ACTIVE);
}

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

module.exports = function(creep) {
    // Check whether the creep can carry more energy
    if (creep.carry.energy < creep.carryCapacity) {
        // Still can carry some more, go mine the nearest energy source
        var energy = creep.pos.findClosest(FIND_SOURCES_ACTIVE);
        
        if(energy) {
            console.log(calculateSourceBusiness(energy));

            if (!creep.pos.isNearTo(energy)) {
                creep.moveTo(energy);
            } else {
                creep.harvest(energy);
            }
        }
    } else {
        // Full of energy, go dump it at the nearest spawn
        var spawn = creep.pos.findClosest(FIND_MY_SPAWNS);
        
        if(spawn && spawn.energy < spawn.energyCapacity) {
            if (!creep.pos.isNearTo(spawn)) {
                creep.moveTo(spawn);
            } else {
                creep.transferEnergy(spawn);
            }
        } else {
            var controller = creep.room.controller;
            if (creep.pos.isNearTo(controller)) {
                console.log("upgrading controller");
                creep.upgradeController(controller);
            } else {
                creep.moveTo(controller);
            }
        }
    }
}