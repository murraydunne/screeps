var StateMachine = require('statemachine');

module.exports = function(creep) {
    var machine = new StateMachine(creep, 'gotosource');
    
    machine.addState('gotosource', function(creep) {
        creep.memory.assignedSource = creep.pos.findClosest(FIND_SOURCES_ACTIVE).id;
        
    }, function(creep) {
        var source = Game.getObjectById(creep.memory.assignedSource);
        if (!creep.pos.isNearTo(source)) {
            creep.moveTo(source);
        } else {
            machine.transition('mining');
        }
        
    }, function(creep) { });
    
    machine.addState('mining', function(creep) { }, function(creep) {
        var source = Game.getObjectById(creep.memory.assignedSource);
        
        if (creep.carry.energy < creep.carryCapacity) {
            creep.harvest(source);
        } else {
            creep.dropEnergy(creep.carry.energy);
        }
        
    }, function(creep) { });
    
    return machine;
};