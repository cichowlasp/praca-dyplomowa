import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { body } = req;
	console.log(Object.values(req.body));
	if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
		console.log(Object.keys(req.body), req.body.constructor === Object);
		return res.status(401).json("You're not authorized");
	}
	const data = JSON.parse(body);
	const { user } = await unstable_getServerSession(req, res, authOptions);
	if (user.id && user.pin !== null) {
		const response = await prisma.order.create({
			data: {
				authorId: user.id,
				informations: {
					createMany: {
						data,
					},
				},
			},
		});
		return res.status(200).json(response);
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
