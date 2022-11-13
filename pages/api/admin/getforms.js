import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import prisma from '../../../lib/prisma';

const handler = async (req, res) => {
	const { user } = await unstable_getServerSession(req, res, authOptions);
	if (user.id && user.admin === true) {
		const forms = await prisma.form.findMany({
			where: {
				pin: { not: null },
			},
			orderBy: { id: 'asc' },
			include: {
				orders: {
					orderBy: { id: 'asc' },
					include: {
						informations: {
							orderBy: {
								name: 'desc',
							},
						},
						messages: {
							orderBy: {
								date: 'asc',
							},
						},
					},
				},
			},
		});
		return res.status(200).json(orders);
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
