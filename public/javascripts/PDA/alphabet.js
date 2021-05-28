import Symbol from './symbol.js'

// ∑ (Sigma - Input Alphabet) 
// Γ (Gamma - Stack Alphabet)
// : the set of acceptable symbols

export default class Alphabet{
    constructor(){
        this.symbols = [];
        this.addSymbol('ε');
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

    // pulls gets Symbol name from obj, returns text arr
    getSymbols(){
        var retVal = [];
        for (var i = 0; i < this.symbols.length; i++){
            retVal.push(this.symbols[i].char);
        }
        return retVal;
    }
    
    isMember(symbol){
        for (var i = 0; i < this.symbols.length; i++){
            if (symbol == this.symbols[i]){
                return true;
            }
        }
        return false;
    }

    // Find by name, return symbol object
    getSymbol(char){
        for (var i = 0; i < this.symbols.length; i++){
            if(this.symbols[i].char == char){
                return this.symbols[i];
            }
        }
    }

    removeSymbol(char){
        var char = this.getSymbol(char);
        for(var i = 0; i < this.symbols.length; i++){
            if (this.symbols[i] === char) { 
                this.symbols.splice(i, 1);
            }
        }
    }

}