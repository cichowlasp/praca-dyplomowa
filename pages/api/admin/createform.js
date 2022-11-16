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
	const { body: name } = req;
	if (user.id && user.admin === true) {
		const form = await prisma.form.create({
			data: {
				name,
			},
		});

		await prisma.input.create({
			data: { ...defaultInput, formId: form.id },
		});

		return res.status(200).json('success');
	}
	return res.status(404).json('error');
};

export default handler;
