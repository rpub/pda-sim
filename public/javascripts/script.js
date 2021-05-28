// import {Graph} from "./graph.js";
import Tab from "./tabs.js";
import Automata from "./PDA/pda.js";

import PDA from "./PDA/pda.js";
import State from "./PDA/state.js";

let tab = new Tab();

$(function(){

	let nPDA = new PDA();	// generate new PDA
	nPDA.refresh();			// refresh (intialize) graph
	showTab(); 				// show current tab in multi-step form

	// **************************************************************
	// 1. ADD STATE
	// **************************************************************
	function addState(){

		// validate input
		var outcome = isValidInput('#state-input-field');

		if (outcome[0] == false){
			pushErr('#state-input-error', outcome[1]);
		} else {

			// hide error message
			$('#state-input-error').hide();

			// add state to PDA
			nPDA.addState(new State($('#state-input-field').val()));
			displayStates(); // display states

			// refocus input box for next task
			$('#state-input-field').val("").focus();
		}
	};
	// display states
	function displayStates(){
		// clear current list
		$('#state-list').empty();

		for (var i = 0; i < nPDA.states.length; i++){
			
			var $item = nPDA.states[i].name; 		// state value
			var accept = nPDA.states[i].isAccept;   // state == || != accept state

			if (accept){
				// display accept state
				var $newListItem = $('<li class="item complete">' + $item + '<span>' +
				'<a href="#" class="check">' + '<i class="fa fa-check fa-lg"></i>' + '</a>' +
				'<a href="#" class="delete-todo">' + '<i class="fa fa-trash-o fa-lg"></i>' + '</a>' + 
				'</span>' + '</li>');
			} else {
				// display regular state
				var $newListItem = $('<li class="item">' + $item + '<span>' +
				'<a href="#" class="check">' + '<i class="fa fa-check fa-lg"></i>' + '</a>' +
				'<a href="#" class="delete-todo">' + '<i class="fa fa-trash-o fa-lg"></i>' + '</a>' + 
				'</span>' + '</li>');
			}
			$('#state-list').append($newListItem);
		}
	}

	// **************************************************************
	// 2. ADD INPUT SYMBOL
	// **************************************************************
	function addInputSymbol(){

		// validate input
		var outcome = isValidInput('#symbol-input-field');
		
		if (outcome[0] == false){
			pushErr('#symbol-input-error', outcome[1]);
		} else {

			// hide error message
			$('#symbol-input-error').hide();

			// add input symbol
			nPDA.addSigma($('#symbol-input-field').val());
			displayInputSymbols(); // display input symbol

			// refocus input box for next task
			$('#symbol-input-field').val("").focus();
		}
	};
	// display input symbols
	function displayInputSymbols(){
		// clear current list
		$('#input-symbol-list').empty();

		var cur = nPDA.getSigmaArr();
		for (var i = 0; i < cur.length; i++){

			// get input value
			var $item = cur[i];

			// display input symbol line item
			var $newListItem = $('<li class="item">' + $item + '<span>' +
			'<a href="#" class="delete-todo">' + '<i class="fa fa-trash-o fa-lg"></i>' + '</a>' + 
			'</span>' + '</li>');

			$('#input-symbol-list').append($newListItem);
		}
	}

	// **************************************************************
	// 3. ADD STACK SYMBOL
	// **************************************************************
	function addStackSymbol(){

		// validate input
		var outcome = isValidInput('#stack-input-field');
		
		if (outcome[0] == false){
			pushErr('#stack-symbol-error', outcome[1]);
		} else {

			// hide error message
			$('#stack-symbol-error').hide();

			// add stack symbol
			nPDA.addGamma($('#stack-input-field').val());
			displayStackSymbols(); // display stack symbols

			// refocus input box for next task
			$('#stack-input-field').val("").focus();
		}
	};

	function displayStackSymbols(){
		// clear current list
		$('#stack-symbol-list').empty();

		var cur = nPDA.getGammaArr();
		for (var i = 0; i < cur.length; i++){

			// get input value
			var $item = cur[i];

			// display stack symbol line item
			var $newListItem = $('<li class="item">' + $item + '<span>' +
			'<a href="#" class="delete-todo">' + '<i class="fa fa-trash-o fa-lg"></i>' + '</a>' + 
			'</span>' + '</li>');

			$('#stack-symbol-list').append($newListItem);
		}
	}

	// **************************************************************
	// 4. ADD TRANSITIONS
	// **************************************************************
	function addTransition(){	

		var $curState = $('#trans-state-dropdown-1').find(":selected").text();
		var $nextState = $('#trans-state-dropdown-2').find(":selected").text();
		var $curInput = $('#trans-input-dropdown').find(":selected").text();
		var $curStack = $('#trans-stack-dropdown').find(":selected").text();
		var $newStack = $('#trans-input-stack-dropdown').find(":selected").text();

		nPDA.addTransition(nPDA.getState($curState), $curInput, $curStack, nPDA.getState($nextState), $newStack);

		alert($curState);
		alert($curState + " " + $nextState + " " + $curInput + " " + $curStack + " " + $newStack);

		// Create new list item
		var $newListItem = $('<li class="item">'
							+ 'δ(' + '<i>' + $curState + '</i>'
							+ ' , ' + '<i>' + $curInput + '</i>'
							+ ' , ' + '<i>' + $curStack + '</i>'
							+ ') &#8594; (' + '<i>' + $nextState + '</i>'
							+ ' , ' + '<i>' + $newStack + '</i>'
							+ ')'
							+ '<span>'
							+ '<a href="#" class="delete-todo">' 
							+ '<i class="fa fa-trash-o fa-lg"></i>' 
							+ '</a>' 
							+ '</span>' 
							+ '</li>');
		
		// Add list item to end of list
		$('#transition-list').append($newListItem);

		nPDA.refresh(); 	// refresh graph with new state
	};
	function getTransitionsTable(){
		var list = document.getElementById('transition-list');
		var items = list.getElementsByTagName("li");
		var table = [];
		for (var i = 0; i < items.length; i++){	
			var components = items[i].getElementsByTagName("i");
			var row = []
			for (var j = 0; j < components.length; j++){
				row.push(components[j].textContent);
			}
			table.push(row);
		}
		return table;
	}

	// **************************************************************
	// INPUT VALIDATION
	// **************************************************************
	function isValidInput(inputFieldID){
		if (!isOneWord(inputFieldID)){
			return [false, 'Insert only one value at a time'];
		}
		if (isEmpty(inputFieldID)){
			return [false, 'Please enter a valid input'];
		}
		if(inputFieldID == '#state-input-field'){
			if (maxLength(inputFieldID, 3) != true){
				// err if exceeds three characters
				return [false, 'State name cannot be > 3 char'];
			} else if (isInList('state-list', inputFieldID)){
				return [false, 'State already exists.'];
			}
		} else if (inputFieldID == '#symbol-input-field'){
			if (maxLength(inputFieldID, 1) != true){
				return [false, 'Input symbol cannot be > 1 char'];
			} else if (isInList('stack-symbol-list', inputFieldID)){
				return [false, 'Cannot be in stack AND input symbols'];
			} else if (isInList('input-symbol-list', inputFieldID)){
				return [false, 'Input symbol already exists.'];
			}
		} else if (inputFieldID == '#stack-input-field'){
			if (maxLength(inputFieldID, 1) != true){
				return [false, 'Stack symbol cannot be > 1 char'];
			} else if (isInList('input-symbol-list', inputFieldID)){
				return [false, 'Cannot be in stack AND input symbols'];
			} else if (isInList('stack-symbol-list', inputFieldID)){
				return [false, 'Stack symbol already exists'];
			}
		}
		return [true];
	}
	// helper: check if input already exists in current or competing list
	function isInList(listID, inputFieldID){
		var value = $(inputFieldID).val();
		var list = getList(listID);
		for (var i = 0; i < list.length; ++i){
			if(list[i] == value){
				return true;
			}
		}
		return false;
	}
	// helper: check if input has empty spaces
	function isOneWord(inputFieldID){
		var words = $(inputFieldID).val().split(' ');
		if(words.length == 1){
			return true;
		} else {
			return false;
		}
	}
	// helper: check if input is empty
	function isEmpty(inputFieldID){
		if($(inputFieldID).val().trim() == "") {
			return true;
		} else {
			return false;
		}
	}
	// helper: check if input exceed maxChars 
	function maxLength(input, maxChars){
		var chars = $(input).val().split('');
		if(chars.length > maxChars){
			return false;
		} else {
			return true;
		}
	}
	// helper: display error
	function pushErr(errDivID, errMsg){
		var p = $(errDivID).find('p');
		$(p.empty());
		$(p.append(errMsg));
		$(errDivID).fadeIn(200);
	}
	
	// **************************************************************	
	// EVENT LISTENER: Select start state
	// **************************************************************
	$('#select-start-state').change(function(){
		var selected = $('#select-start-state').find(":selected").text();
		nPDA.setStartState(selected);
		nPDA.refresh();
	});

	// **************************************************************
	// EVENT LISTENER: Select start stack symbol
	// **************************************************************
	$('#select-stack-symbol').change(function(){
		var selected = $('#select-stack-symbol').find(":selected").text();
		nPDA.setStartStackSymbol(selected);
		alert(nPDA.Z.char);
	});

	// **************************************************************
	// EVENT LISTENER: Remove err message
	// **************************************************************
	$('i.fa-times').on('click', function(){
		var msgID = this.parentNode.parentNode.getAttribute("id");
		$('#'+msgID).hide();
	});

	// **************************************************************
	// EVENT LISTENER: Mark accept state
	// **************************************************************
	$(document).on('click', '.check', function(e){
		e.preventDefault();
		$(this).closest('li').toggleClass('complete');
		if($(this).closest('li').hasClass('complete')){
			nPDA.setIsAcceptState($(this).closest('li').text());
			nPDA.refresh();
		} else {
			nPDA.setIsNotAcceptState($(this).closest('li').text());
			nPDA.refresh();
		}
	});

	// **************************************************************
	// EVENT LISTENER: Remove LI from UL in DOM
	// **************************************************************
	$(document).on('click', '.delete-todo' , function(e){
		e.preventDefault();

		var ulID = $(this).closest('li').closest('ul').attr('id');
		var listVal = $(this).closest('li').text();

		$(this).closest('li').fadeOut(200, function(){

			if(ulID == 'state-list'){
				nPDA.removeState(listVal);
			} else if (ulID == 'input-symbol-list'){
				nPDA.removeSigma(listVal);
			} else if (ulID == 'stack-symbol-list'){
				nPDA.removeGamma(listVal);
			}

			$(this).remove();

		});
	});
	
	// **************************************************************
	// EVENT LISTENERS: Add item to list
	// **************************************************************
	$('.add-state').on('click', addState);
	$('.add-input-symbol').on('click', addInputSymbol);
	$('.add-stack-symbol').on('click', addStackSymbol);
	$('.add-transition').on('click', addTransition);

	$('.input-keypress-handler').on('keypress', function(e){
		if(e.which == 13) {
			let inputFieldID = this.getAttribute("id");
			if(inputFieldID == "state-input-field"){
				addState();
			} else if (inputFieldID == "symbol-input-field"){
				addInputSymbol();
			} else if (inputFieldID == "stack-input-field"){
				addStackSymbol();
			}
		}
	});

	// **************************************************************
	// EVENT LISTENERS: Prev/next tab
	// **************************************************************
	$("#nextBtn").click(function() {
		nextPrev(1);
	});
	$("#prevBtn").click(function() {
		nextPrev(-1);
	});
	// $("#gradient-button").click(function() {
	// 	generatePDA();
	// });

	// **************************************************************
	// **************************************************************
	// **************************************************************
	// ** HANDLE TAB CHANGES
	// **************************************************************
	// **************************************************************
	// **************************************************************
	function tryString() {
		var value = $('#test-string-input').val();
		console.log(nPDA);
		alert(nPDA.accepts(value));
	}

	// **************************************************************	
	// EVENT LISTENER: Run input string through PDA
	// **************************************************************
	$("#run-step-btn").click(function() {
			tryString();
	});

});

