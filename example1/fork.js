const { compute } = require("./factorial.js");

process.on("message", (msg) => {
    process.send(compute(msg));
    process.disconnect();
});
