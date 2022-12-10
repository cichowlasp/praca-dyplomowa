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

	const parseData = emailData.orderInfo.map((el) => {
		delete el.id;
		delete el.index;
		return el;
	});

	const mailData = {
		from: process.env.EMAIL,
		to: emailData.to,
		subject: emailData.subject,
		text: 'Sent from: ',
		html: `<h3>You order informations</h3><div>${JSON.stringify(
			parseData,
			null,
			'\t'
		)}</div>`,
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
