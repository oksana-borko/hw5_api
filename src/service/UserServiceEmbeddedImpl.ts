import { User } from "../model/userTypes.ts";
import { UserService } from "./UserService.ts";
import { UserFilePersistenceService } from "./UserFilePersistenceService.ts";
import fs from "fs/promises";
import path from "path";
import { myLogger } from "../utils/logger.ts";

export class UserServiceEmbeddedImpl implements UserService, UserFilePersistenceService {
    private users: User[] = [];
    private dataFilePath = path.resolve("data.txt");

    addUser(user: User): boolean {
        if (this.users.findIndex((u: User) => u.id === user.id) === -1) {
            this.users.push(user);
            return true;
        }
        return false;
    }

    getAllUsers(): User[] {
        return [...this.users];
    }

    getUserById(id: number): User {
        const user = this.users.find((item) => item.id === id);
        if (!user) throw new Error("404");
        return user;
    }

    removeUser(id: number): User {
        const index = this.users.findIndex((item) => item.id === id);
        if (index === -1) throw new Error("404");
        const removed = this.users[index];
        this.users.splice(index, 1);
        return removed;
    }

    updateUser(newUser: User): void {
        const index = this.users.findIndex((item) => item.id === newUser.id);
        if (index === -1) throw new Error("404");
        this.users[index] = newUser;
    }

    async restoreDataFromFile(): Promise<string> {
        try {
            const data = await fs.readFile(this.dataFilePath, { encoding: "utf-8" });
            this.users = data ? JSON.parse(data) : [];
            await myLogger.save("Data was restored from file");
            return "Ok";
        } catch (err) {
            this.users = [{ id: 2, userName: "Bender" }];
            await myLogger.save("File to restore not found, initialized with default user");
            return "Ok";
        }
    }

    async saveDataToFile(): Promise<string> {
        try {
            await fs.writeFile(this.dataFilePath, JSON.stringify(this.users));
            await myLogger.save("Data was saved to file");
            return "Ok";
        } catch (err) {
            await myLogger.save(`Error saving data to file: ${err}`);
            return "Error";
        }
    }
}