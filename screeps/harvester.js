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

function stateToEnergy(creep) {
    if(!creep.memory.targetEnergy) {
        creep.memory.targetEnergy = creep.pos.findClosest(FIND_SOURCES_ACTIVE).id;
        
        if(!creep.memory.targetEnergy) {
            return;
        }
    }
    
    var energy = Game.getObjectById(creep.memory.targetEnergy);
    
    console.log(calculateSourceBusiness(energy));

    if (!creep.pos.isNearTo(energy)) {
        creep.moveTo(energy);
    } else {
        creep.memory.state = 'mining';
    }
}

function stateMining(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        var energy = Game.getObjectById(creep.memory.targetEnergy);
        creep.harvest(energy);
    } else {
        creep.memory.targetSpawn = creep.pos.findClosest(FIND_MY_SPAWNS).id;
        
        if(!creep.memory.targetSpawn) {
            return;
        }
        
        var spawn = Game.getObjectById(creep.memory.targetSpawn);
        
        if(spawn.energy < spawn.energyCapacity) {
            creep.memory.state = 'returning';
        } else {
            creep.memory.state = 'tocontroller';
        }
    }
}

function stateReturning(creep) {
    var spawn = Game.getObjectById(creep.memory.targetSpawn);
    
    if (!creep.pos.isNearTo(spawn)) {
        creep.moveTo(spawn);
    } else {
        creep.memory.state = 'depositing';
    }
}

function stateDepositing(creep) {
    var spawn = Game.getObjectById(creep.memory.targetSpawn);
    
    if (creep.carry.energy > 0) {
        creep.transferEnergy(spawn);
    } else {
        creep.memory.state = 'toenergy';
    }
}

function stateToController(creep) {
    if (!creep.pos.isNearTo(creep.room.controller)) {
        creep.moveTo(creep.room.controller);
    } else {
        creep.memory.state = 'upgrading';
    }
}

function stateUpgrading(creep) {
    if (creep.carry.energy > 0) {
        creep.upgradeController(creep.room.controller);
    } else {
        creep.memory.state = 'toenergy';
    }
}

module.exports = function(creep) {
    if(!creep.memory.state) {
        creep.memory.state = 'toenergy';
    }
    
    switch(creep.memory.state) {
        case 'toenergy':
            stateToEnergy(creep);
            break;
        case 'mining':
            stateMining(creep);
            break;
        case 'returning':
            stateReturning(creep);
            break;
        case 'depositing':
            stateDepositing(creep);
            break;
        case 'tocontroller':
            stateToController(creep);
            break;
        case 'upgrading':
            stateUpgrading(creep);
            break;
        default:
            console.log("Error: harvester without valid state " + creep.memory.state);
            break;
    }
}