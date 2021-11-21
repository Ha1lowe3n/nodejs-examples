const { Worker } = require("worker_threads");
const { fork } = require("child_process");
const perf_hooks = require("perf_hooks");

const performanceObserver = new perf_hooks.PerformanceObserver(
    (items, observer) => {
        items.getEntries().forEach((entry) => {
            console.log(`${entry.name}: ${entry.duration}`);
        });
    }
);
performanceObserver.observe({ entryTypes: ["measure"] });

const workerFunc = (array) => {
    return new Promise((resolve, reject) => {
        performance.mark("start worker");

        const worker = new Worker("./worker.js", {
            workerData: { array },
        });

        worker.on("message", (message) => {
            performance.mark("end worker");
            performance.measure("worker", "start worker", "end worker");

            resolve(message);
        });
    });
};

const forkFunc = (array) => {
    return new Promise((resolve, reject) => {
        performance.mark("start fork");

        const forkProcess = fork("./fork.js");

        forkProcess.send({ array });

        forkProcess.on("message", (message) => {
            performance.mark("end fork");
            performance.measure("fork", "start fork", "end fork");

            resolve(message);
        });
    });
};

const main = async () => {
    await workerFunc([25, 19, 48, 30]);
    await forkFunc([25, 19, 48, 30]);
};
main();
