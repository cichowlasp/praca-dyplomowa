import prisma from '../../../lib/prisma';

const handler = async (req, res) => {
	const { body } = req;
	const { company, email } = JSON.parse(body);

	const pins = (
		await prisma.user.findMany({
			where: {
				pin: { not: null },
			},
			select: {
				pin: true,
			},
		})
	).map((el) => el.pin);
	let pin = `${Math.floor(100000 + Math.random() * 900000)}`;
	while (pins.includes(pin)) {
		pin = `${Math.floor(100000 + Math.random() * 900000)}`;
	}

	const user = await prisma.user.create({ data: { email, company, pin } });
	return res.status(200).json(user);
};

export default handler;
