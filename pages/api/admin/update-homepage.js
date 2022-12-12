import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { user } = await unstable_getServerSession(req, res, authOptions);
	const { body } = req;
	const data = JSON.parse(body);
	const welcome = await prisma.welcome.findFirst();
	if (user.id && user.admin) {
		await prisma.welcome.update({
			where: {
				id: welcome?.id,
			},
			data,
		});

		return res.status(200).json(welcome);
	}
	return res.status(404).json('error');
};

export default handler;
