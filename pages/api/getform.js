import prisma from '../../lib/prisma';

const handler = async (req, res) => {
	const form = await prisma.form.findFirst({
		where: {
			active: true,
		},
		include: {
			inputs: {
				orderBy: {
					id: 'asc',
				},
			},
			selects: {
				orderBy: {
					order: 'asc',
				},
				include: {
					options: {
						orderBy: {
							id: 'asc',
						},
					},
				},
			},
			checkboxes: true,
		},
	});

	res.status(200).json({ form });
};

export default handler;
