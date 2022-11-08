import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import prisma from '../../../lib/prisma';

const handler = async (req, res) => {
	const { user } = await unstable_getServerSession(req, res, authOptions);
	if (user.id && user.admin === true) {
		const orders = await prisma.order.findMany({
			orderBy: { id: 'asc' },
			include: {
				informations: {
					orderBy: {
						name: 'desc',
					},
				},
			},
		});
		console.log(orders);
		return res.status(200).json(orders);
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
