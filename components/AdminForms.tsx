import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../styles/AdminForms.module.css';
import Loading from './Loading';
import FormView from './FormView';

const AdminForms = () => {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [forms, setForms] = useState<any[]>([]);

	useEffect(() => {
		if (session?.user.admin) {
			fetch('/api/admin/getforms')
				.then((response) => response.json())
				.then((data) => setForms(data));
		}
	}, [session?.user.admin, setLoading]);

	if (forms.length === 0)
		return (
			<div style={{ height: '100vh', width: '100vw' }}>
				<Loading />
			</div>
		);
	return (
		<div className={styles.container}>
			{forms.map((el, index) => {
				const numberOfOptions =
					el.inputs.length + el.selects.length + el.checkboxes.length;
				return (
					<FormView
						key={el.id}
						forms={forms}
						numberOfOptions={numberOfOptions}
						index={index}
						loading={loading}
						setLoading={setLoading}
						setForms={setForms}
						el={el}
					/>
				);
			})}
		</div>
	);
};

export default AdminForms;
