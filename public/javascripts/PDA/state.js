import Rule from './rule.js'

export default class State{
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
    setIsNotAccept(){
        this.isAccept = false;
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

    // check if state has any rules
    hasRules(){
        if (this.rules.length > 0){
            return true;
        } else if (this.rules.length == 0){
            return false;
        }
    }

    // get state's rules in an array 
    getRules(){
        return this.rules;
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