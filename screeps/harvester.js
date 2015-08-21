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
        creep.memory.targetEnergy = creep.pos.findClosest(FIND_SOURCES_ACTIVE);
        
        if(!creep.memory.targetEnergy) {
            return;
        }
    }
    
    console.log(calculateSourceBusiness(creep.memory.targetEnergy));

    if (!creep.pos.isNearTo(creep.memory.targetEnergy)) {
        creep.moveTo(creep.memory.targetEnergy);
    } else {
        creep.memory.state = 'mining';
    }
}

function stateMining(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        creep.harvest(creep.memory.targetEnergy);
    } else {
        creep.memory.targetSpawn = creep.pos.findClosest(FIND_MY_SPAWNS);
        
        if(!creep.memory.targetSpawn) {
            return;
        }
        
        if(creep.memory.targetSpawn.energy < creep.memory.targetSpawn.energyCapacity) {
            creep.memory.state = 'returning';
        } else {
            creep.memory.state = 'tocontroller';
        }
    }
}

function stateReturning(creep) {
    if (!creep.pos.isNearTo(creep.memory.targetSpawn)) {
        creep.moveTo(creep.memory.targetSpawn);
    } else {
        creep.memory.state = 'depositing';
    }
}

function stateDepositing(creep) {
    if (creep.carry.energy > 0) {
        creep.transferEnergy(creep.memory.targetSpawn);
    } else {
        creep.memory.state = 'toenergy';
    }
}

function stateToController(creep) {
    if (!creep.pos.isNearTo(creep.room.controller)) {
        creep.moveTo(creep.memory.targetSpawn);
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