import prisma from '../../../lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import {
	defaultInput,
	defaultSelect,
	defaultCheckBox,
} from '../../../consts/formElemets';

const handler = async (req, res) => {
	const { user } = await unstable_getServerSession(req, res, authOptions);
	const { body } = req;
	const { formId, type } = JSON.parse(body);
	console.log(formId, type);
	if (user.id && user.admin === true) {
		switch (type) {
			case 'input':
				await prisma.input.create({
					data: { ...defaultInput, formId: formId },
				});
				break;
			case 'select':
				await prisma.select.create({
					data: { ...defaultSelect, formId },
				});
				break;
			case 'checkbox':
				await prisma.checkBox.create({
					data: { ...defaultCheckBox, formId },
				});
				break;

			default:
				res.status(404).json('error');
				break;
		}
		return res.status(200).json('success');
	}
	return res.status(404).json('error');
};

export default handler;
