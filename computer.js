// REFACTORING

const HIGH = 1
const LOW = 0;
const BIT_SIZE = 8;

const DOM = ( () => {
    const clockOutput = Array.from(Array.from(document.getElementById("CLOCK").getElementsByClassName("module-output"))[0].getElementsByClassName("bit-LED"));
    const busOutput = Array.from(Array.from(document.getElementById("BUS").getElementsByClassName("module-output"))[0].getElementsByClassName("bit-LED"));
    const reg_AOutput = Array.from(Array.from(document.getElementById("REG_A").getElementsByClassName("module-output"))[0].getElementsByClassName("bit-LED"));
    const reg_BOutput = Array.from(Array.from(document.getElementById("REG_B").getElementsByClassName("module-output"))[0].getElementsByClassName("bit-LED"));

    function output() {
        // DOM.output called three times per clock cycle, from the clock module

        _clockDisplay(clockOutput);
        _busDisplay(busOutput);
        _regDisplay(reg_AOutput, REGISTER_A);
        _regDisplay(reg_BOutput, REGISTER_B);
    }

    function _clockDisplay(LEDArray) {
        CLOCK.getState() ?
            _on(LEDArray[0]) : _off(LEDArray[0]);
    }

    function _busDisplay(LEDArray) {
        BUS.getData().forEach( (data, LED) => {
            data ?
            _on(LEDArray[LED]) : _off(LEDArray[LED]);
        });
    }

    function _regDisplay(LEDArray, reg_name) {
        reg_name.getData().forEach( (data, LED) => {
            data ?
                _on(LEDArray[LED]) : _off(LEDArray[LED]);
        });
    }

    function _on(LED) {
        LED.classList.add("onLED");
    }

    function _off(LED) {
        LED.classList.remove("onLED")
    }

    return{
        output
    }

})();

const INPUT = ( () => {
    function toBus(input) {
        if(input.length !== BIT_SIZE) {
            console.error("Input to bus wrong bit size.")
        } else {
            BUS.write(input);
        }
    }

    return {
        toBus
    }
})();

function Module() {};

Module.prototype.getData = function() {
    return this.data;
}

const CLOCK = ( () => {
    let state = LOW;
    const clockSpeedDefault = 200;
    let clockSpeed = null;

    function startClock(interval = clockSpeedDefault) {
        setInterval( () => {

            // if HIGH go LOW and vice versa
            state ? pulseLOW() : pulseHIGH();
        }, interval)

        clockSpeed = interval;
        console.log(`CLOCK STARTING AT ${interval} MS`);
    }

    function pulseHIGH() {
        state = HIGH;
        DOM.output()
        moduleEnableTick();
        DOM.output();
        moduleLoadTick();
    }

    function pulseLOW() {
        state = LOW;
        DOM.output()
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

    function getState() {
        return state;
    }

    function getClockSpeed() {
        return clockSpeed;
    }

    return {
        startClock,
        getState,
        getClockSpeed
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

    function getData() {
        return data;
    }

    return {
        read,
        write,
        getData
    }
})();

function Register() {
    this.data = Array.from({length: BIT_SIZE}, () => LOW);
    this.load = LOW;
    this.enable = LOW;
};

Register.prototype = Object.create(Module.prototype);

Register.prototype.read = function() {
    this.data = BUS.read();
};

Register.prototype.write = function() {
    BUS.write(this.data)
}

// MOVE TO MODULE?
Register.prototype.clockPulse = function() {
    if (this.load && this.enable) {
        console.error(`Both load and enable are HIGH`);
    } else {
        if (this.load && enableOrLoad === "load") { read(); }
        if (this.enable && enableOrLoad === "enable") { write(); }
    }
}

// ------------------------------- ||

function rand() {
    return Math.random() < 0.5
}

CLOCK.startClock(500);

const REGISTER_A = new Register();
const REGISTER_B = new Register();

setInterval( () => {
    INPUT.toBus(
        [rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand()])
}, CLOCK.getClockSpeed() * 2)

setInterval( () => {
    REGISTER_A.read();
}, CLOCK.getClockSpeed() *  4)

setInterval( () => {
    REGISTER_B.read();
}, CLOCK.getClockSpeed() * 6 )


