function openSpacesAround(pos) {
    var room = Game.rooms[pos.roomName];
    var objectsInArea = room.lookAtArea(pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1);
    var open = 0;
    
    for(var i in objectsInArea) {
        for(var j in objectsInArea[i]) {
            if(!(i == pos.y && j == pos.x)) { // intentional non-strict equality
                for(var k in objectsInArea[i][j]) {
                    if(objectsInArea[i][j][k]['type'] === 'terrain' && objectsInArea[i][j][k]['terrain'] === 'wall') {
                        open = open + 1;
                    }
                }
            }
        }
    }
    
    return 8 - open;
}

module.exports = function() {
    var sources = Game.spawns['spawn1'].room.find(FIND_SOURCES);
    
    var sourceAssignedCreeps = new Array(sources.length);
    var sourceHaveCreeps = new Array(sources.length);
    
    for(var i = 0; i < sources.length; i++) {
        sourceAssignedCreeps[i] = openSpacesAround(sources[i].pos);
        sourceHaveCreeps[i] = 0;
    }
    
    
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'harvester') {
            for(var i = 0; i < sources.length; i++) {
                if(creep.memory.assignedSource == sources[i].id) {
                    sourceHaveCreeps[i] = sourceHaveCreeps[i] + 1;
                }
            }
        }
    }
    
    for(var i = 0; i < sources.length; i++) {
        var newCreepsNeeded = sourceAssignedCreeps[i] - sourceHaveCreeps[i];
        if(newCreepsNeeded > 0) {
            Game.spawns['spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {
                'role': 'harvester', 
                'assignedSource': sources[i].id
            });
        }
    }
};