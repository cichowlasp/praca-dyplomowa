import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

const AdminForms = () => {
	const { data: session } = useSession();
	const [forms, setForms] = useState<any[]>([]);

	useEffect(() => {
		if (session?.user.admin) {
			fetch('/api/admin/getforms')
				.then((response) => response.json())
				.then((data) => setForms(data));
		}
	}, [session?.user.admin]);

	return <div>{forms.map((el) => {})}</div>;
};

export default AdminForms;
