import { Info } from '@prisma/client';
import { FormData } from '../components/MainForm';

export const validForm = (data: Info[] | FormData[]) => {
	let error = '';
	if (data.length === 0) {
		return 'Make sure all data is filled';
	}

	data.forEach((element: Info | FormData) => {
		for (const [_, value] of Object.entries(element)) {
			if (JSON.stringify(value).trim() == '""') {
				error = 'Make sure all data is filled';
			}
		}
	});

	return error;
};
