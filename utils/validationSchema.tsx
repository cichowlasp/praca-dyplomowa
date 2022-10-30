export const validForm = (data: any[]) => {
	let error = '';
	if (data.length === 0) {
		return 'Make sure all data is filled';
	}
	data.forEach((element: { fill: string; name: string }) => {
		for (const [_, value] of Object.entries(element)) {
			console.log(value);
			if (value.trim() === '') {
				error = 'Make sure all data is filled';
			}
		}
	});
	return error;
};
