var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitter } from "node:events";
import fs from "fs/promises";
import path from "path";
class Logger extends EventEmitter {
    constructor() {
        super(...arguments);
        this.logArray = [];
        this.logFilePath = path.resolve("log.txt");
    }
    log(message) {
        this.emit("logged", message);
        this.addLogToArray(message);
    }
    save(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit("saved", message);
            yield this.saveToFile(message);
        });
    }
    saveToFile(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.addLogToArray(message);
            try {
                yield fs.appendFile(this.logFilePath, JSON.stringify({ date: new Date().toISOString(), message }) + "\n");
            }
            catch (err) {
                console.error("Failed to save log to file:", err);
            }
        });
    }
    addLogToArray(message) {
        this.logArray.push({ date: new Date().toISOString(), message });
    }
    getLogArray() {
        return [...this.logArray];
    }
}
export const myLogger = new Logger();
myLogger.on("logged", (message) => {
    console.log(new Date().toISOString(), message);
});
myLogger.on("saved", (message) => __awaiter(void 0, void 0, void 0, function* () {
}));
