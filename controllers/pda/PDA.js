// PDA: (Q, ∑, S, δ, q0, Z)

// Q  :         is the finite number of states
// ∑  :         is input alphabet
// S  :         is stack symbols
// δ  :         is the transition function: Q × (∑ ∪ {ε}) × S × Q × S*
// q0 : q0 ∈ Q  is the initial state
// Z  : Z ∈ Γ   is the initial stack top symbol (I ∈ S)

// F is a set of accepting states (F ∈ Q)

class Machine{

    constructor(PDA, Stack, Tape){

        this.pda = PDA;
        this.stack = Stack;
        this.tape = Tape;

        this.outcome = null;
    }

    parse(input){
        
    }

}

class PDA{
    constructor(){
        this.states = [];               // Q: arr of states
        this.sigma = new Alphabet();    // ∑: sigma, input alphabet
        this.gamma = new Alphabet();    // Γ: gamma, stack alphabet

        this.q0 = null;                 // q0: start state
        this.Z  = null;                 // Z:  initial stack symbol

        this.stack = new Stack();       // PDA Stack
        this.tape  = new Tape();        // Input Tape

        this.success = null;
    }
      
    // Add state
    addState(State){
        if (State.isInitial == true){
            this.q0 = State;
        }
        this.states.push(State);
    }

    // Initialize input alphabet allowed
    sigmaInit(string){
        this.sigma.addSymbols(string);
    }

    // Initialize stack alphabet allowed
    gammaInit(string){
        this.gamma.addSymbols(string);
    }

    // Initialize stack with Z, the start char for a stack
    stackInit(z){
        this.stack.init(z);
        this.Z = this.stack.slots[0].symbol.char;
    }

    // Initialize tape with string input to be tested 
    tapeInit(string){
        this.tape.init(string);
    }

    // Add transition rule to state p
    addTransition(p, a, A, q, α){
        p.addRule(a, A, q, α);
    }

    // accepts(input){

    //     this.tapeInit(input);
    //     return(this.nextStateWrapper(this.q0));
    //     // var outcome = this.nextStateWrapper(this.q0);
    //     // console.log("outcome back:" + outcome);
        
    //     // return (outcome);    // load start state into recursive method
    // }
}

// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************
// ** Controller
// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************

// a, b -> c
// a = current input
// b = current stack
// c = new stack char

// If a is ε, the machine may make this transition without reading any symbol from the input. 
// If b is ε, the machine may make this transition without reading and popping any symbol from the stack. 
// If c is ε, the machine does not write any symbol on the stack when going along this transition.

PDA.prototype.accepts = function(input){
    this.tapeInit(input);
    const status = this.nextState(this.q0);
    return (status);
}

PDA.prototype.nextState = function(state){

    this.logCurrentIter(state);             // Log current iter to console
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
    // console.log(this.status);
    return this.status;
}

PDA.prototype.logCurrentIter = function(state){
    console.log("__________________________________________________________________");
    console.log("Current Iteration: ");
    console.log("  state          : " + state.name);
    console.log("  tape slot      : " + this.tape.head.symbol.char);
    console.log("  stack slot     : " + this.stack.head.symbol.char);
    console.log("  tape           : " + JSON.stringify(this.tape));
    console.log("  stack          : " + JSON.stringify(this.stack));
}

// ******************************************************************************************
// ** STATE CLASS
// ******************************************************************************************

class State{
    constructor(name){
        this.name = name;           // State name
        this.isInitial = false;     // I
        this.isAccept = false;      // F
        this.rules = [];
    }

    changeName(name){ 
        this.name = name; 
    }

    setIsInitial()  { 
        this.isInitial = true; 
    }
    
    setIsAccept(){ 
        this.isAccept = true; 
    }

    addRule(a, A, q, α){
        let rule = new Rule(a, A, q, α);
        this.rules.push(rule);
    }

    findRule(tapeSlot, stackSlot){
        for (var i = 0; i < this.rules.length; i++){
            if(this.rules[i].currentInputChar == tapeSlot && this.rules[i].topStackSymbol == stackSlot){
                return this.rules[i];
            }
        }
        return false;
    }

    hasRules(){
        if (this.rules.length > 0){
            return true;
        } else if (this.rules.length == 0){
            return false;
        }
    }

    // check if rule exists
    hasRule(tapeSlot, stackSlot){
        for (var i = 0; i < this.rules.length; i++){
            if(this.rules[i].currentInputChar == tapeSlot && this.rules[i].topStackSymbol == stackSlot){
                return true;
            }
        }
        return false;
    }

    isAcceptable(pda){
        var x = pda.tape.slotsRemaining();
        var y = pda.stack.slotsRemaining();

        if (this.isAccept == true && x == 1 && y == 1){
            return true;
        } else {
            return false;
        }       
    }
}

// ******************************************************************************************
// ** TRANSITION RULE CLASS
// ******************************************************************************************
class Rule{
    constructor(a, A, q, α){
        this.currentInputChar = a;
        this.topStackSymbol = A;
        this.nextState = q;
        this.newTopStackSymbol = α;
    }    
}

