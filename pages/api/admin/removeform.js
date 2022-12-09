import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { user } = await unstable_getServerSession(req, res, authOptions);
	const { body: id } = req;
	if (user.id && user.admin === true && id !== 'main') {
		await prisma.form.delete({
			where: {
				id,
			},
		});
		const options = await prisma.option.findMany({
			where: {
				formId: id,
			},
		});
		options.forEach(async (option) => {
			await prisma.option.update({
				where: {
					id: option.id,
				},
				data: {
					formId: null,
					formType: null,
				},
			});
		});
		return res.status(200).json('success');
	}
	return res.status(404).json('error');
};

export default handler;
