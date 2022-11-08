import React, { useState, useEffect } from 'react';
import { Paper, TextField, Button, CircularProgress } from '@mui/material';
import styles from '../styles/Edit.module.css';
import CancelIcon from '@mui/icons-material/Cancel';
import { validForm } from '../utils/validationSchema';
import { stringify } from 'querystring';

type Props = {
	order: any;
	setEditView: React.Dispatch<React.SetStateAction<boolean>>;
	updateData: () => {};
	reorder: boolean;
};

const Edit = ({ order, setEditView, updateData, reorder }: Props) => {
	const [editedInfo, setEditedInfo] = useState(order.informations);
	const [loading, setLoading] = useState<boolean>(false);
	const [errorMessage, setError] = useState<string>('');

	const handleSubmit = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		setError('');
		const error = validForm(editedInfo);
		if (error) {
			setError(error);
			return;
		}
		setLoading(true);
		if (reorder) {
			const data = editedInfo.map(
				(el: { name: string; fill: string }) => {
					return { name: el.name, fill: el.fill };
				}
			);
			await fetch('/api/user/neworder', {
				method: 'POST',
				body: JSON.stringify(data),
			}).then((response) => {
				if (response.status === 200) {
					setEditView(false);
				}
			});
		} else {
			await fetch('/api/user/updateorder', {
				method: 'POST',
				body: JSON.stringify(editedInfo),
			});
		}
		await updateData();
		setLoading(false);
		setEditView(false);
	};

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		index: number
	) => {
		setEditedInfo((prev: any) => {
			let formData: any[] = prev;
			formData[index] = {
				...formData[index],
				fill: event.target.value.trim(),
			};

			return formData;
		});
	};

	return (
		<div className={styles.container}>
			<Paper
				style={{
					position: 'relative',
					height: '90%',
					width: '90%',
					padding: '20px',
					display: 'flex',
					flexDirection: 'column',
					alignContent: 'center',
				}}
				elevation={3}>
				<h1>{reorder ? 'Reorder' : 'Order editing'}</h1>
				<CancelIcon
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',
						cursor: 'pointer',
					}}
					fontSize='large'
					onClick={async () => {
						await updateData();
						setEditView(false);
					}}
				/>
				<form onSubmit={(event) => handleSubmit(event)}>
					{order.informations.map((el: any, index: number) => (
						<div className={styles.input} key={el.name}>
							<div>{el.name}</div>
							<TextField
								defaultValue={el.fill}
								onChange={(event) => handleChange(event, index)}
							/>
						</div>
					))}
					<div className={styles.error}>{errorMessage}</div>
					<Button
						type='submit'
						variant='contained'
						style={{ width: 'fit-content', margin: '0 auto' }}>
						{loading ? (
							<CircularProgress />
						) : reorder ? (
							'Place a new order'
						) : (
							'Update your order'
						)}
					</Button>
				</form>
			</Paper>
		</div>
	);
};

export default Edit;
