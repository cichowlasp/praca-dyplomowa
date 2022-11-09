import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { body } = req;
	const { orderId, message } = JSON.parse(body);
	const { user } = await unstable_getServerSession(req, res, authOptions);
	if (user.id) {
		const response = await prisma.message.create({});
		return res.status(200).json(response);
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
