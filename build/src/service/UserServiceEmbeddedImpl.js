var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs/promises";
import path from "path";
import { myLogger } from "../utils/logger.js";
export class UserServiceEmbeddedImpl {
    constructor() {
        this.users = [];
        this.dataFilePath = path.resolve("data.txt");
    }
    addUser(user) {
        if (this.users.findIndex((u) => u.id === user.id) === -1) {
            this.users.push(user);
            return true;
        }
        return false;
    }
    getAllUsers() {
        return [...this.users];
    }
    getUserById(id) {
        const user = this.users.find((item) => item.id === id);
        if (!user)
            throw new Error("404");
        return user;
    }
    removeUser(id) {
        const index = this.users.findIndex((item) => item.id === id);
        if (index === -1)
            throw new Error("404");
        const removed = this.users[index];
        this.users.splice(index, 1);
        return removed;
    }
    updateUser(newUser) {
        const index = this.users.findIndex((item) => item.id === newUser.id);
        if (index === -1)
            throw new Error("404");
        this.users[index] = newUser;
    }
    restoreDataFromFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fs.readFile(this.dataFilePath, { encoding: "utf-8" });
                this.users = data ? JSON.parse(data) : [];
                yield myLogger.save("Data was restored from file");
                return "Ok";
            }
            catch (err) {
                this.users = [{ id: 2, userName: "Bender" }];
                yield myLogger.save("File to restore not found, initialized with default user");
                return "Ok";
            }
        });
    }
    saveDataToFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs.writeFile(this.dataFilePath, JSON.stringify(this.users));
                yield myLogger.save("Data was saved to file");
                return "Ok";
            }
            catch (err) {
                yield myLogger.save(`Error saving data to file: ${err}`);
                return "Error";
            }
        });
    }
}
