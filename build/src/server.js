var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createServer } from "node:http";
import { PORT } from "./config/userServerConfig.js";
import { userRouters } from "./routers/userRoutes.js";
import { UserController } from "./controllers/UserController.js";
import { UserServiceEmbeddedImpl } from "./service/UserServiceEmbeddedImpl.js";
import { myLogger } from "./utils/logger.js";
export const launchServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const userService = new UserServiceEmbeddedImpl();
    yield userService.restoreDataFromFile();
    const userController = new UserController(userService);
    const server = createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield userRouters(req, res, userController);
    }));
    server.listen(PORT, () => {
        console.log(`UserServer runs at http://localhost:${PORT}`);
    });
    process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
        yield myLogger.log("Shutting down server...");
        yield userService.saveDataToFile();
        yield myLogger.save("Server shutdown by Ctrl+C");
        server.close(() => {
            process.exit(0);
        });
    }));
    process.on("uncaughtException", (err) => __awaiter(void 0, void 0, void 0, function* () {
        yield myLogger.save(`Uncaught Exception: ${err.message}\nStack: ${err.stack}`);
        console.error("Uncaught Exception:", err);
        yield userService.saveDataToFile();
        server.close(() => {
            process.exit(1);
        });
    }));
    process.on("unhandledRejection", (reason, promise) => __awaiter(void 0, void 0, void 0, function* () {
        yield myLogger.save(`Unhandled Rejection at: ${promise}\nReason: ${(reason === null || reason === void 0 ? void 0 : reason.stack) || reason}`);
        console.error("Unhandled Rejection:", reason);
        yield userService.saveDataToFile();
        server.close(() => {
            process.exit(1);
        });
    }));
});
