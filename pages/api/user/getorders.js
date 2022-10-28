import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import prisma from '../../../lib/prisma';

const secret = process.env.NEXTAUTH_SECRET;

const handler = async (req, res) => {
	const { user } = await unstable_getServerSession(req, res, authOptions);
	if (user.id && user.pin !== null) {
		const orders = await prisma.order.findMany({
			where: { authorId: user.id },
			include: {
				informations: true,
			},
		});
		res.status(200).json(orders);
	} else {
		res.status(401).json("You're not authorized");
	}
};

export default handler;
