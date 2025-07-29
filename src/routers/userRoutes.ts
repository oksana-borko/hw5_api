import { IncomingMessage, ServerResponse } from "node:http";
import { UserController } from "../controllers/UserController.ts";
import { myLogger } from "../utils/logger.ts";
import { baseUrl } from "../config/userServerConfig.ts";

export const userRouters = async (req: IncomingMessage, res: ServerResponse, controller: UserController) => {
    const { url, method } = req;
    const parsedUrl = new URL(url!, baseUrl);

    await myLogger.log(`Received request ${url} ${method}`);
    switch (parsedUrl.pathname + method) {
        case "/api/usersPOST":
            await controller.addUser(req, res);
            break;
        case "/api/usersGET":
            controller.getAllUsers(req, res);
            break;
        case "/api/usersPUT":
            await controller.updateUser(req, res);
            break;
        case "/api/usersGET":
            await controller.getUserById(req, res);
            break;
        case "/api/usersDELETE":
            await controller.removeUser(req, res);
            break;
        case "/api/loggerGET":
            const result = myLogger.getLogArray();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(result));
            break;
        default:
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Page not found");
            break;
    }
};