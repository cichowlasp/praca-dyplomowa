import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { company } = await unstable_getServerSession(req, res, authOptions);
	if (company.id) {
		const { pin } = await prisma.company.findFirst({
			where: { id: company.id },
		});
		return res.status(200).json(pin);
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
