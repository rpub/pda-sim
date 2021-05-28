// PDA: (Q, ∑, S, δ, q0, Z)

const { PreconditionRequired } = require("http-errors");

// Q  :         is the finite number of states
// ∑  :         is input alphabet
// S  :         is stack symbols
// δ  :         is the transition function: Q × (∑ ∪ {ε}) × S × Q × S*
// q0 : q0 ∈ Q  is the initial state
// Z  : Z ∈ Γ   is the initial stack top symbol (I ∈ S)

// F is a set of accepting states (F ∈ Q)

// class PDA{
//     constructor(){
//         this.states = [];
//         this.inputAlphabet = [];
//         this.stackSymbols = [];

//         this.sigma = [];    // transition table - δ
//         this.q0 = null;     // initial state

//         this.stack = new Stack();
//         this.tape  = new Tape();
//     }

//     addState(State){
//         if (State.isInitial == true){
//             this.q0 = State;
//         }
//         this.states.push(State);
//     }

//     addInputAlphabet(alphabet){
//         this.inputAlphabet.push(alphabet);
//     }

//     initializeStack(I){
//         this.stack.addToStack(I);
//     }

//     addStackSymbols(symbol){
//         this.stackSymbols.push(symbol);
//     }

//     addTransition(p, a, A, q, α){
//         p.addRule(a, A, q, α);
//         // let transition = new Transition(p, a, A, q, α);
//         // this.sigma.push(transition);
//     }
    
//     accepts(input){

//         this.tape.populate(input);  // load tape
//         return (this.nextState(this.q0));    // load start state into recursive method

//         // this.newTape(input);
//         // -old note 1-
//         // console.log(this.sigma[0].currentState);
//         // console.log(this.sigma[0].nextState);
//         // return 'Accept';
//     }
// }

class PDA{
    constructor(){

        this.states = [];               // Q: arr of states
        this.sigma = new Alphabet();    // ∑: sigma, input alphabet
        this.gamma = new Alphabet();    // Γ: gamma, stack alphabet

        this.q0 = null;                 // q0: start state
        this.Z  = null;                 // Z:  initial stack symbol

        this.stack = new Stack();       // PDA Stack
        this.tape  = new Tape();        // Input Tape
    }

    // TO BUILD A PDA:
    // 1. Add states, recognize start state
    // 2. Define (sigma) input alphabet allowed
    // 3. Define (gamma) stack alphabet allowed
    
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
    stackInit(){
        this.stack.init(this.Z);
    }

    // Initialize tape with string input to be tested 
    tapeInit(string){
        this.tape.init(string);
    }

    // ---
    addTransition(p, a, A, q, α){
        p.addRule(a, A, q, α);
    }
    
    accepts(input){

        this.tape.populate(input);  // load tape
        return (this.nextState(this.q0));    // load start state into recursive method

    }
}

PDA.prototype.nextState = function(state){

    let numRules = state.rules.length;
    let foundMatchingRule = true;

    // IF STATE HAS RULES
    if (numRules > 0){

        // 1. iterate through state's rules
        for (var i = 0; i < numRules; i++){

            // 2. rule in current iterations matches, do stuff
            if (state.rules[i].currentInputChar == this.tape.tapeHead && state.rules[i].topStackSymbol == this.stack.stackHead){

                console.log("Current Scenario       : ");
                console.log("   current state       : " + state.name);
                console.log("   current tapeHead    : " + this.tape.tapeHead);
                console.log("   current stackHead   : " + this.stack.stackHead);
                console.log("   next state          : " + state.rules[i].nextState.name);
                console.log("   ---");
                console.log("   tape    : " + this.tape.remaining);
                console.log("   stack   : " + this.stack.remaining);
                console.log("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");

                // -- Do stuff            
                if(this.tape.tapeHead !== 'ε'){
                    this.tape.removeTopSymbol();
                }
                
                if(state.rules[i].topStackSymbol == 'ε'){
                    this.stack.removeTopSymbol();
                } else {
                    this.stack.removeTopSymbol();
                    this.stack.addToStack(state.rules[i].newTopStackSymbol);
                }
                this.nextState(state.rules[i].nextState);
            }

            // no matching rule for current iteration
            foundMatchingRule = false;
        
        }

        if (foundMatchingRule == false){
            return ([false, "Rules exist, but not for this configuration"]);
        }        
    }
    // IF STATE DOES NOT HAVE RULES
    else {

        if (state.isAccept && this.tape.length == 1){
            return ([true, "Accepted... but only if last char is a member of alphabet"]);
        }
        return ([false, "Accepted"]);
    }
    return ([false, "Accepted"]);
}

