import { launchServer } from "./server.ts";

launchServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});