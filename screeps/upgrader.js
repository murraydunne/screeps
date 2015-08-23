var STATE_COLLECTING = 'collecting';
var STATE_RETURNING = 'returning';
var STATE_UPGRADING = 'upgrading';
var STATE_TOCONTROLLER = 'tocontroller';

function stateCollecting(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        Game.getObjectById(creep.memory.targetSpawn).transferEnergy(creep);
    } else {
        creep.memory.state = STATE_TOCONTROLLER;
    }
}

function stateReturning(creep) {
    var spawn = Game.getObjectById(creep.memory.targetSpawn);
    
    if (!creep.pos.isNearTo(spawn)) {
        creep.moveTo(spawn);
    } else {
        creep.memory.state = STATE_COLLECTING;
    }
}

function stateToController(creep) {
    if (!creep.pos.isNearTo(creep.room.controller)) {
        creep.moveTo(creep.room.controller);
    } else {
        creep.memory.state = STATE_UPGRADING;
    }
}

function stateUpgrading(creep) {
    if (creep.carry.energy > 0) {
        creep.upgradeController(creep.room.controller);
    } else {
        creep.memory.targetSpawn = creep.pos.findClosest(FIND_MY_SPAWNS).id;
        
        if(!creep.memory.targetSpawn) {
            return;
        }
        
        creep.memory.state = STATE_RETURNING;
    }
}

module.exports = function(creep) {
    if(!creep.memory.state) {
        creep.memory.state = STATE_UPGRADING;
    }
    
    switch(creep.memory.state) {
        case 'collecting':
            stateCollecting(creep);
            break;
        case 'returning':
            stateReturning(creep);
            break;
        case 'tocontroller':
            stateToController(creep);
            break;
        case 'upgrading':
            stateUpgrading(creep);
            break;
        default:
            console.log("Error: upgrader without valid state " + creep.memory.state);
            break;
    }
}