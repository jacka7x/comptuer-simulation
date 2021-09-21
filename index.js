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
// create clear method to reset computer without turning on/off??

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

            if (i === 6) {
                console.log("Test 6");
                test_6()
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

    // get and set for testing purposes only
    get(){
        return this.register;
    }

    set(setValue){
        this.register = setValue;
    }
    // -------------------------------------

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

class InstructionRegister {

    // registar storage and load/enable states
    constructor() {
        // FIRST FOUR BITS TO BUS / LAST FOUR BITS TO INSTRUCTION DECODER
        this.register = [LOW, LOW, LOW, LOW, LOW, LOW, LOW, LOW];

        // MAYBE SEPERATE STATES FOR BUS/INSTRUCTION DECODER
        this.loadState = LOW;
        this.enableState = LOW;
    }

    get(){
        return this.register;
    }

    load() {
        // CHANGE TO LOAD ONLY FIRST FOUR BITS
        this.register = BUS.read();
    }

    enable() {
        // CHANGE TO ENABLE ONLY FIRT FOUR BITS
        BUS.write(this.register);
    }

    // calls load() or enable() methods at end of each HIGH clock tick if set to HIGH
    // CHANGE TO ONLY LOAD/ENABLE FIRST FOUR BITS TO BUS
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

// ----- ALU ------

class ArithmeticLogicUnit {

    //
    constructor(){
        this.subtractEnableState = LOW;
        this.sumOutEnableState = LOW;
    }

    readRegister_A() {
        return REGISTER_A.register;
    }

    readRegister_B() {
        return REGISTER_B.register;
    }

    writeBus(output) {
        BUS.write(output);
    }

    // deals with calculations and sends to bus
    // adds A and B registers
    calculate(reg_A, reg_B, sub){

        // for 8 bit computer
        let bitSize = 8;
        
        let result = [];
        let carry;

        // twos compiment need to +1 on
        if (sub === HIGH){
            carry = 1;
        } else {
            carry = 0;
        }
        

        // catch array size error
        if (reg_A.length != 8 || reg_B.length != 8 ) {
            console.log("ALU error: input array not consistant with computer bitSize")
        }

        // > 0 becuase last bit is sign bit
        for (let i = bitSize - 1; i >= 0; i--) {

            let evalArray = this.evaluateBit(reg_A[i], reg_B[i], carry);
            carry = evalArray[0];
            result.unshift(evalArray[1]);

        }
        return result;
    }

    // LOGIC FUNCTION
    evaluateBit(A_bit, B_bit, carry) {

        // change to string becuase switch case donsen't take arrays
        let input = [A_bit, B_bit].toString();

        // evaulates 1 bit from A and B
        // [CARRY, VALUE]
        if (carry === 0) {
            switch (input) {
                case "0,0":
                    return [0, 0]
                break;
                case "0,1":
                    return [0, 1]
                break;
                case "1,0":
                    return [0, 1]
                break;
                case "1,1":
                    return [1, 0]
                break;
            }
        } else {
            switch (input) {
                case "0,0":
                    return [0, 1]
                break;
                case "0,1":
                    return [1, 0]
                break;
                case "1,0":
                    return [1, 0]
                break;
                case "1,1":
                    return [1, 1]
                break;
            }
        }
    }

    // flips all bits to make negitive number
    // +1 added to carry in calculate fuction
    negate() {
        let neg_B = this.readRegister_B().map(element => {
            if (element === 1) {
                return 0;
            } else {
                return 1;
            }
        });
        return neg_B
    }

    // calculates every clock tick, writes to bus if sumOutEnableState is HIGH
    // negates reg_B if subtractEnableState is HIGH
    clock(){
        let reg_B;
        
        if (this.subtractEnableState === HIGH) {
            reg_B = this.negate();
        } else {
            reg_B = this.readRegister_B();
        }

        let output = this.calculate(this.readRegister_A(), reg_B, this.subtractEnableState)

        if (this.sumOutEnableState === HIGH) {
            this.writeBus(output);
        }
    }
}

// ----- ALU ------

// ----- CONTROL -----

class Control {
    // fill out later, change name?
}

// put in control class later, currently global fuctions (used in clock class)
// PUT IN ARRAY
// DOES ORDER MATTER???
function  moduleClocks(){
    REGISTER_A.clock();
    REGISTER_B.clock();
    ALU.clock();
}



console.log("Booting up...");

// create instance of bus
const BUS = new Bus();

// create instance of register A, B, INSTRUCTION
const REGISTER_A = new Register();
const REGISTER_B = new Register();
const REGISTER_INSTRUCTION = new InstructionRegister();

// create instance of ALU
const ALU = new ArithmeticLogicUnit();

//...
// create instance of clock and start the clock at 'clockSpeed'
const CLOCK = new Clock(500);
CLOCK.start()

console.log(`Started sucessfully. Clock speed is ${CLOCK.getClockSpeed()}.\n`);




// ----- CONTROL -----  

//TEST AREA --- TESTS SET IN CLOCK TICK FUNCTION

const A_test = [0, 0, 0, 0, 1, 0, 0, 0];
const B_test = [0, 0, 0, 0, 0, 0, 0, 1];

REGISTER_A.set(A_test);
REGISTER_B.set(B_test);
ALU.subtractEnableState = HIGH;

function test_4() {
    console.log("REGISTER_A: " + ALU.readRegister_A());
    console.log("REGISTER_B: " + ALU.readRegister_B());
    ALU.sumOutEnableState = HIGH;
}

function test_6() {
    console.log("BUS: " + BUS.get());
}

function test_8() {

}



