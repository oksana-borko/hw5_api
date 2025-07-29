import { EventEmitter } from "node:events";
import fs from "fs/promises";
import path from "path";

class Logger extends EventEmitter {
    private logArray: Array<{ date: string; message: string }> = [];
    private logFilePath = path.resolve("log.txt");

    log(message: string) {
        this.emit("logged", message);
        this.addLogToArray(message);
    }

    async save(message: string) {
        this.emit("saved", message);
        await this.saveToFile(message);
    }

    private async saveToFile(message: string) {
        this.addLogToArray(message);
        try {
            await fs.appendFile(this.logFilePath, JSON.stringify({ date: new Date().toISOString(), message }) + "\n");
        } catch (err) {
            console.error("Failed to save log to file:", err);
        }
    }

    private addLogToArray(message: string) {
        this.logArray.push({ date: new Date().toISOString(), message });
    }

    getLogArray() {
        return [...this.logArray];
    }
}

export const myLogger = new Logger();

myLogger.on("logged", (message: string) => {
    console.log(new Date().toISOString(), message);
});

myLogger.on("saved", async (message: string) => {

});