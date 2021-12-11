// //MODULE -> REGISTER -> REG_A


// const REGISTER_A = ( () => {
//     let data = Array.from({length: BIT_SIZE}, () => LOW);
//     let load = LOW;
//     let enable = LOW;

//     function read() {
//         data = BUS.read();
//     }

//     function write() {
//         BUS.write(data)
//     }

//     function clockPulse(enableOrLoad){
//         if (load && enable) {
//             console.error(`Both load and enable are HIGH in register A.`);
//         } else {
//             if (load && enableOrLoad === "load") { read(); }
//             if (enable && enableOrLoad === "enable") { write(); }
//         }
//     }

//     function getData(){
//         return data;
//     }

//     return {
//         clockPulse,
//         getData
//     }
// })();

const BIT_SIZE = 4; const HIGH = 1; const LOW = 0;

const BUS = ( () => {
    data = [0,1,0,1];

    function read() {
        return data
    }

    return {
        read
    }
})();

function register() {
    this.data = Array.from({length: BIT_SIZE}, () => LOW);
    console.log(this.data);
};

register.prototype.read = function() {
    data = BUS.read();
};

register.prototype.print = function() {
};

const REG_A = new register();

REG_A.print();

// old reg code

// const REGISTER_A = ( () => {
//     let data = Array.from({length: BIT_SIZE}, () => LOW);
//     let load = LOW;
//     let enable = LOW;

//     function read() {
//         data = BUS.read();
//     }

//     function write() {
//         BUS.write(data)
//     }

//     function clockPulse(enableOrLoad){
//         if (load && enable) {
//             console.error(`Both load and enable are HIGH in register A.`);
//         } else {
//             if (load && enableOrLoad === "load") { read(); }
//             if (enable && enableOrLoad === "enable") { write(); }
//         }
//     }

//     function getData(){
//         return data;
//     }

//     return {
//         clockPulse,
//         getData
//     }
// })();