// **************************************************************
// **************************************************************
// **************************************************************
// ** HANDLE TAB CHANGES
// **************************************************************
// **************************************************************
// **************************************************************

function showTab() {

	var n = tab.getPos();
	var x = document.getElementsByClassName("tab");

	x[n].style.display = "block";

	if (n == 0) {
		// First tab - states
		document.getElementById("gradient-button").disabled = true;
		document.getElementById("prevBtn").style.display = "none";
		document.getElementById("nextBtn").style.display = "inline";
	} else {

		if (n==1){
			// populate select start state dropdown
			populateDropdown('state-list', '#select-start-state');
		} else if (n==4){
			// populate select stack symbol dropdown
			populateDropdown('stack-symbol-list', '#select-stack-symbol');
		} else if (n==5){

			// Format δ(q, a, X)
			// q is a state in Q
			// a is an input symbol
			// X is a stack symbol 
			
			// 1
			populateDropdown('state-list', '#trans-state-dropdown-1');			// select current state
			populateDropdown('input-symbol-list', '#trans-input-dropdown');		// select current input char
			// populateDropdown('stack-symbol-list', '#trans-stack-dropdown');
			// select current symbol on stack
			populateDropdownAdvanced('input-symbol-list', 'stack-symbol-list', '#trans-stack-dropdown');
			// 2
			populateDropdown('state-list', '#trans-state-dropdown-2');			// select next state
																				// select next symbol to put on stack 
			populateDropdownAdvanced('input-symbol-list', 'stack-symbol-list', '#trans-input-stack-dropdown');
		}

		document.getElementById("gradient-button").disabled = true;
		document.getElementById("prevBtn").style.display = "inline";
		document.getElementById("nextBtn").style.display = "inline";

	}
	// if last tab (summary)
	if (n == (x.length - 1)) {
		document.getElementById("gradient-button").disabled = false;
		document.getElementById("nextBtn").style.display = "none";
	} else {
		document.getElementById("nextBtn").style.display = "inline";
	}

	// update step indicator
	fixStepIndicator(n);
}

