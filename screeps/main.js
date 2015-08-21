var harvester = require('harvester');

if(Object.keys(Game.creeps).length < 10) {
    Game.spawns['spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {'role': 'harvester'});
}

for(var i in Memory.creeps) {
    if(Game.creeps[i].timeToLive <= 0) {
        delete Memory.creeps[i];
    }
}

for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    
    switch(creep.memory.role) {
        case 'harvester':
            harvester(creep);
            break;
    }
}
