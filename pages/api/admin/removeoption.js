import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { user } = await unstable_getServerSession(req, res, authOptions);
	const { body } = req;
	if (user.id && user.admin === true) {
		await prisma.option.delete({
			where: {
				id: body,
			},
		});
		return res.status(200).json('success');
	}
	return res.status(404).json('error');
};

export default handler;
