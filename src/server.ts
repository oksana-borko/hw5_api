import { createServer } from "node:http";
import { PORT } from "./config/userServerConfig.ts";
import { userRouters } from "./routers/userRoutes.ts";
import { UserController } from "./controllers/UserController.ts";
import { UserServiceEmbeddedImpl } from "./service/UserServiceEmbeddedImpl.ts";
import { myLogger } from "./utils/logger.ts";

export const launchServer = async () => {
    const userService = new UserServiceEmbeddedImpl();
    await userService.restoreDataFromFile();
    const userController = new UserController(userService);

    const server = createServer(async (req, res) => {
        await userRouters(req, res, userController);
    });

    server.listen(PORT, () => {
        console.log(`UserServer runs at http://localhost:${PORT}`);
    });


    process.on("SIGINT", async () => {
        await myLogger.log("Shutting down server...");
        await userService.saveDataToFile();
        await myLogger.save("Server shutdown by Ctrl+C");
        server.close(() => {
            process.exit(0);
        });
    });


    process.on("uncaughtException", async (err: Error) => {
        await myLogger.save(`Uncaught Exception: ${err.message}\nStack: ${err.stack}`);
        console.error("Uncaught Exception:", err);
        await userService.saveDataToFile();
        server.close(() => {
            process.exit(1);
        });
    });


    process.on("unhandledRejection", async (reason: any, promise: Promise<any>) => {
        await myLogger.save(`Unhandled Rejection at: ${promise}\nReason: ${reason?.stack || reason}`);
        console.error("Unhandled Rejection:", reason);
        await userService.saveDataToFile();
        server.close(() => {
            process.exit(1);
        });
    });
};