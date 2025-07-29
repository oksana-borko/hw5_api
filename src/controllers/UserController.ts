import { UserService } from "../service/UserService.ts";
import { isUserType, parseBody } from "../utils/tools.ts";
import { User } from "../model/userTypes.ts";
import { IncomingMessage, ServerResponse } from "node:http";
import { baseUrl } from "../config/userServerConfig.ts";
import { myLogger } from "../utils/logger.ts";

export class UserController {
    constructor(private userService: UserService) {}

    async addUser(req: IncomingMessage, res: ServerResponse) {
        try {
            const body = await parseBody(req);
            if (!isUserType(body)) {
                res.writeHead(400, { "Content-Type": "text/html" });
                res.end("Bad request: invalid user data");
                await myLogger.log("Wrong params in addUser");
                return;
            }
            const user = body as User;
            const isSuccess = this.userService.addUser(user);
            if (isSuccess) {
                res.writeHead(201, { "Content-Type": "text/html" });
                res.end("Created");
                await myLogger.save(`User with id ${user.id} was added`);
            } else {
                res.writeHead(409, { "Content-Type": "text/html" });
                res.end("User already exists");
                await myLogger.log("User already exists");
            }
        } catch (err) {
            res.writeHead(400, { "Content-Type": "text/html" });
            res.end("Bad request: invalid JSON");
            await myLogger.log(`Error in addUser: ${err}`);
        }
    }

    async removeUser(req: IncomingMessage, res: ServerResponse) {
        const url = new URL(req.url!, baseUrl);
        const param = url.searchParams.get("id");

        if (!param || Number.isNaN(parseInt(param))) {
            res.writeHead(400, { "Content-Type": "text/html" });
            res.end("Bad request: invalid ID");
            await myLogger.log("Wrong params in removeUser");
            return;
        }
        const id = parseInt(param);
        try {
            const removed = this.userService.removeUser(id);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(removed));
            await myLogger.save(`User with id ${id} was removed from DB`);
        } catch (err: any) {
            if (err.message === "404") {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end(`User with id ${id} not found`);
                await myLogger.log(`User with id ${id} not found`);
            } else {
                res.writeHead(500, { "Content-Type": "text/html" });
                res.end("Unexpected server error");
                await myLogger.save(`Server error in removeUser: ${err}`);
            }
        }
    }

    getAllUsers(req: IncomingMessage, res: ServerResponse) {
        try {
            const result = this.userService.getAllUsers();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(result));
            myLogger.log("All users responded");
        } catch (err) {
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end("Unexpected server error");
            myLogger.log(`Server error in getAllUsers: ${err}`);
        }
    }

    async getUserById(req: IncomingMessage, res: ServerResponse) {
        const url = new URL(req.url!, baseUrl);
        const param = url.searchParams.get("id");

        if (!param || Number.isNaN(parseInt(param))) {
            res.writeHead(400, { "Content-Type": "text/html" });
            res.end("Bad request: invalid ID");
            await myLogger.log("Wrong params in getUserById");
            return;
        }
        const id = parseInt(param);
        try {
            const user = this.userService.getUserById(id);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(user));
            await myLogger.log(`User with id ${id} responded`);
        } catch (err: any) {
            if (err.message === "404") {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end(`User with id ${id} not found`);
                await myLogger.log(`User with id ${id} not found`);
            } else {
                res.writeHead(500, { "Content-Type": "text/html" });
                res.end("Unexpected server error");
                await myLogger.save(`Server error in getUserById: ${err}`);
            }
        }
    }

    async updateUser(req: IncomingMessage, res: ServerResponse) {
        let userId: number | undefined;
        try {
            const body = await parseBody(req);
            if (!isUserType(body)) {
                res.writeHead(400, { "Content-Type": "text/html" });
                res.end("Bad request: invalid user data");
                await myLogger.log("Invalid user data in updateUser");
                return;
            }
            const user = body as User;
            userId = user.id;
            this.userService.updateUser(user);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end("User was successfully updated");
            await myLogger.save(`User with id ${user.id} was updated`);
        } catch (err: any) {
            if (err.message === "404") {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end(`User with id ${userId ?? "unknown"} not found`);
                await myLogger.log(`User to update not found`);
            } else {
                res.writeHead(500, { "Content-Type": "text/html" });
                res.end("Unexpected server error");
                await myLogger.save(`Server error in updateUser: ${err}`);
            }
        }
    }
}