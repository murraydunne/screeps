// MUST BE AT THE BEGINNING
// memory cleanup
//for(var i in Memory.creeps) {
//    if(!Game.creeps[i]) {
//        delete Memory.creeps[i];
//    }
//}
//
//// SETUP THE ROLE MAP
//var roleStateMachines = new Object();
//roleStateMachines['miner'] = require('miner');
//
//
//// TEMP
//if(Object.keys(Game.creeps).length < 2) {
//    Game.spawns['spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {
//        role: 'miner'
//    });
//}
//
//for (var name in Game.creeps) {
//    var creep = Game.creeps[name];
//    
//    roleStateMachines[creep.memory.role](creep).run();
//}