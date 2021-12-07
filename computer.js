// REFACTORING

const HIGH = 1
const LOW = 0;
const clockSpeedDefault = 500;

const CLOCK = ( () => {

    function startClock(interval = clockSpeedDefault) {
        setInterval( () => {
            pulse();
        }, interval)

        console.log(`CLOCK STARTING AT ${interval} MS`);
    }

    function pulse() {
        console.log("SINGLE CLOCK PULSE")

        moduleEnableTick();
        moduleLoadTick();
    }
    
    function moduleEnableTick() {
        console.log("ENABLE TICK")

        // modules.foreach
    }

    function moduleLoadTick() {
        console.log("LOAD TICK")

        // modules.foreach
    }

    return {
        startClock
    }
})();


// ------------------------------- ||

CLOCK.startClock(2000);