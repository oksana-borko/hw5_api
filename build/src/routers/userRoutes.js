var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { myLogger } from "../utils/logger.js";
import { baseUrl } from "../config/userServerConfig.js";
export const userRouters = (req, res, controller) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, method } = req;
    const parsedUrl = new URL(url, baseUrl);
    yield myLogger.log(`Received request ${url} ${method}`);
    switch (parsedUrl.pathname + method) {
        case "/api/usersPOST":
            yield controller.addUser(req, res);
            break;
        case "/api/usersGET":
            controller.getAllUsers(req, res);
            break;
        case "/api/usersPUT":
            yield controller.updateUser(req, res);
            break;
        case "/api/usersGET":
            yield controller.getUserById(req, res);
            break;
        case "/api/usersDELETE":
            yield controller.removeUser(req, res);
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
});
