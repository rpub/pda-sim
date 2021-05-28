export default class Rule{
    constructor(a, A, q, α){
        this.currentInputChar = a;
        this.topStackSymbol = A;
        this.nextState = q;
        this.newTopStackSymbol = α;
    }
}