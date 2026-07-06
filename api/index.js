// Vercel Serverless Function Entry Point
// This file is CommonJS and lives outside the ESM "type: module" root scope
// because Vercel reads package.json in each directory independently.

const app = require('../server/server.js');

module.exports = app;
