"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: [
        {
            emit: "event",
            level: "query",
        },
    ],
});
prisma.$on("query", (e) => {
    console.log("Timestamp: ", e.timestamp);
    console.log("Query: ", e.query);
    console.log("Duration: ", e.duration);
});
exports.default = prisma;
