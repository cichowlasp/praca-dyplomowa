import prisma from '../../../lib/prisma';

const handler = async (req, res) => {
	const { body } = req;
	const data = JSON.parse(body);
	const company = await prisma.company.findFirst({
		where: {
			companyEmail: data.companyEmail,
			secretPhrase: data.secretPhrase,
			createUserPin: data.pin,
		},
	});
	if (company) {
		const userPins = (
			await prisma.user.findMany({
				where: { companyId: company.id },
			})
		).map((el) => el.pin);
		let userPin = `${Math.floor(100000 + Math.random() * 900000)}`;
		while (userPins.includes(userPin)) {
			userPin = `${Math.floor(100000 + Math.random() * 900000)}`;
		}

		const user = await prisma.user.create({
			data: {
				company: company.companyName,
				email: data.email,
				name: data.name,
				surname: data.surname,
				phoneNumber: data.phoneNumber,
				companyId: company.id,
				pin: userPin,
			},
		});
		const pins = [company.createUserPin];
		let pin = `${Math.floor(100000 + Math.random() * 900000)}`;
		while (pins.includes(pin)) {
			pin = `${Math.floor(100000 + Math.random() * 900000)}`;
		}

		await prisma.company.update({
			where: { id: company.id },
			data: { createUserPin: pin },
		});

		return res
			.status(200)
			.json({ ...user, companyEmail: data.companyEmail });
	}
	return res.status(401).json('Pin or secret is invalid');
};

export default handler;
