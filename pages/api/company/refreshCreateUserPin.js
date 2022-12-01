import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { company } = await unstable_getServerSession(req, res, authOptions);
	if (company.id) {
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

		await prisma.company.update({
			where: { id: company.id },
			data: { createUserPin: pin },
		});
		return res.status(200).json(pin);
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
