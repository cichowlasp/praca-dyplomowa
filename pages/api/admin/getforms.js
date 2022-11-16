import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import prisma from '../../../lib/prisma';

const handler = async (req, res) => {
	const { user } = await unstable_getServerSession(req, res, authOptions);
	if (user.id && user.admin === true) {
		const forms = await prisma.form.findMany({
			orderBy: { id: 'desc' },
			include: {
				inputs: {
					orderBy: { id: 'asc' },
				},
				selects: {
					orderBy: { id: 'asc' },
					include: {
						options: {
							orderBy: { id: 'asc' },
						},
					},
				},
				checkboxes: {
					orderBy: { id: 'asc' },
				},
			},
		});
		return res.status(200).json(forms);
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
