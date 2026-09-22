"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const blogs_routes_1 = require("../modules/blog/blogs.routes");
const projects_routes_1 = require("../modules/projects/projects.routes");
const skill_routes_1 = require("../modules/skill/skill.routes");
const contact_routes_1 = require("../modules/contact/contact.routes");
const contactMessage_route_1 = require("../modules/contactMessage/contactMessage.route");
const experience_route_1 = require("../modules/experiences/experience.route");
const overview_route_1 = require("../modules/overview/overview.route");
const chatbot_route_1 = require("../modules/chatbot/chatbot.route");
const knowledge_route_1 = require("../modules/knowledge/knowledge.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.authRoute,
    },
    {
        path: "/blog",
        route: blogs_routes_1.blgoRoute,
    },
    {
        path: "/project",
        route: projects_routes_1.projectroute,
    },
    {
        path: "/skill",
        route: skill_routes_1.skillRoute,
    },
    {
        path: "/contact",
        route: contact_routes_1.contactRoute,
    },
    {
        path: "/contact-messages",
        route: contactMessage_route_1.contactMessageRoute,
    },
    {
        path: "/experience",
        route: experience_route_1.experienceRoutes,
    },
    {
        path: "/overview",
        route: overview_route_1.overviewRoute,
    },
    {
        path: "/chat",
        route: chatbot_route_1.chatbotRoute,
    },
    {
        path: "/knowledge",
        route: knowledge_route_1.knowledgeRoute,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