// tabs helper
function nextPrev(n) {
	var x = document.getElementsByClassName("tab");   // current table			
	x[tab.getPos()].style.display = "none";			  // hide current tab
	tab.addToSelf(n);
	if (tab.getPos() >= x.length) {
		document.getElementById("regForm").submit();
		return false; // submit form 
	}
	showTab(tab.getPos());
}

// tabs helper
function fixStepIndicator(n) {
	var i, x = document.getElementsByClassName("step");
	for (i = 0; i < x.length; i++) {
		x[i].className = x[i].className.replace(" active", "");
	}
	x[n].className += " active";
}

// **************************************************************
// Populates start state and stack dropdown
// **************************************************************
function populateDropdown(resourceID, dropdownID){
	
	// get values currently in dropdown
	var currentDropdownValues = $(dropdownID).children('option').map(function(i, e){
		return e.value || e.innerText;
	}).get();

	// get values currently defined in resource
	var currentResourceValues = getList(resourceID);

	// if current dropdown is empty
	if (currentDropdownValues.length == 0){
		for (var i = 0; i < currentResourceValues.length; ++i) {
			var $newListItem = $('<option>' + currentResourceValues[i] + '</option>');
			$(dropdownID).append($newListItem);
		}
	} else {
		// if nothing changes
		if (JSON.stringify(currentDropdownValues) == JSON.stringify(currentResourceValues)){
			// don't do anything
		} else {
			// store value of currently selected dropdown value
			var currentDropdownValue = $(dropdownID).find(":selected").text();
			var stillExists = false;
			// check is value still exists
			for (var i = 0; i < currentResourceValues.length; ++i) {
				if(currentDropdownValue == currentResourceValues[i]){
					stillExists = true;
				}
			}
			
			// empty dropdown
			$(dropdownID).empty();

			if(stillExists == true){
				var $newListItem = $('<option>' + currentDropdownValue + '</option>');
				$(dropdownID).append($newListItem);
				for (var i = 0; i < currentResourceValues.length; ++i) {
					if(currentDropdownValue != currentResourceValues[i]){
						var $newListItem = $('<option>' + currentResourceValues[i] + '</option>');
						$(dropdownID).append($newListItem);	
					}
				}
			} else {
				for (var i = 0; i < currentResourceValues.length; ++i) {
					var $newListItem = $('<option>' + currentResourceValues[i] + '</option>');
					$(dropdownID).append($newListItem);	
				}				
			}
		}
	}
} // ************************************************************

