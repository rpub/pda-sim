import Slot from './slot.js'

export default class Stack{
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