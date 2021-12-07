// REFACTORING

const HIGH = 1
const LOW = 0;
const BIT_SIZE = 8;
const clockSpeedDefault = 500;

const CLOCK = ( () => {

    function startClock(interval = clockSpeedDefault) {
        setInterval( () => {
            pulse();
        }, interval)

        console.log(`CLOCK STARTING AT ${interval} MS`);
    }

    function pulse() {
        // console.log("SINGLE CLOCK PULSE")

        moduleEnableTick();
        moduleLoadTick();
    }
    
    function moduleEnableTick() {

        // modules.foreach
        REGISTER_A.clockPulse("enable")
        REGISTER_B.clockPulse("enable")
    }

    function moduleLoadTick() {

        // modules.foreach
        REGISTER_A.clockPulse("load")
        REGISTER_B.clockPulse("load")
    }

    return {
        startClock
    }
})();

const BUS = ( () => {
    let data = Array.from({length: BIT_SIZE}, () => LOW);

    function read() {
        return data;
    }

    function write(input) {
        if (input.length === BIT_SIZE) {
            data = input;
        } else {
            console.error("Invalid bus input.");
        }
    }

    return {
        read,
        write
    }
})();

const REGISTER_A = ( () => {
    let data = Array.from({length: BIT_SIZE}, () => LOW);
    let load = LOW;
    let enable = LOW;

    function read() {
        data = BUS.read();
    }

    function write() {
        BUS.write(data)
    }

    function clockPulse(enableOrLoad){
        if (load && enable) {
            console.error(`Both load and enable are HIGH in register A.`);
        } else {
            if (load && enableOrLoad === "load") { read(); }
            if (enable && enableOrLoad === "enable") { write(); }
        }
    }
})();

const REGISTER_B = ( () => {
    let data = Array.from({length: BIT_SIZE}, () => LOW);
    let load = LOW;
    let enable = LOW;

    function read() {
        data = BUS.read();
    }

    function write() {
        BUS.write(data)
    }

    function clockPulse(enableOrLoad){
        if (load && enable) {
            console.error(`Both load and enable are HIGH in register B.`);
        } else {
            if (load && enableOrLoad === "load") { read(); }
            if (enable && enableOrLoad === "enable") { write(); }
        }
    }
})();

// ------------------------------- ||

CLOCK.startClock(2000);