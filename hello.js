'use strict'

function greet1(name){
    console.log('this is ' + name+ ' 1');
}

function greet2(name){
    console.log('this is ' + name+ ' 2');
}

module.exports = {
    greet1 : greet1,
    greet2 : greet2
};