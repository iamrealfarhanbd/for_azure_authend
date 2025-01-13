import nodemailer from "nodemailer";
import Email from "email-templates";
import path from "path";
let transporter = nodemailer.createTransport({
  host: "mail.lilliputdigital.com",
  port: 465,
  secure: true,
  auth: {
    user: "adil@lilliputdigital.com",
    pass: "adil@lilliputdigital",
  },
});

// Initialize Email instance with template settings
const email = new Email({
  message: {
    from: "adil@lilliputdigital.com",
  },
  // Use nodemailer transport in email-templates
  transport: transporter,
  send: true,
  preview: false, // You can enable preview for development
  views: {
    root: path.join(process.cwd(), "emailTemplates"), // Directory for storing email templates
    options: {
      extension: "ejs", // Optionally use .jsx or .js
    },
  },
});
type EmailMetaInformation = {
  senderName: string;
  senderEmail: string;
  emailSubject: string;
  receiverEmail: string;
};

export const sendEmail = async (
  emailMetaInformation: EmailMetaInformation,
  templateName: string, // The name of the email template
  templateData: object // Data passed to the template
): Promise<void> => {
  try {
    // Send email using the specified template
    await email.send({
      template: templateName, // Name of the template (e.g., 'otp-verification')
      message: {
        to: emailMetaInformation.receiverEmail,
        from: `"${emailMetaInformation.senderName}" <${emailMetaInformation.senderEmail}>`,
        subject: emailMetaInformation.emailSubject,
      },
      locals: templateData, // Data to pass to the template (e.g., OTP, username)
    });
    console.log(
      "Email sent successfully",
      templateData,
      "Root file address",
      path.join(process.cwd(), "emailTemplates")
    );
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
