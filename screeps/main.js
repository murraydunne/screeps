var harvester = require('harvester');
var upgrader = require('upgrader');

var population = require('population');

// MUST BE AT THE BEGINNING
// memory cleanup
for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
}

//if(Object.keys(Game.creeps).length < 10) {
//    Game.spawns['spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {'role': 'harvester'});
//}

for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    
    switch(creep.memory.role) {
        case 'harvester':
            harvester(creep);
            break;
        case 'upgrader':
            upgrader(creep);
            break;
            
    }
}

population();
