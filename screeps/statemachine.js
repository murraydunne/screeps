var StateMachine = function(creep, startState) {
    this.creep = creep;
    
    if(!this.creep.memory.state) {
        this.creep.memory.stateEntered = false;
        this.creep.memory.state = startState;
    }
    
    this.enterFuncs = new Object();
    this.runFuncs = new Object();
    this.exitFuncs = new Object();
};

StateMachine.prototype = {
    addState: function(name, enter, run, exit) {
        this.enterFuncs[name] = enter;
        this.runFuncs[name] = run;
        this.exitFuncs[name] = exit;
    },
    run: function() {
        if(!this.creep.memory.stateEntered) {
            this.enterFuncs[this.creep.memory.state](this.creep);
        }
        this.runFuncs[this.creep.memory.state](this.creep);
    },
    transition: function(toState) {
        this.exitFuncs[this.creep.memory.state](this.creep);
        this.creep.memory.state = toState;
        this.enterFuncs[this.creep.memory.state](this.creep);
        this.creep.memory.stateEntered = true;
    }
};

module.exports = StateMachine;