var STATE_TOENERGY = 'toenergy';
var STATE_MINING = 'mining';
var STATE_RETURNING = 'returning';
var STATE_DEPOSITING = 'depositing';

function stateToEnergy(creep) {  
    var energy = Game.getObjectById(creep.memory.assignedSource);

    if (!creep.pos.isNearTo(energy)) {
        creep.moveTo(energy);
    } else {
        creep.memory.state = STATE_MINING;
    }
}

function stateMining(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        var energy = Game.getObjectById(creep.memory.assignedSource);
        creep.harvest(energy);
    } else {
        creep.memory.targetSpawn = creep.pos.findClosest(FIND_MY_SPAWNS).id;
        
        if(!creep.memory.targetSpawn) {
            return;
        }
        
        creep.memory.state = STATE_RETURNING;
    }
}

function stateReturning(creep) {
    var spawn = Game.getObjectById(creep.memory.targetSpawn);
    
    if (!creep.pos.isNearTo(spawn)) {
        creep.moveTo(spawn);
    } else {
        creep.memory.state = STATE_DEPOSITING;
    }
}

function stateDepositing(creep) {
    var spawn = Game.getObjectById(creep.memory.targetSpawn);
    
    if (creep.carry.energy > 0) {
        creep.transferEnergy(spawn);
    } else {
        creep.memory.state = STATE_TOENERGY;
    }
}

module.exports = function(creep) {
    if(!creep.memory.state) {
        creep.memory.state = STATE_TOENERGY;
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
        default:
            console.log("Error: harvester without valid state " + creep.memory.state);
            break;
    }
};