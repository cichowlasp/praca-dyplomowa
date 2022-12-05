import prisma from '../../lib/prisma';

const handler = async (req, res) => {
	const { body: id } = req;
	const form = await prisma.form.findFirst({
		where: {
			id,
		},
		include: {
			inputs: {
				orderBy: {
					id: 'asc',
				},
			},
			selects: {
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
