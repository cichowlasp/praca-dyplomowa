import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { body } = req;
	const { orderId, message } = JSON.parse(body);
	if (message.length === 0) return res.status(401).json('Data is not valid');
	const { user } = await unstable_getServerSession(req, res, authOptions);
	if (user.id) {
		const response = await prisma.message.create({
			data: {
				orderId,
				message,
				name: user?.name ? user.name : user.company,
			},
		});
		return res.status(200).json(response);
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
