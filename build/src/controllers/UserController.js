var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { isUserType, parseBody } from "../utils/tools.js";
import { baseUrl } from "../config/userServerConfig.js";
import { myLogger } from "../utils/logger.js";
export class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = yield parseBody(req);
                if (!isUserType(body)) {
                    res.writeHead(400, { "Content-Type": "text/html" });
                    res.end("Bad request: invalid user data");
                    yield myLogger.log("Wrong params in addUser");
                    return;
                }
                const user = body;
                const isSuccess = this.userService.addUser(user);
                if (isSuccess) {
                    res.writeHead(201, { "Content-Type": "text/html" });
                    res.end("Created");
                    yield myLogger.save(`User with id ${user.id} was added`);
                }
                else {
                    res.writeHead(409, { "Content-Type": "text/html" });
                    res.end("User already exists");
                    yield myLogger.log("User already exists");
                }
            }
            catch (err) {
                res.writeHead(400, { "Content-Type": "text/html" });
                res.end("Bad request: invalid JSON");
                yield myLogger.log(`Error in addUser: ${err}`);
            }
        });
    }
    removeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = new URL(req.url, baseUrl);
            const param = url.searchParams.get("id");
            if (!param || Number.isNaN(parseInt(param))) {
                res.writeHead(400, { "Content-Type": "text/html" });
                res.end("Bad request: invalid ID");
                yield myLogger.log("Wrong params in removeUser");
                return;
            }
            const id = parseInt(param);
            try {
                const removed = this.userService.removeUser(id);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(removed));
                yield myLogger.save(`User with id ${id} was removed from DB`);
            }
            catch (err) {
                if (err.message === "404") {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end(`User with id ${id} not found`);
                    yield myLogger.log(`User with id ${id} not found`);
                }
                else {
                    res.writeHead(500, { "Content-Type": "text/html" });
                    res.end("Unexpected server error");
                    yield myLogger.save(`Server error in removeUser: ${err}`);
                }
            }
        });
    }
    getAllUsers(req, res) {
        try {
            const result = this.userService.getAllUsers();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(result));
            myLogger.log("All users responded");
        }
        catch (err) {
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end("Unexpected server error");
            myLogger.log(`Server error in getAllUsers: ${err}`);
        }
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = new URL(req.url, baseUrl);
            const param = url.searchParams.get("id");
            if (!param || Number.isNaN(parseInt(param))) {
                res.writeHead(400, { "Content-Type": "text/html" });
                res.end("Bad request: invalid ID");
                yield myLogger.log("Wrong params in getUserById");
                return;
            }
            const id = parseInt(param);
            try {
                const user = this.userService.getUserById(id);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(user));
                yield myLogger.log(`User with id ${id} responded`);
            }
            catch (err) {
                if (err.message === "404") {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end(`User with id ${id} not found`);
                    yield myLogger.log(`User with id ${id} not found`);
                }
                else {
                    res.writeHead(500, { "Content-Type": "text/html" });
                    res.end("Unexpected server error");
                    yield myLogger.save(`Server error in getUserById: ${err}`);
                }
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId;
            try {
                const body = yield parseBody(req);
                if (!isUserType(body)) {
                    res.writeHead(400, { "Content-Type": "text/html" });
                    res.end("Bad request: invalid user data");
                    yield myLogger.log("Invalid user data in updateUser");
                    return;
                }
                const user = body;
                userId = user.id;
                this.userService.updateUser(user);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end("User was successfully updated");
                yield myLogger.save(`User with id ${user.id} was updated`);
            }
            catch (err) {
                if (err.message === "404") {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end(`User with id ${userId !== null && userId !== void 0 ? userId : "unknown"} not found`);
                    yield myLogger.log(`User to update not found`);
                }
                else {
                    res.writeHead(500, { "Content-Type": "text/html" });
                    res.end("Unexpected server error");
                    yield myLogger.save(`Server error in updateUser: ${err}`);
                }
            }
        });
    }
}
