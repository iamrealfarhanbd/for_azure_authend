import "dotenv/config";
import express from "express";
import { Server } from "http";
import app from "./app";
import config from "./app/config/config";
const port = config.PORT || 5000;

async function main() {
  app.listen(port, () => {
    console.log("App is running on port", port);
  });
}

main();
