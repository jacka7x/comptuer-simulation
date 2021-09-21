// ***** LONG TERM GOALS *****
// increase from 8 bit to higher
// read/write machine code from file
// make assembly compiler
// write programs in assembly language
// write higher order programming language
// build basic operating system / file system
// create terminal with commands (including assembly/machine/my own bash)
// create and save text files and programms

// ***** TODO *****
// CREATE WEBSITE GUI
// create modules with load/enable to from bus
// create clear method to reset comuter without turning on/off??

// CLOCK
// 2) each module has tick function, clock calls all tick fuctions on HIGH, control only sets load/enable for next tick (I prefer this)
// Put all clock connected modules in arry, loop over and activate each high tick

// ---------------------------------------------------------------------

// set high and low to 1 and 0
const HIGH = 1;
const LOW = 0;


// ----- CLOCK -----

class Clock {
    constructor(clockSpeed) {
        this.clockSpeed = clockSpeed;
        let clockState = LOW;
    }

    getClockSpeed(){
        return this.clockSpeed;
    }

    start() {
        // for testing --------------------|>
        let i = 0;

        // function occurs every 'clockspeed' milliseconds, alternates HIGH/LOW
        // each clock tick calls clock fuction in each module
        setInterval( () => {
            if (this.clockState === LOW) {
                this.clockState = HIGH;

                // put in control class later, currently global function
                moduleClocks();
            } else {
                this.clockState = LOW;
            }

            // for testing --------------------|>
            // console.log(this.clockState);
            i++;

            if (i === 4) {
                console.log("Test 4");
                test_4()
            }

            if (i === 8) {
                console.log("Test 8");
                test_8()
            }
            // for testing --------------------|>

        }, this.clockSpeed);
    }
}


// ----- CLOCK -----

// ----- BUS -----

class Bus {

    // bus channels
    constructor() {
        this.bus = [LOW, LOW, LOW, LOW, LOW, LOW, LOW, LOW];
    }

    get(){
        return this.bus;
    }

    // modules call to read and write to/from bus
    read() {
        return this.bus;
    }

    write(busInput) {
        this.bus = busInput;
    }
}

// ----- BUS -----


// ----- REGISTER -----

class Register {

    // registar storage and load/enable states
    constructor() {
        this.register = [LOW, LOW, LOW, LOW, LOW, LOW, LOW, LOW];
        this.loadState = LOW;
        this.enableState = LOW;
    }

    get(){
        return this.register;
    }

    load() {
        this.register = BUS.read();
    }

    enable() {
        BUS.write(this.register);
    }

    // calls load() or enable() methods at end of each HIGH clock tick if set to HIGH
    clock(){
        if (this.loadState === HIGH && this.enableState === HIGH) {
            console.log(`${this} error: both load and enable are HIGH`);
        } else {
            if (this.loadState === HIGH) {
                this.load();
            }
            if (this.enableState === HIGH) {
                this.enable();
            }
        }
    }
}

// ----- REGISTER -----

// ----- CONTROL -----

class Control {
    // fill out later, change name?
}


console.log("Booting up...");

// create instance of bus
const BUS = new Bus();

// create instance of register (1, 2 or A B?)
const REGISTER_1 = new Register();
const REGISTER_2 = new Register();

// put in control class later, currently global fuctions (used in clock class)
function  moduleClocks(){
    REGISTER_1.clock();
}

//...
// create instance of clock and start the clock at 'clockSpeed'
const CLOCK = new Clock(500);
CLOCK.start()

console.log(`Started sucessfully. Clock speed is ${CLOCK.getClockSpeed()}.\n`);


// ----- CONTROL -----  

//TEST AREA --- TESTS SET IN CLOCK TICK FUNCTION

console.log("BUS: " + BUS.get());
console.log("REGISTER_1: " + REGISTER_1.get());
BUS.write([[1,1,1,1,1,1,1,1]])

REGISTER_1.loadState = HIGH;

function test_4() {
    console.log("BUS: " + BUS.get());
    console.log("REGISTER_1: " + REGISTER_1.get());
}

function test_8() {
    console.log("BUS: " + BUS.get());
    console.log("REGISTER_1: " + REGISTER_1.get());
}



