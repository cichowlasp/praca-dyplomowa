import prisma from '../../lib/prisma';

const handler = async (req, res) => {
	const { body } = req;
	// if (Object.keys(req.body).length === 0) {
	// 	return res.status(400).json('are you dumb?');
	// }
	// const { id: orderId } = await prisma.order
	// 	.create({
	// 		data: {
	// 			authorId: 'cl9q80pjc0000stmlzsqn2vv4',
	// 		},
	// 	})
	// 	.then((res) => res);
	// const data = JSON.parse(body).map((el) => {
	// 	return { orderId, ...el };
	// });

	// await prisma.info.createMany({
	// 	data,
	// });

	res.status(200).json('test');
};

export default handler;