// **************************************************************
// Populates start state and stack dropdown
// **************************************************************
function populateDropdownAdvanced(resourceAID, resourceBID, dropdownID){

	// empty dropdown
	$(dropdownID).empty();

	// get values in resources
	var resourceA = getList(resourceAID);
	var resourceB = getList(resourceBID);

	var $newListItem = $('<option>' + "ε" + '</option>');
	$(dropdownID).append($newListItem);

	for (var i = 0; i < resourceA.length; ++i) {
		if(resourceA[i] != "ε"){
			var $newListItem = $('<option>' + resourceA[i] + '</option>');
			$(dropdownID).append($newListItem);
		}
	}

	for (var i = 0; i < resourceB.length; ++i) {
		if(resourceB[i] != "ε"){
			var $newListItem = $('<option>' + resourceB[i] + '</option>');
			$(dropdownID).append($newListItem);
		}
	}
} // ************************************************************

// **************************************************************
// **************************************************************
// **************************************************************
// ** HELPER METHODS
// **************************************************************
// **************************************************************
// **************************************************************

// Returns array of li elements within an element with id X
function getList(listName){
	var list = document.getElementById(listName);
	var items = list.getElementsByTagName("li");
	var listBack = [];
	for (var j = 0; j < items.length; ++j) {
		listBack.push(items[j].textContent);
	}
	return listBack;
}

