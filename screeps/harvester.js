function spawnsInRoom(room) {
    return room.find(FIND_SOURCES_ACTIVE);
}

function calculateSourceBusiness(spawn) {
    var spawnPos = spawn.pos;
    var open = 0.0;
    var hasCreep = 0.0
    var surroundingSquares = [];
    
    surroundingSquares.append(RoomPosition(spawnPos.x - 1, spawnPos.y - 1));
    surroundingSquares.append(RoomPosition(spawnPos.x,     spawnPos.y - 1));
    surroundingSquares.append(RoomPosition(spawnPos.x + 1, spawnPos.y - 1));
    
    surroundingSquares.append(RoomPosition(spawnPos.x - 1, spawnPos.y));
    surroundingSquares.append(RoomPosition(spawnPos.x + 1, spawnPos.y));
    
    surroundingSquares.append(RoomPosition(spawnPos.x + 1, spawnPos.y + 1));
    surroundingSquares.append(RoomPosition(spawnPos.x    , spawnPos.y + 1));
    surroundingSquares.append(RoomPosition(spawnPos.x - 1, spawnPos.y + 1));
    
    for(var pos in surroundingSquares) {
        if(pos && pos.lookFor('terrain').length == 0) {
            open = open + 1.0;
        }
        if(pos && pos.lookFor('creep').length > 0) {
            hasCreep = hasCreep + 1.0;
        }
    }
    
    return hasCreep / open;
}

module.exports = function(creep) {
    // Check whether the creep can carry more energy
    if (creep.carry.energy < creep.carryCapacity) {
        // Still can carry some more, go mine the nearest energy source
        var energy = creep.pos.findClosest(FIND_SOURCES_ACTIVE);
        console.log(calculateSourceBusiness(energy));
        if (!creep.pos.isNearTo(energy)) {
            creep.moveTo(energy);
        } else {
            creep.harvest(energy);
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
            if (!creep.pos.isNearTo(controller)) {
                creep.moveTo(controller);
            } else {
                creep.transferEnergy(controller);
            }
        }
    }
}