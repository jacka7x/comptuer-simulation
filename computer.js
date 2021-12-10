// REFACTORING

const HIGH = 1
const LOW = 0;
const BIT_SIZE = 8;

const DOM = ( () => {
    const clockOutput = Array.from(Array.from(document.getElementById("CLOCK").getElementsByClassName("module-output"))[0].getElementsByClassName("bit-LED"));

    const busOutput = Array.from(Array.from(document.getElementById("BUS").getElementsByClassName("module-output"))[0].getElementsByClassName("bit-LED"));

    function output() {
        // DOM.output called three times per clock cycle, from the clock

        clockDisplay();
        busDisplay();
    }

    function clockDisplay() {
        CLOCK.getState() ?
            clockOutput[0].classList.add("onLED") :
            clockOutput[0].classList.remove("onLED");
    }

    function busDisplay() {
        BUS.getData().forEach( (data, LED) => {
            data ?
                busOutput[LED].classList.add("onLED") :
                busOutput[LED].classList.remove("onLED");
        });
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

const CLOCK = ( () => {
    let state = LOW;
    const clockSpeedDefault = 500;

    function startClock(interval = clockSpeedDefault) {
        setInterval( () => {

            // if HIGH go LOW and vice versa
            state ? pulseLOW() : pulseHIGH();
        }, interval)

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

    return {
        startClock,
        getState
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
        return data
    }

    return {
        read,
        write,
        getData
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

    function getData(){
        return data;
    }

    return {
        clockPulse,
        getData
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

    function getData(){
        return data;
    }

    return {
        clockPulse,
        getData
    }
})();

// ------------------------------- ||

function rand() {
    return Math.random() < 0.5
}

CLOCK.startClock();

setInterval( () => {
    INPUT.toBus(
        [rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand()])
}, 1200)


