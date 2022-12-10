const handler = async (req, res) => {
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
		to: 'cichowlas.p@gmail.com',
		subject: emailData.subject,
		html: `<h3>Your Company ID: ${emailData.id}</h3><div>This ID is needed to access your company account</div>`,
	};

	transporter.sendMail(mailData, (err, info) => {
		if (err) return res.status(404).json(err);
		else return res.status(404).json(info);
	});
};

export default handler;
