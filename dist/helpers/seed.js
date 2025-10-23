"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const admin = yield prisma.user.upsert({
            where: { email: email },
            update: {
                password: hashedPassword,
                name: "Arman Mia",
                role: "admin",
                picture: "https://i.ibb.co/0f0Q3Fp/admin-avatar.png",
            },
            create: {
                name: "Arman Mia",
                email: email,
                password: hashedPassword,
                role: "admin",
                picture: "https://i.ibb.co/0f0Q3Fp/admin-avatar.png",
            },
        });
        console.log("user seeded successfully", admin.email);
    });
}
exports.default = seed;
