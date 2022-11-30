import prisma from '../../../lib/prisma';

const handler = async (req, res) => {
	const { body } = req;
	const data = JSON.parse(body);

	const pins = (
		await prisma.company.findMany({
			where: {
				createUserPin: { not: undefined },
			},
			select: {
				createUserPin: true,
			},
		})
	).map((el) => el.createUserPin);
	let pin = `${Math.floor(100000 + Math.random() * 900000)}`;
	while (pins.includes(pin)) {
		pin = `${Math.floor(100000 + Math.random() * 900000)}`;
	}

	try {
		const company = await prisma.company.create({
			data: { ...data, createUserPin: pin },
		});
		return res.status(200).json(company);
	} catch (error) {
		return res.status(400).json(error);
	}
};

export default handler;
