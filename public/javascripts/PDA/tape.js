import Slot from './slot.js'

export default class Tape{
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