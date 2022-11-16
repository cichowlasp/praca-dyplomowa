import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../styles/AdminForms.module.css';
import Loading from './Loading';
import FormView from './FormView';
import { Button, Backdrop, Paper, TextField } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

const AdminForms = () => {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [forms, setForms] = useState<any[]>([]);
	const [backdrop, setBackdrop] = useState(false);
	const [name, setName] = useState<string>('');

	useEffect(() => {
		if (session?.user.admin) {
			fetch('/api/admin/getforms')
				.then((response) => response.json())
				.then((data) => setForms(data));
		}
	}, [session?.user.admin, setLoading]);

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		await fetch('/api/admin/createform', {
			method: 'POST',
			body: name,
		});
		await fetch('/api/admin/getforms')
			.then((response) => response.json())
			.then((data) => setForms(data));
		setName('');
		setBackdrop(false);
		setLoading(false);
	};

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
			<Button
				onClick={() => setBackdrop(true)}
				color='info'
				style={{
					height: '70px',
					width: '70px',
					minWidth: '50px',
					borderRadius: '50%',
					fontWeight: 'bold',
					fontSize: '10px',
					position: 'absolute',
					bottom: '15px',
					right: '15px',
				}}
				disabled={loading}
				variant='contained'>
				<AssignmentIcon fontSize='large' />
			</Button>
			{backdrop ? (
				<div className={styles.popup}>
					<Paper style={{ padding: '10px 20px' }} elevation={3}>
						<h3 style={{ marginTop: '0px', marginBottom: '5px' }}>
							Enter form name
						</h3>
						<form onSubmit={(event) => onSubmit(event)}>
							<TextField
								required={true}
								value={name}
								onChange={(event) =>
									setName(event.target.value)
								}
								placeholder='Enter form name'></TextField>
							<div
								style={{
									marginTop: '10px',
									display: 'flex',
									justifyContent: 'space-around',
								}}>
								<span>
									<Button
										disabled={loading}
										variant='contained'
										type='submit'>
										Submit
									</Button>
								</span>
								<span>
									<Button
										onClick={() => setBackdrop(false)}
										variant='outlined'>
										Cancel
									</Button>
								</span>
							</div>
						</form>
					</Paper>
				</div>
			) : null}
		</div>
	);
};

export default AdminForms;
