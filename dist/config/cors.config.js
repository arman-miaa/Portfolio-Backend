"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
// এই অ্যারেতে আপনার অনুমোদিত ডোমেনগুলো যোগ করুন।
const ALLOWED_ORIGINS = [
    "https://arman-mia.vercel.app", // ডেপ্লয় করা ফ্রন্টএন্ড
    "http://localhost:3000", // লোকাল ডেভেলপমেন্ট
];
// এই ফাংশনটি Express অ্যাপ্লিকেশনে CORS সেটআপ করে
const setupCors = (app) => {
    const corsOptions = {
        // origin: অনুমোদিত ডোমেনগুলির তালিকা
        origin: ALLOWED_ORIGINS,
        // credentials: true -> এটি সবচেয়ে জরুরি। কুকি আদান-প্রদানের জন্য অপরিহার্য।
        credentials: true,
        // methods: অনুমোদিত HTTP মেথডগুলি
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        // optionsSuccessStatus: 204 -> Pre-flight requests সফলভাবে হ্যান্ডেল করার জন্য
        optionsSuccessStatus: 204,
    };
    // এটিই যথেষ্ট: cors middleware সব OPTIONS request হ্যান্ডেল করে
    app.use((0, cors_1.default)(corsOptions));
    // 🔥 গুরুত্বপূর্ণ: নিচের এই লাইনটি মুছে দেওয়া হয়েছে কারণ এটিই TypeError দিচ্ছিল।
    // app.options('*', cors(corsOptions));
    console.log(`CORS set up for origins: ${ALLOWED_ORIGINS.join(", ")}`);
};
exports.default = setupCors;
