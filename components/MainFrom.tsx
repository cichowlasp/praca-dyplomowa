import React, { useEffect, useState } from 'react';
import { Button, TextField, useTheme } from '@mui/material';
import Loading from './Loading';
import styles from '../styles/MainForm.module.css';
import { useSession } from 'next-auth/react';

const MainFrom = () => {
	const defaultState: any[] = [];
	const { data: session } = useSession();
	const { palette } = useTheme();
	const [formData, setFormData] = useState<any[]>(defaultState);
	const [form, setForm] = useState<{ inputs: any[] } | null>(null);

	const handleChange = (event: any, index: number, name: string) => {
		setFormData((pre) => {
			let modifyFormData: any[] = pre;
			modifyFormData[index] = { name, fill: event.target.value };
			return modifyFormData;
		});
	};

	const handleClick = async () => {
		await fetch('/api/user/neworder', {
			method: 'POST',
			body: JSON.stringify(formData),
		}).then((response) => {
			if (response.status === 200) {
				setFormData(defaultState);
			}
		});
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
			{session?.user.pin ? (
				<></>
			) : (
				<>
					<div className={styles.input}>
						<TextField
							placeholder={'Company'}
							type={'text'}
							onChange={(event) =>
								console.log(event.target.value)
							}
						/>
					</div>
					<div className={styles.input}>
						<TextField
							placeholder={'Email'}
							type={'text'}
							onChange={(event) =>
								console.log(event.target.value)
							}
						/>
					</div>
				</>
			)}
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
			<div>error</div>
			<Button variant='contained' onClick={handleClick}>
				Submit Order
			</Button>
		</div>
	);
};

export default MainFrom;
