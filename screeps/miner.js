var StateMachine = require('statemachine');

module.exports = function(creep) {
    var minerMachine = new StateMachine(creep, 'gotosource');
    
    minerMachine.addState('gotosource', function(creep) {
        creep.memory.assignedSource = creep.pos.findClosest(FIND_SOURCES_ACTIVE).id;
        
    }, function(creep) {
        var source = Game.getObjectById(creep.memory.assignedSource);
        if (!creep.pos.isNearTo(source)) {
            creep.moveTo(source);
        } else {
            minerMachine.transition('mining');
        }
        
    }, function(creep) { });
    
    minerMachine.addState('mining', function(creep) { }, function(creep) {
        var source = Game.getObjectById(creep.memory.assignedSource);
        
        if (creep.carry.energy < creep.carryCapacity) {
            creep.harvest(source);
        } else {
            creep.dropEnergy(creep.carry.energy);
        }
        
    }, function(creep) { });
    
    return minerMachine;
};