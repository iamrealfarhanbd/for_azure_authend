import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
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

export default prisma;
