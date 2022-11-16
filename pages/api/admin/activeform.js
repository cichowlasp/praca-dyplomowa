import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { body: id } = req;
	const { user } = await unstable_getServerSession(req, res, authOptions);
	if (user.id && user.admin === true) {
		await prisma.form.updateMany({
			data: {
				active: false,
			},
		});
		await prisma.form.update({
			where: {
				id,
			},
			data: {
				active: true,
			},
		});
		return res.status(200).json('Success');
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
