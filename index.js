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
        // function occurs every 'clockspeed' milliseconds, alternates HIGH/LOW
        setInterval( () => {
            if (this.clockState === LOW) {
                this.clockState = HIGH;
                REGISTER_1.clock();
            } else {
                this.clockState = LOW;
            }
            console.log(this.clockState);     
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

    // registar storage
    constructor() {
        this.register = [LOW, LOW, LOW, LOW, LOW, LOW, LOW, LOW];
        this.loadA = LOW;
        this.enableA = LOW;
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

    clock(){
        console.log("meme");
        if (this.loadA = HIGH) {
            this.load();
            console.log("loaded");
        }
        if (this.enableA = HIGH) {
            this.enable();
            console.log("enabled");
        }
    }

}

// from clock -----> clock.tick()??? call register.tick()...????
// ----- REGISTER -----

// ---------------------------------------------------------------------

console.log("Booting up...");

// create instance of bus
const BUS = new Bus();

// create instance of register (1, 2 or A B?)
const REGISTER_1 = new Register();
const REGISTER_2 = new Register();

//...
// create instance of clock and start the clock at 'clockSpeed'
const CLOCK = new Clock(500);
CLOCK.start()

console.log(`Started sucessfully. Clock speed is ${CLOCK.getClockSpeed()}.\n`);


//TEST AREA
console.log("BUS: " + BUS.get());
console.log("REGISTER_1: " + REGISTER_1.get());

BUS.write([0,1,1,0,1,1,0,0]);
REGISTER_1.load();

console.log("BUS: " + BUS.get());
console.log("REGISTER_1: " + REGISTER_1.get());
