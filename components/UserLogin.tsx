import React, { useState } from 'react';
import styles from '../styles/MainForm.module.css';
import { TextField, Button } from '@mui/material';
import { signIn, signOut } from 'next-auth/react';

const UserLogin = () => {
	const [formData, setFormData] = useState({
		secretPhrase: '',
		pin: '',
	});

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await signOut({ redirect: false });
		await signIn('credentials', { redirect: false, ...formData });
	};

	return (
		<>
			<h1>Welcome Back</h1>
			<form
				className={styles.form}
				onSubmit={(event) => handleSubmit(event)}>
				<div
					className={styles.input}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<div
						className={styles.label}
						style={{ fontWeight: 'bold', textAlign: 'left' }}>
						Secret Phrase
					</div>
					<TextField
						placeholder={'Secret Phrase'}
						fullWidth={true}
						required={true}
						type={'password'}
						onChange={(event) =>
							setFormData((pre) => {
								return {
									...pre,
									secretPhrase: event.target.value.trim(),
								};
							})
						}
					/>
				</div>
				<div
					className={styles.input}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<div
						className={styles.label}
						style={{ fontWeight: 'bold', textAlign: 'left' }}>
						{'User Pin'}
					</div>
					<TextField
						placeholder={'Pin'}
						fullWidth={true}
						required={true}
						type={'text'}
						onKeyPress={(event) => {
							if (!/[0-9]/.test(event.key)) {
								event.preventDefault();
							}
						}}
						inputProps={{
							maxLength: 6,
							minLength: 6,
							inputMode: 'numeric',
						}}
						onChange={(event) =>
							setFormData((pre) => {
								return {
									...pre,
									pin: event.target.value.trim(),
								};
							})
						}
					/>
				</div>

				<Button
					style={{ order: 999999999, marginBottom: '10px' }}
					type='submit'
					variant='contained'>
					login
				</Button>
			</form>
		</>
	);
};

export default UserLogin;