// ******************************************************************************************
// ** STACK CLASS
// ******************************************************************************************
class Stack{
    constructor(){
        this.slots = [];
    }
    
    init(z){
        this.addSlot(z);
    }

    addSlot(char){
        this.slots.push(new Slot(char));
    }

    pop(){
        this.slots.pop();
    }

    slotsRemaining(){
        return (this.slots.length);
    }

    get head(){
        return this.slots[this.slots.length - 1];
    }
}

// ******************************************************************************************
// ** TAPE CLASS
// ******************************************************************************************
class Tape{
    constructor(){
        this.slots = [];
    }

    init(string){
        var tmp = string.split("");
        for (var i = 0; i < tmp.length; i++){
            this.addSlot(tmp[i]);    
        }
    }

    addSlot(char){
        this.slots.push(new Slot(char));
    }

    consume(){
        this.slots.shift();
    }

    slotsRemaining(){
        return (this.slots.length);
    }

    get head(){
        return this.slots[0];
    }

}

// ******************************************************************************************
// ** SLOT CLASS
// ******************************************************************************************
class Slot{
    constructor(symbol){
        this.symbol = new Symbol(symbol);
    }
}

// ******************************************************************************************
// ** SYMBOL CLASS
// ******************************************************************************************
class Symbol{
    constructor(char){
        this.char = char;
    }
}

// ******************************************************************************************
// PDA GRAMMER CLASSES: ALPHABET, SYMBOL: INPUTSYMBOL, STACKSYMBOL
// ******************************************************************************************

// ∑ (Sigma - Input Alphabet) 
// Γ (Gamma - Stack Alphabet)
// : the set of acceptable symbols
class Alphabet{
    constructor(){
        this.symbols = [];
    }

    addSymbols(string){
        var tmp = string.split("");
        for (var i = 0; i < tmp.length; i++){
            this.addSymbol(tmp[i]);    
        }
    }

    addSymbol(char){
        this.symbols.push(new Symbol(char));
    }

    isMember(symbol){
        for (var i = 0; i < this.symbols.length; i++){
            if (symbol == this.symbols[i]){
                return true;
            }
        }
        return false;
    }
}

// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************
// ** TESTING GROUNDS
// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************

// --- new pda
let pda = new PDA();

// --- new states
let q0 = new State('q0'); q0.setIsInitial();
let q1 = new State('q1'); 
let q2 = new State('q2'); q2.setIsAccept();
let q3 = new State('q3'); q3.setIsAccept();

// --- add states
pda.addState(q0);
pda.addState(q1);
pda.addState(q2);
pda.addState(q3);

pda.sigmaInit('ab');    // define input alphabet allowed
pda.gammaInit('ab');    // define stack alphabet allowed

pda.stackInit('Z');     // define first character in stack

pda.addTransition(q0, 'ε', 'Z', q1, 'ε');
pda.addTransition(q0, 'a', 'Z', q1, 'a');
pda.addTransition(q1, 'a', 'a', q1, 'a');
pda.addTransition(q1, 'b', 'a', q2, 'ε');
pda.addTransition(q2, 'b', 'a', q2, 'ε');
pda.addTransition(q2, 'ε', 'Z', q3, 'ε');

// ******************************************************************************************
// ** Assert 
// ******************************************************************************************
function assert(outcome){
    console.log((outcome[0] ? 'Accept:' : 'Reject:'),  outcome[1]);
}

assert(pda.accepts('aaabbb'));

// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************
// ******************************************************************************************

// if (b == this.Z){
//     // do stuff
//     // if (a == 'ε'){
//     // } else if (c == 'ε'){
//     //     this.tape.consume();
//     //     this.stack.pop();
//     // } else {
//     //     this.tape.consume();
//     //     this.stack.addSlot(c);
//     // }
// } else {
//     if (a == 'ε'){
//         this.tape.consume();
//         // this.stack.pop();
//     } else if (b == 'ε'){
//         this.tape.consume();
//         this.stack.addSlot(c);
//     } else if (c == 'ε'){
//         this.tape.consume();
//         this.stack.pop();
//         this.stack.addSlot(c);
//     } else {
//         this.tape.consume();
//         this.stack.pop();
//         this.stack.addSlot(c);
//     }    
// }

// if (this.stack.head.symbol.char == this.Z){
    
//     if (rule.topStackSymbol == 'ε'){
//         console.log("   : if b == ε, don't pop or consume");
    
//     } else if (rule.newTopStackSymbol == 'ε'){
//         console.log("   : can't pop when stack is empty");
//     }

//     console.log("   : inside stack head");
//     this.stack.addSlot(rule.newTopStackSymbol);

// } else {

//     if (rule.topStackSymbol == 'ε'){
//         console.log("   : if b == ε, don't pop or consume");
//     } else if (rule.newTopStackSymbol == 'ε'){
//         this.stack.pop();
//     } else {
//         this.stack.pop();
//         this.stack.addSlot(rule.newTopStackSymbol);
//     }
//     console.log("   : not in stack head");
// }
