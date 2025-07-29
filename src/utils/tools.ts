import { IncomingMessage } from "node:http";

export const sayHi = (name: string): void => {
    console.log(`Hello ${name}`);
};

export async function parseBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(new Error("Invalid JSON"));
            }
        });
        req.on("error", (err) => reject(err));
    });
}

export const isUserType = (obj: any): boolean => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "number" &&
        obj.id > 0 &&
        typeof obj.userName === "string" &&
        obj.userName.trim().length > 0
    );
};