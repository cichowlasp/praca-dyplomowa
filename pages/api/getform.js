import prisma from '../../lib/prisma';

const handler = async (req, res) => {
	const form = await prisma.form.findFirst({
		where: {
			id: 'main',
		},
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

	res.status(200).json({ form });
};

export default handler;
