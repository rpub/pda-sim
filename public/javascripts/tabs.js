// **************************************************************
// TABS CONTROLLER
// **************************************************************

// export {showTab, currentTab, nextPrev, validateForm, fixStepIndicator};
export default class Tab{
    constructor(){
        this.pos = 0;
    }

    increment(){
        this.pos = this.pos + 1; 
    }

    decrement(){
        this.pos = this.pos - 1; 
    }

    set(x){
        this.pos = x; 
    }

    getPos(){
        return this.pos;
    }

    addToSelf(x){
        this.pos = this.pos + x;
    }
}

// function showTab(n) {
//     alert(n);
//     console.log(n);

//     var x = document.getElementsByClassName("tab");
//     x[n].style.display = "block";

//     // var x = document.getElementsByClassName("tab");
//     // var y = x[n].id;

//     // document.getElementsByClassName(x).style.display = "block";
//     // document.getElementsByClassName(x).style.display = "block";

//     // x[n].style.display = "block";
//     // alert(x);
//     // console.log(x);
//     // alert(x[n]);
//     // console.log(x[n]);

//     // var elem = x[n].element;
//     // alert(elem);

//     // document.getElementById("myDIV").style.display = "none";

//     // ... and fix the Previous/Next buttons:
//     if (n == 0) {
//         document.getElementById("prevBtn").style.display = "none";
//         // document.getElementById("nextBtn").style.display = "inline";
//     } else {
//         // document.getElementById("prevBtn").style.display = "inline";
//         document.getElementById("nextBtn").style.display = "inline";
//     }
//     if (n == (x.length - 1)) {
//         document.getElementById("nextBtn").style.display = "none";
//     } else {
//         document.getElementById("nextBtn").style.display = "inline";
//     }
//     // ... and run a function that displays the correct step indicator:
//     fixStepIndicator(n)
// }

// function nextPrev(n) {
//     var x = document.getElementsByClassName("tab"); // current table 
//     if (n == 1 && !validateForm()) return false;	  // escape if field(s) invalid
//     x[currentTab].style.display = "none";			  // hide current tab

//     currentTab = currentTab + n;					  // new tab index

//     if (currentTab >= x.length) {
//         document.getElementById("regForm").submit();
//         return false; // submit form 
//     }
//         // Otherwise, display the correct tab:
//         showTab(currentTab);
// }

// function validateForm() {
//     // This function deals with validation of the form fields
//     var x, y, i, valid = true;
//     x = document.getElementsByClassName("tab");
//     y = x[currentTab].getElementsByTagName("input");
//         //   // A loop that checks every input field in the current tab:
//         //   for (i = 0; i < y.length; i++) {
//         //     // If a field is empty...
//         //     if (y[i].value == "") {
//         //       // add an "invalid" class to the field:
//         //       y[i].className += " invalid";
//         //       // and set the current valid status to false:
//         //       valid = false;
//         //     }
//         //   }
//     // If the valid status is true, mark the step as finished and valid:
//     if (valid) {
//         document.getElementsByClassName("step")[currentTab].className += " finish";
//     }
//     return valid; // return the valid status
// }

// function fixStepIndicator(n) {
//     // This function removes the "active" class of all steps...
//     var i, x = document.getElementsByClassName("step");
//     for (i = 0; i < x.length; i++) {
//         x[i].className = x[i].className.replace(" active", "");
//     }
//     //... and adds the "active" class to the current step:
//     x[n].className += " active";
// }
