const { Worker } = require("worker_threads");

const compute = (array) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker("./worker.js", {
            workerData: { array },
        });

        worker.on("message", (message) => {
            console.log(worker.threadId);
            resolve(message);
        });

        worker.on("error", (error) => {
            reject(error);
        });

        worker.on("exit", () => {
            console.log("Завершил работу");
        });
    });
};

const main = async () => {
    try {
        performance.mark("start");
        const result = await Promise.all([
            compute([25, 20, 19, 48, 30, 50]),
            compute([25, 20, 19, 48, 30, 50]),
            compute([25, 20, 19, 48, 30, 50]),
            compute([25, 20, 19, 48, 30, 50]),
        ]);
        console.log(result);

        performance.mark("end");

        performance.measure("main", "start", "end");
        console.log(performance.getEntriesByName("main").pop());
    } catch (err) {
        console.log(err.message);
    }
};

setTimeout(() => console.log("tomeout"), 2000);
main();
