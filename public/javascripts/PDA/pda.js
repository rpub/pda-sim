// PDA: (Q, ∑, S, δ, q0, Z)

// Q  :         is the finite number of states
// ∑  :         is input alphabet
// S  :         is stack symbols
// δ  :         is the transition function: Q × (∑ ∪ {ε}) × S × Q × S*
// q0 : q0 ∈ Q  is the initial state
// Z  : Z ∈ Γ   is the initial stack top symbol (I ∈ S)

// F is a set of accepting states (F ∈ Q)

import Alphabet from './alphabet.js';
import Stack from './stack.js';
import Tape from './tape.js';
import State from './state.js';
import Graph from '../graph.js';

export default class PDA{
    constructor(){
        this.states = [];               // Q: arr of states
        this.sigma = new Alphabet();    // ∑: sigma, input alphabet
        this.gamma = new Alphabet();    // Γ: gamma, stack alphabet

        this.q0 = null;                 // q0: start state
        this.Z  = null;                 // Z:  initial stack symbol

        this.stack = new Stack();       // PDA Stack
        this.tape  = new Tape();        // Input Tape

        this.graph = new Graph();         // Creates a graph

        this.success = null;
    }

    // add new state
    addState(state){
        if (state.isInitial == true){
            this.q0 = state;
        }
        this.states.push(state);
        this.refresh();
    }
    
    // find state by name, return state object
    getState(name){
        for (var i = 0; i < this.states.length; i++){
            if(this.states[i].name == name){
                return this.states[i];
            }
        }
    }
    // find state by name, remove state object
    removeState(name){
        var state = this.getState(name);
        for(var i = 0; i < this.states.length; i++){
            if (this.states[i] === state) { 
                this.states.splice(i, 1);
            }
        }
        this.refresh();
    }

    // find state by name, set as accept state
    setIsAcceptState(name){
        this.getState(name).isAccept = true;
    }
    // get state object, set as ! accept state
    setIsNotAcceptState(name){
        this.getState(name).isAccept = false;
    }

    // get accept state object
    getStart(){
        return this.q0;
    }

    // get state obj with name, set = q0
    setStartState(name){
        this.q0 = this.getState(name);
    }
    // get stack obj with name, set = Z
    setStartStackSymbol(name){
        this.Z = this.gamma.getSymbol(name);
    }

    // initialize input alphabet allowed
    sigmaInit(string){
        this.sigma.addSymbols(string);
    }
    // add input alphabet symbol
    sigmaAdd(char){
        this.sigma.addSymbol(char);
    }
    // add input alphabet symbol (same as sigmaAdd - todo: conosolidate)
    addSigma(char){
        this.sigma.addSymbol(char);
    }
    // get copy of input symbols (char, not object)
    getSigmaArr(){
        return this.sigma.getSymbols();
    }
    // remove input symbol
    removeSigma(char){
        this.sigma.removeSymbol(char);
    }

    // initialize stack alphabet allowed
    gammaInit(string){
        this.gamma.addSymbols(string);
    }
    // add stack alphabet symbol
    gammaAdd(char){
        this.gamma.addSymbol(char);
    }
    // add stack alphabet symbol (todo: consolidate)
    addGamma(char){
        this.gamma.addSymbol(char);
    }
    // get copy of stack symbols (arr w/ chars, not objects)
    getGammaArr(){
        return this.gamma.getSymbols();
    }
    // remove input symbol
    removeGamma(char){
        this.gamma.removeSymbol(char);
    }

    // --- initialize stack with Z, the start char for a stack
    stackInit(){
        this.stack.init(this.Z);
        // this.Z = this.stack.slots[0].symbol.char;
    }
    // --- initialize tape with string input to be tested 
    tapeInit(string){
        this.tape.init(string);
    }

    // add transition rule to state p
    addTransition(p, a, A, q, α){
        p.addRule(a, A, q, α);
        this.refresh();
    }

    // update graph
    refresh(){

        // new graph
        this.graph = new Graph();
        
        // add all states
        for (var i = 0; i < this.states.length; i++){
            if(this.states[i] == this.q0 && this.states[i].isAccept == true){
                // add accept AND start state node
                this.graph.addStartAcceptNode(this.states[i].name);
            } else if (this.states[i] == this.q0){
                // add start state node
                this.graph.addStartNode(this.states[i].name);                
            } else if (this.states[i].isAccept == true){
                // add accept state node
                this.graph.addAcceptNode(this.states[i].name);
            } else {
                // add regular state node
                this.graph.addNode(this.states[i].name);
            }
        }

        // add all edges
        for(var i = 0; i < this.states.length; i++){
            // current state
            var state = this.states[i];
            // if current state hude rules
            if (state.hasRules()){
                // current state rules
                var rules = state.getRules();
                for (var j = 0; j < rules.length; j++){
                    // transition (edge) label
                    var label = (rules[j].currentInputChar + ' , ' + rules[j].topStackSymbol + ' \u2192 ' + rules[j].newTopStackSymbol);
                    this.graph.addEdge(label, state.name, rules[j].nextState.name);
                }
            } else {
                // state does not have any rules
            }
        }
        // regenerate graph    
        this.graph.generate();
    }

}

// Accepts method
PDA.prototype.accepts = function(input){
    this.stackInit();
    this.tapeInit(input);
    const status = this.nextState(this.q0);
    return (status);
}

// Next state recursive
PDA.prototype.nextState = function(state){

    this.logCurrentIter(state);             // log current iteration to console
    this.proceed = true;                    // continue while true
    this.status = null;                     // status to be returned
    
    let a = this.tape.head.symbol.char;     // current tape slot 
    let b = this.stack.head.symbol.char;    // current stack slot

    // 1. Input string is accepted if
    //    : current state is accept state
    //    : && stack is empty
    //    : && only one char left in tape
    //    : && char left is in alphabet
    if (state.isAcceptable(this)){
        this.proceed = false;
        this.status = [true, ("Accepted [" + b + "] in state [" + state.name + "]")];
    }

    console.log("Proceed status: " + this.proceed);

    if (this.proceed === true){

        if (state.hasRule(a, b)){

            var rule = state.findRule(a, b);
            var c = rule.newTopStackSymbol;

            console.log("-------------------");
            console.log(rule);
            console.log("-------------------");
            console.log("Next state     : " + rule.nextState.name);
            console.log("New stack char : " + c);
            console.log("-------------------");

            if (c == 'ε'){
                this.stack.pop();
            } else if (c == b || c == this.Z){
                this.stack.pop();
                this.stack.addSlot(c);
            } else {
                this.stack.addSlot(c);
            }

            if (a != 'ε' || b!= this.Z){
                this.tape.consume();
            }

            this.nextState(rule.nextState);

        } else {
            this.status = [false, ("Rejected [" + b + "] in state [" + state.name + "]")];
        }
    }
    return this.status;
}

// Logger
PDA.prototype.logCurrentIter = function(state){
    console.log("__________________________________________________________________");
    console.log("Current Iteration: ");
    console.log("  state          : " + state.name);
    console.log("  tape slot      : " + this.tape.head.symbol.char);
    console.log("  stack slot     : " + this.stack.head.symbol.char);
    console.log("  tape           : " + JSON.stringify(this.tape));
    console.log("  stack          : " + JSON.stringify(this.stack));
}