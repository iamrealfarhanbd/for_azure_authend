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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_templates_1 = __importDefault(require("email-templates"));
const path_1 = __importDefault(require("path"));
let transporter = nodemailer_1.default.createTransport({
    host: "mail.lilliputdigital.com",
    port: 465,
    secure: true,
    auth: {
        user: "adil@lilliputdigital.com",
        pass: "adil@lilliputdigital",
    },
});
// Initialize Email instance with template settings
const email = new email_templates_1.default({
    message: {
        from: "adil@lilliputdigital.com",
    },
    // Use nodemailer transport in email-templates
    transport: transporter,
    send: true,
    preview: false, // You can enable preview for development
    views: {
        root: path_1.default.join(process.cwd(), "emailTemplates"), // Directory for storing email templates
        options: {
            extension: "ejs", // Optionally use .jsx or .js
        },
    },
});
const sendEmail = (emailMetaInformation, templateName, // The name of the email template
templateData // Data passed to the template
) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Send email using the specified template
        yield email.send({
            template: templateName, // Name of the template (e.g., 'otp-verification')
            message: {
                to: emailMetaInformation.receiverEmail,
                from: `"${emailMetaInformation.senderName}" <${emailMetaInformation.senderEmail}>`,
                subject: emailMetaInformation.emailSubject,
            },
            locals: templateData, // Data to pass to the template (e.g., OTP, username)
        });
        console.log("Email sent successfully", templateData, "Root file address", path_1.default.join(process.cwd(), "emailTemplates"));
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
});
exports.sendEmail = sendEmail;
