import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { body } = req;
	const { user } = await unstable_getServerSession(req, res, authOptions);
	const { options } = JSON.parse(body);
	if (user.id && user.admin === true) {
		options.forEach(async (option) => {
			await prisma.option.update({
				where: {
					id: option.id,
				},
				data: option,
			});
		});
		return res.status(200).json('Success');
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
