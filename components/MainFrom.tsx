import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import Loading from './Loading';
import styles from '../styles/MainForm.module.css';

const MainFrom = () => {
	const defaultState: { name: string; fill: string }[] = [];

	const [formData, setFormData] = useState<any[]>(defaultState);
	const [form, setForm] = useState<{ inputs: any[] } | null>(null);

	const handleChange = (event: any, index: number, name: string) => {
		setFormData((pre) => {
			let modifyFormData: { name: string; fill: string }[] = pre;
			modifyFormData[index] = { name, fill: event.target.value };
			return modifyFormData;
		});
	};

	const handleClick = async () => {
		try {
			await fetch('/api/order', {
				method: 'POST',
				body: JSON.stringify(formData),
			});
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetch('api/getform')
			.then((response) => response.json())
			.then((data) => setForm(data));
	}, []);
	if (form === null) return <Loading />;
	return (
		<div className={styles.form}>
			<h1>Fill up to take order</h1>
			{form.inputs.map((el, index: number) => (
				<div
					className={styles.input}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
					key={el.id}>
					<TextField
						placeholder={el.placeholder}
						type={el.type}
						onChange={(event) =>
							handleChange(event, index, el.placeholder)
						}
					/>
				</div>
			))}
			<Button variant='contained' onClick={handleClick}>
				Submit Order
			</Button>
		</div>
	);
};

export default MainFrom;
