import prisma from '../../lib/prisma';

const handler = async (req, res) => {
	const { id } = await prisma.form.findFirst({
		where: {
			id: 'main',
		},
	});
	const inputs = await prisma.input.findMany({
		where: {
			formId: id,
		},
	});
	const selects = await prisma.select.findMany({
		where: {
			formId: id,
		},
	});
	console.log(id, inputs);
	res.status(200).json({ inputs });
};

export default handler;
