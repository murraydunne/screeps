var StateMachine = require('statemachine');

module.exports = function(creep) {
    var machine = new StateMachine(creep, 'getenergy');
    
    machine.addState('getenergy', function(creep) {
        creep.memory.assignedSpawn = creep.pos.findClosest(FIND_MY_SPAWNS).id;
        
    }, function(creep) {
        var spawn = Game.getObjectById(creep.memory.assignedSpawn);
        
        if (creep.carry.energy < creep.carryCapacity) {
            spawn.transferEnergy(creep.carryCapacity - creep.carry.energy);
        } else {
            machine.transition('tocontroller');
        }
        
    }, function(creep) { });
    
    machine.addState('tocontroller', function(creep) { }, function(creep) {
        var controller = creep.room.contoller;
        
        if (!creep.pos.isNearTo(controller)) {
            creep.moveTo(controller);
        } else {
            machine.transition('upgrading');
        }
        
    }, function(creep) { });
    
    machine.addState('upgrading', function(creep) { }, function(creep) {
        if (creep.carry.energy > 0) {
            creep.upgradeController(creep.room.contoller);
        } else {
            machine.transition('tospawn');
        }
    }, function(creep) { });
    
    machine.addState('tospawn', function(creep) { }, function(creep) {
        var spawn = Game.getObjectById(creep.memory.assignedSpawn);
        
        if (!creep.pos.isNearTo(spawn)) {
            creep.moveTo(spawn);
        } else {
            machine.transition('getenergy');
        }
    }, function(creep) { });
    
    return machine;
};