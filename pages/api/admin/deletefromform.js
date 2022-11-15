import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { body } = req;
	const { type, id } = JSON.parse(body);
	const { user } = await unstable_getServerSession(req, res, authOptions);
	if (body && user.admin === true) {
		switch (type) {
			case 'input':
				await prisma.input.delete({
					where: { id },
				});
				break;
			case 'select':
				await prisma.select.delete({
					where: { id },
				});
				break;
			case 'checkbox':
				console.log(id);
				await prisma.checkBox.delete({
					where: { id },
				});
				break;
			default:
				break;
		}
		return res.status(200).json('success');
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
