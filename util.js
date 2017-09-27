const util = require('util');

function Base() {
    this.name = "nanbo";
    this.base = 1994;
    this.sayHello = function () {
        console.log("hello " + this.name);
    }
}

Base.prototype.showName = function () {
    console.log(this.name);
}

function sub() {
    this.name = "继承";
}

util.inherits(sub,Base);

const objBase = new Base();
objBase.showName();

const objSub = new sub();
objSub.showName();

console.log(util.inspect(objSub,true));