"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// aws.config.ts
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
const serviceUrl_1 = require("../serviceUrl");
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({
    region: serviceUrl_1.AWS_REGION,
    endpoint: serviceUrl_1.CloudflareR2ApiURL, // Cloudflare R2 endpoint
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
exports.default = s3;
