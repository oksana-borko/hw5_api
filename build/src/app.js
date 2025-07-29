import { launchServer } from "./server.js";
launchServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
