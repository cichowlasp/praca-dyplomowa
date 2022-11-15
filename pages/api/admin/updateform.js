import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req, res) => {
	const { body } = req;
	const { user } = await unstable_getServerSession(req, res, authOptions);
	const { id, data } = JSON.parse(body);
	if (user.id && user.admin === true) {
		data.inputs.forEach(async (input) => {
			await prisma.input.updateMany({
				where: {
					id: input.id,
				},
				data: input,
			});
		});
		data.selects.forEach(async (select) => {
			select.options.forEach(async (option) => {
				await prisma.option.update({
					where: {
						id: option.id,
					},
					data: option,
				});
			});
			delete select.options;
			await prisma.select.update({
				where: {
					id: select.id,
				},
				data: select,
			});
		});
		data.checkboxes.forEach(async (checkbox) => {
			await prisma.checkBox.update({
				where: {
					id: checkbox.id,
				},
				data: checkbox,
			});
		});
		return res.status(200).json('Success');
	}
	return res.status(401).json("You're not authorized");
};

export default handler;
