import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import { validForm } from '../../../utils/validationSchema';

const handler = async (req, res) => {
	const { body } = req;
	const data = JSON.parse(body);
	const fixedData = data.map((el, index) => {
		delete el.id;
		if (typeof el.fill === 'boolean')
			return { ...el, fill: JSON.stringify(el.fill) };
		return { ...el, index };
	});
	if (validForm(data).length !== 0)
		return res.status(401).json('Data is not valid');
	const { user } = await unstable_getServerSession(req, res, authOptions);
	if (user.id && user.pin !== null) {
		const response = await prisma.order.create({
			data: {
				authorId: user.id,
				informations: {
					createMany: {
						data: fixedData,
					},
				},
			},
		});
		return res.status(200).json(response);
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
