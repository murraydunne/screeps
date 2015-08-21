var harvester = require('harvester');

if(Game.creeps.length < 10) {
    console.log('creating creep' + Game.spawns['spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {'role': 'harvester'}));
}

for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    console.log('harvester calling');
    harvester(creep);
}
