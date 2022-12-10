import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { body } = req;
	const { user } = await unstable_getServerSession(req, res, authOptions);
	const data = JSON.parse(body);
	if (user.id && user.pin !== null) {
		data.forEach(async (element) => {
			await prisma.info.update({
				where: {
					id: element.id,
				},
				data: {
					fill: element.fill,
				},
			});
		});
		await prisma.order.update({
			where: { id: data[0].orderId },
			data: {
				edited: true,
				editedAt: new Date(),
			},
		});
		return res.status(200).json('success');
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
