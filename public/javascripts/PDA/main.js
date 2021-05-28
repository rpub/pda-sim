import PDA from './pda.js';
import State from './state.js';

// // --- new pda
// let pda = new PDA();

// // --- new states
// let q0 = new State('q0'); 
// q0.setIsInitial();
// let q1 = new State('q1'); 

// let q2 = new State('q2'); 
// q2.setIsAccept();

// let q3 = new State('q3'); 
// q3.setIsAccept();

// // --- add states
// pda.addState(q0);
// pda.addState(q1);
// pda.addState(q2);
// pda.addState(q3);

// pda.sigmaInit('ab');    // define input alphabet allowed
// pda.gammaInit('ab');    // define stack alphabet allowed

// pda.stackInit('Z');     // define first character in stack

// pda.addTransition(q0, 'ε', 'Z', q1, 'ε');
// pda.addTransition(q0, 'a', 'Z', q1, 'a');
// pda.addTransition(q1, 'a', 'a', q1, 'a');
// pda.addTransition(q1, 'b', 'a', q2, 'ε');
// pda.addTransition(q2, 'b', 'a', q2, 'ε');
// pda.addTransition(q2, 'ε', 'Z', q3, 'ε');

// // ******************************************************************************************
// // ** Assert 
// // ******************************************************************************************
// function assert(outcome){
//     console.log((outcome[0] ? 'Accept:' : 'Reject:'),  outcome[1]);
// }

// assert(pda.accepts('aaabbb'));