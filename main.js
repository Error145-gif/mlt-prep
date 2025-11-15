"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hono_1 = require("hono");
var deno_1 = require("hono/deno");
var app = new hono_1.Hono();
// 1) Serve anything in /assets/**
app.use("/assets/*", (0, deno_1.serveStatic)({ root: "./dist/assets" }));
// 2) Catch *all* other files in dist (CSS, JS, images, etc.)
app.use("*", (0, deno_1.serveStatic)({ root: "./dist" }));
// 3) Fallback to index.html for the SPA
app.get("*", (0, deno_1.serveStatic)({ path: "./dist/index.html" }));
Deno.serve(app.fetch);
