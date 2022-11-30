import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { body } = req;
	const user = JSON.parse(body);
	const session = await unstable_getServerSession(req, res, authOptions);
	if (
		(body && session?.user.admin === true) ||
		session?.company.id === user.companyId
	) {
		await prisma.user.delete({
			where: { id: user.id },
		});
		return res.status(200).json('success');
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
