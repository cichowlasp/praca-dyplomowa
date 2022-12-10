import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { user } = await unstable_getServerSession(req, res, authOptions);
	const data = req.body;
	const emailData = JSON.parse(data);

	const nodemailer = require('nodemailer');
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const mailData = {
		from: process.env.EMAIL,
		to: emailData.to,
		subject: emailData.subject,
		html: `<h3>Your login pin: ${emailData.pin}</h3><div>To login you need pin and also your ${emailData.company} secretphrase (ask admin for this :))</div>`,
	};
	if (user.id) {
		transporter.sendMail(mailData, (err, info) => {
			if (err) return res.status(404).json(err);
			else return res.status(404).json(info);
		});
	}
	res.status(404).json('auth error');
};

export default handler;
