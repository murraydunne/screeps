module.exports = function(creep) {
    // Check whether the creep can carry more energy
    if (creep.energy < creep.energyCapacity) {
        // Still can carry some more, go mine the nearest energy source
        var energy = creep.pos.findNearest(Game.SOURCES_ACTIVE);
        if (!creep.pos.isNearTo(energy)) {
            creep.moveTo(energy);
        } else {
            creep.harvest(energy);
        }
    } else {
        // Full of energy, go dump it at the nearest spawn
        var spawn = creep.pos.findNearest(Game.MY_SPAWNS);
        if (!creep.pos.isNearTo(spawn)) {
            creep.moveTo(spawn);
        } else {
            creep.transferEnergy(spawn);
        }
    }
}