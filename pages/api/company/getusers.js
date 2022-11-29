import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { company } = await unstable_getServerSession(req, res, authOptions);
	if (company.id) {
		const users = await prisma.company.findFirst({
			where: { id: company.id },
			include: {
				users: {
					orderBy: {
						createdAt: 'asc',
					},
				},
			},
		});
		return res.status(200).json(users);
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
