import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { body } = req;
	const { user } = await unstable_getServerSession(req, res, authOptions);
	const { data, orderId } = JSON.parse(body);
	const realizationDate = data.realizationDate;
	delete data.realizationDate;
	if (user.id && user.admin === true) {
		await prisma.order.update({
			where: { id: orderId },
			data: { ...data, ...realizationDate },
		});
		return res.status(200).json('success');
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
