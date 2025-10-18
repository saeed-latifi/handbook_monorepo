import nodemailer, { type SendMailOptions } from "nodemailer";
import { emailFrom, emailHost, emailName, emailPassword, emailUser, mailPort } from "@repo/config-static";

const transporter = nodemailer.createTransport({
	host: emailHost,
	port: mailPort,
	secure: false, // true for 465, false for other ports
	auth: {
		user: emailUser,
		pass: emailPassword,
	},
	tls: {
		rejectUnauthorized: false, // Only use for testing/development
	},
});

export const sendMail = async ({ to, subject, html }: { to: string; subject: string; html: string }): Promise<boolean> => {
	try {
		const mailOptions: SendMailOptions = {
			from: {
				name: emailName ?? "",
				address: emailFrom ?? "",
			},
			to,
			subject,
			html,
		};

		await transporter.sendMail(mailOptions);
		return true;
	} catch (err) {
		return false;
	}
};

export async function sendForgetPasswordMail({ email }: { email: string }) {
	// TODO create password reset Link
	const resetLink = "resetLink";
	const html = `
        <div>
            <h1>Password Reset Request</h1>
            <p>You requested to reset your password. Click the link below to proceed:</p>
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
    `;

	return await sendMail({ subject: "forget password", html, to: email });
}
