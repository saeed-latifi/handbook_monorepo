import nodemailer, { type SendMailOptions } from "nodemailer";
import { appState, emailFrom, emailHost, emailName, emailPassword, emailUser } from "@repo/config-static";

const transporter = nodemailer.createTransport({
	host: emailHost,
	port: appState === "prod" ? 465 : 587,
	secure: appState === "prod" ? true : false, // true for 465, false for other ports
	auth: {
		user: emailUser,
		pass: emailPassword,
	},
	tls: {
		rejectUnauthorized: appState === "prod" ? false : true, // Only use for testing/development
	},
});

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
	console.log({ appState });

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

		const info = await transporter.sendMail(mailOptions);

		return info;
	} catch (err) {}
}

export async function sendForgetPasswordMail({ email, password }: { email: string; password: string }) {
	// TODO create password reset Link
	const resetLink = "resetLink";
	const html = `
        <div>
		<p>${password}</p>
            <h1>Password Reset Request</h1>
            <p>You requested to reset your password. Click the link below to proceed:</p>
            // <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
    `;

	return await sendMail({ subject: "forget password", html, to: email });
}
