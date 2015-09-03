var StateMachine = require('statemachine');

module.exports = function(creep) {
    var machine = new StateMachine(creep, 'gotoenergy');
    
    machine.addState('gotoenergy', function(creep) {
        creep.memory.assignedEnergy = creep.pos.findClosest(FIND_DROPPED_ENERGY).id;
        
    }, function(creep) {
        var energy = Game.getObjectById(creep.memory.assignedEnergy);
        if (!creep.pos.isNearTo(energy)) {
            creep.moveTo(energy);
        } else {
            creep.pickup(energy);
            machine.transition('returnenergy');
        }
        
    }, function(creep) { 
        delete creep.memory.assignedEnergy;
        
    });
    
    machine.addState('returnenergy', function(creep) { 
        creep.memory.assignedSpawn = creep.pos.findClosest(FIND_MY_SPAWNS).id;
        
    }, function(creep) {
        var spawn = Game.getObjectById(creep.memory.assignedSpawn);
        
        if (!creep.pos.isNearTo(spawn)) {
            creep.moveTo(spawn);
        } else {
            machine.transition('depositenergy');
        }
    }, function(creep) { });
    
    machine.addState('depositenergy', function(creep) { }, function(creep) {
        var spawn = Game.getObjectById(creep.memory.assignedSpawn);
        
        if (creep.carry.energy > 0) {
            creep.transferEnergy(spawn);
        } else {
            machine.transition('gotoenergy');
        }
    }, function(creep) { 
        delete creep.memory.assignedSpawn;
        
    });
    
    return machine;
};