function getState(listName){

	var list = document.getElementById(listName);
	var items = list.getElementsByTagName("li");
	var listBack = [];

	for (var j = 0; j < items.length; ++j) {
		// check if accept state
		if(items[j].className.includes("complete")){
			listBack.push([true, items[j].textContent]);
		} else {
			listBack.push([false, items[j].textContent]);
		}
	}
	return listBack;
}

// **************************************************************
// GENERATE PDA
// **************************************************************
// function generatePDA(){
	
// 	var states = getState('state-list');
// 	var inputAlphabet = getList('input-symbol-list');
// 	var stackAlphabet = getList('stack-symbol-list');
// 	var $startState = $('#select-start-state').find(":selected").text();
// 	var $startStack = $('#select-stack-symbol').find(":selected").text();

// 	let pda = new PDA();

// 	// create all states
// 	for (var i = 0; i < states.length; ++i){

// 		let state = new State(states[i][1]);
// 		let isAccept = states[i][0];

// 		// set start state
// 		if (state.name == $startState){
// 			state.setIsInitial();
// 		}
// 		// set accept state
// 		if (isAccept == true){
// 			state.setIsAccept();
// 		}
// 		pda.addState(state);
// 		states[i] = state;
// 	}

// 	// create input alphabet
// 	for (var i = 0; i < inputAlphabet.length; ++i){
// 		pda.sigmaAdd(inputAlphabet[i]);
// 	}

// 	// create stack alphabet
// 	for (var i = 0; i < stackAlphabet.length; ++i){			
// 		let char = stackAlphabet[i];
// 		pda.gammaAdd(char);
// 		// set start stack symbol
// 		if (char == $startStack){
// 			pda.stackInit(char);
// 		}
// 	}

// 	// set transitions
// 	var table = getTransitionsTable();
// 	for (var i = 0; i < table.length; i++){
// 		var row = table[i];
// 		pda.addTransition(pda.getState(row[0]), row[1], row[2], pda.getState(row[3]), row[4]);
// 	}

// 	// create parseable transition table to generate JSON
// 	var trans = []
// 	for (var i = 0; i < pda.states.length; i++){
// 		var state = pda.states[i];
// 		var name = state.name;
// 		var rules = [];
// 		for (var j = 0; j < state.rules.length; j++){
// 			var rule = state.rules[j];
// 			var currentInputChar = rule.currentInputChar;
// 			var topStackSymbol = rule.topStackSymbol;
// 			var nextState = rule.nextState.name;
// 			var newTopStackSymbol = rule.newTopStackSymbol;
// 			rule = [currentInputChar, topStackSymbol, nextState, newTopStackSymbol];
// 			rules.push(rule);
// 		}
// 		trans.push([name, rules]);
// 	}

// 	// parse transition table and create JSON
// 	var graphImage = {};
// 	graphImage.id = 'light';
// 	graphImage.intial = 'q0';
// 	var states = {};
// 	graphImage.states = states;

// 	for (var i = 0; i < trans.length; i++){

// 		var state = trans[i];		// state name
// 		var values = {};
// 		for (var j = 0; j<rules.length; j++){