// STATE CLASS
class State{
    constructor(name){
        this.name = name;           // State name
        this.isInitial = false;     // I
        this.isAccept = false;      // F
        this.rules = [];
    }

    changeName(name){ this.name = name; }
    setIsInitial()  { this.isInitial = true; }
    setIsAccept(){ this.isAccept = true; }

    addRule(a, A, q, α){
        let rule = new Rule(a, A, q, α);
        this.rules.push(rule);
    }

    // get isAccept(){
    //     return this.isAccept;
    // }
}

// RULE CLASS
class Rule{
    constructor(a, A, q, α){
        this.currentInputChar = a;
        this.topStackSymbol = A;
        this.nextState = q;
        this.newTopStackSymbol = α;
    }
}

// ******************************************************************************************
// ** Stack Class
// ******************************************************************************************

class Stack{
    constructor(){
        // this.stack = [];
        this.slots = [];
    }

    init(Z){
        this.slots.addSlot(Z);
    }

    addSlot(char){
        this.slots.push(new Slot(char));
    }

    pop(){
        this.slots.shift();
    }

    get head(){
        return this.slots[0];
    }

    // -- 
    // addToStack(symbol){
    //     this.stack.push(symbol);
    // }

    // removeTopSymbol(){
    //     this.stack.pop();
    // }

    // get stackHead(){
    //     return this.stack[this.stack.length - 1];
    // }

    // get remaining(){
    //     return this.stack;
    // }

}

// ******************************************************************************************
// ** TAPE CLASS
// ******************************************************************************************

class Tape{
    constructor(){
        // this.tape = [];
        this.slots = [];
    }

    init(string){
        var tmp = string.split();
        for (var i = 0; i < tmp.length; i++){
            this.slots.addSlot(tmp[i]);    
        }
    }

    addSlot(char){
        this.slots.push(new Slot(char));
    }

    pop(){
        this.slots.shift();
    }

    get head(){
        return this.slots[0];
    }

    // -- old methods
    
    // populate(input){
    //     this.tape = input.split("");
    // }

    // removeTopSymbol(){
    //     this.tape.pop();
    // }

    // get tapeHead(){
    //     return this.tape[this.tape.length - 1];
    // }

    // get remaining(){
    //     return this.tape;
    // }
}

// ∑ (Sigma - Input Stack) 
// Γ (Gamma - Stack Tape)
// : both Stack and Tape are comprised of slots
class Slot{
    constructor(symbol){
        this.symbol = new Symbol(symbol);
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
        this.symbols = string.split("");
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

// Symbol Class
class Symbol{
    constructor(char){
        this.char = char;
    }
}

// ∑ (Sigma Symbol) 
class InputSymbol extends Symbol {
    constructor(char){
        super(char);
        this.emptyString = (char == 'ε' ? true: false);
    }
}

// Γ (Gamma Symbol)
class StackSymbol extends Symbol {
    constructor(char){
        super(char);
        this.emptyString = (char == 'ε' ? true: false);
    }
}

// Transition functions in δ (delta) can be represented as another tuple: (p,a,A,q,α).
//  p - current state which is a member of Q
//  a - is the input (Σ∪ϵ) on which the transition is triggered
//  A - is the top stack symbol (a member of Γ (gamma)) 
//  q - next state
//  α - symbol to be pushed to top of stack
// class Transition{
//     constructor(p, a, A, q, α){
//         this.currentState = p;
//         this.currentInputChar = a;
//         this.topStackSymbol = A;
//         this.nextState = q;
//         this.newTopStackSymbol = α;
//     }
// }

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
let q2 = new State('q2');
let q3 = new State('q3'); q3.setIsAccept();

// --- add states
pda.addState(q0);
pda.addState(q1);
pda.addState(q2);
pda.addState(q3);

pda.sigmaInit('ab');    // define input alphabet allowed
pda.gammaInit('ab');    // define stack alphabet allowed

pda.stackInit('Z');     // define first character in stack

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

assert(pda.accepts('bbbaaa'));

// --- add input alphabet
// pda.addInputAlphabet("a");
// pda.addInputAlphabet("b");

// --- add initial stack symbol (I)
// pda.initializeStack('Z');

// // --- add stack symbols
// pda.addStackSymbols("a");
// pda.addStackSymbols("b");

// --- add transitions
// pda.addTransition(q0, 'a', 'Z', q1, 'a');
// pda.addTransition(q1, 'a', 'a', q1, 'a');
// pda.addTransition(q1, 'b', 'a', q2, 'ε');
// pda.addTransition(q2, 'b', 'a', q2, 'ε');
// pda.addTransition(q2, 'ε', 'Z', q3, 'ε');

// assert(pda.accepts("bbbaaa"));

// console.log(pda);
// console.log(pda.sigma[0]);