// MUST BE AT THE BEGINNING
// memory cleanup
for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
}

// SETUP THE ROLE MAP
var roleStateMachines = new Object();
roleStateMachines['miner'] = require('miner');
roleStateMachines['collector'] = require('collector');


// TEMP
function howMay(role) {
    var count = 0;
    for(var name in Game.creeps) {
        if(Game.creeps[name].memory.role === role) {
            count++;
        }
    }
    return count;
}

if(howMay('miner') < 2) {
    Game.spawns['spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {
        role: 'miner'
    });
} else if(howMany('collector') < 2) {
    Game.spawns['spawn1'].createCreep([CARRY, CARRY, MOVE, MOVE], undefined, {
        role: 'collector'
    });
}

for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    
    roleStateMachines[creep.memory.role](creep).run();
}