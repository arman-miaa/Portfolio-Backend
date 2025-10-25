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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../config/db");
const sanitizeUser = (user) => {
    const { password } = user, rest = __rest(user, ["password"]);
    return rest;
};
const isProd = process.env.NODE_ENV === "production";
// Login
const loginWithEmailAndPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Email and password are required" });
        }
        const user = yield db_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res
                .status(401)
                .json({ success: false, message: "Invalid password" });
        // create jwt token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({
            success: true,
            message: "Login successful",
            user: sanitizeUser(user),
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, error, message: "Server error" });
    }
});
// Logout
const logout = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProd,
            sameSite: "none",
            maxAge: 0,
        });
        return res.json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ success: false, message: "Logout failed" });
    }
});
// Get current logged-in user
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token)
            return res
                .status(401)
                .json({ success: false, message: "Not authenticated" });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield db_1.prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        return res.json({ success: true, user: sanitizeUser(user) });
    }
    catch (error) {
        console.error("Get current user error:", error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
});
exports.AuthController = {
    loginWithEmailAndPassword,
    logout,
    getCurrentUser, // ✅ add this
};