// 			// current rule in rules
// 			var rule = trans[i][j];
// 			var a = rule[0] // current input symbol
// 			var b = rule[1] // top stack symbol
// 			var c = rule[2] // next state
// 			var d = rule[3] // new top stack symbol
			
// 			var tmp = (a+', '+b+'->'+d);
// 			values[tmp] = c;
// 		}

// 		graphImage.states[state] = values;

// 	}

// 	// graphImage.push(states);
// 	var parsedImage = JSON.stringify(graphImage);
// 	console.log(parsedImage);

// 	const r = {
// 		"id":"light",
// 		"intial":"q0",
// 		"states":{
// 			"q0,ε,ε,q0,ε,0,ε,q0,ε":{},
// 			"q1,":{},
// 			"q2,":{}}}

	
// 	// 	// for (var j = 0; j < rules.length; j++){
// 	// 	// 	var a = rules[j][0] // current input symbol
// 	// 	// 	var b = rules[j][1] // top stack symbol
// 	// 	// 	var c = rules[j][2] // next state
// 	// 	// 	var d = rules[j][3] // new top stack symbol
	
// 	// 	// 	jsay = jsay.concat("'"+a+", "+b+"->"+d+"': '"+c+"'");
		
// 	// 	// 	if(j < rules.length-1){
// 	// 	// 		jsay = jsay.concat(",");
// 	// 	// 	}
// 	// 	// }
// 	// }


// 	// var jsay = '';
// 	// jsay = jsay.concat('{');
// 	// jsay = jsay.concat('"id:"' + "'light'");
// 	// jsay = jsay.concat('"initial:"' + 'pda.q0.name' + ',');
// 	// jsay = jsay.concat(' "states:" { ');

// 	// for (var i = 0; i < trans.length; i++){

// 	// 	var state = trans[i];
// 	// 	var rules = state[1];

// 	// 	jsay = jsay.concat(state[0] + ":{ ");
// 	// 		jsay = jsay.concat(" on: { ")

// 	// 			for (var j = 0; j < rules.length; j++){
// 	// 				var a = rules[j][0] // current input symbol
// 	// 				var b = rules[j][1] // top stack symbol
// 	// 				var c = rules[j][2] // next state
// 	// 				var d = rules[j][3] // new top stack symbol
// 	// 				jsay = jsay.concat("'"+a+", "+b+"->"+d+"': '"+c+"'");
// 	// 				if(j < rules.length-1){
// 	// 					jsay = jsay.concat(",");
// 	// 				}
// 	// 			}
				
// 	// 			// if(!trans.length == j){
// 	// 			// 	jsay = jsay.concat(",");
// 	// 			// }

// 	// 		jsay = jsay.concat(" }");	// end state rules
			
// 	// 		// if(i < trans.length-1){
// 	// 		// 	jsay = jsay.concat(", ");
// 	// 		// }

// 	// 	jsay = jsay.concat("}");	// end states
		
// 	// 	if(i < trans.length-1){
// 	// 		jsay = jsay.concat(",");
// 	// 	}
		

// 	// }

// 	// jsay = jsay.concat(" } ");
// 	// jsay = jsay.concat(" };");

// 	// console.log(jsay);

// 	// var obj = JSON.parse(jsay);

// 	// console.log(obj);

// 	var rami = [1, 2, 3, 4];
// 	rami = JSON.stringify(rami);
// 	rami = JSON.parse(rami);
// 	console.log(rami);

// 	console.log(trans);
	
// 	// console.log(rules);

// 	console.log(states);
// 	console.log(pda);
// }

// // function jsfiy(pda){
// // 	var lightMachine = {
// // 		id: 'light',
// // 		initial: null,
// // 		states: {}
// // 	}
// // }

// // function getTransitionsTable(){
// // 	var list = document.getElementById('transition-list');
// // 	var items = list.getElementsByTagName("li");
// // 	var table = [];
// // 	for (var i = 0; i < items.length; i++){	
// // 		var components = items[i].getElementsByTagName("i");
// // 		var row = []
// // 		for (var j = 0; j < components.length; j++){
// // 			row.push(components[j].textContent);
// // 		}
// // 		table.push(row);
// // 	}
// // 	return table;
// // }