import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import prisma from '../../../lib/prisma';

const handler = async (req, res) => {
	const { user } = await unstable_getServerSession(req, res, authOptions);
	const { body: id } = req;
	if (user.id && user.pin !== null) {
		const form = await prisma.form.findFirst({
			where: { id },
			include: {
				inputs: true,
				selects: {
					include: {
						options: true,
					},
				},
				checkboxes: true,
			},
		});
		return res.status(200).json(form);
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
