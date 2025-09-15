"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openapiSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "E‑Mall API",
            version: "1.0.0",
            description: "E‑Mall backend OpenAPI documentation",
        },
        servers: [
            { url: "/", description: "Base" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [
        "src/routes/**/*.ts",
        "src/controllers/**/*.ts",
    ],
};
exports.openapiSpec = (0, swagger_jsdoc_1.default)(options);
