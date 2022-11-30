import React, { useState } from 'react';
import styles from '../styles/MainForm.module.css';
import { TextField, Button } from '@mui/material';
import { signIn } from 'next-auth/react';
import Loading from './Loading';

const UserForm = () => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		name: '',
		surname: '',
		phoneNumber: '',
		secretPhrase: '',
		pin: '',
	});

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		fetch('/api/user/createnewuser', {
			method: 'POST',
			body: JSON.stringify(formData),
		})
			.then((data) => data.json())
			.then(
				async (user) =>
					await signIn('credentials', {
						redirect: false,
						secretPhrase: formData.secretPhrase,
						pin: user.pin,
					})
			);
		setLoading(false);
	};

	if (loading) return <Loading />;

	return (
		<>
			<h1>Create Your Account</h1>
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
						Email
					</div>
					<TextField
						placeholder={'Email'}
						fullWidth={true}
						required={true}
						type={'email'}
						onChange={(event) =>
							setFormData((pre) => {
								return {
									...pre,
									email: event.target.value.trim(),
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
						Name
					</div>
					<TextField
						placeholder={'Name'}
						fullWidth={true}
						required={true}
						type={'text'}
						onChange={(event) =>
							setFormData((pre) => {
								return {
									...pre,
									name: event.target.value.trim(),
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
						Surname
					</div>
					<TextField
						placeholder={'Surname'}
						fullWidth={true}
						required={true}
						type={'text'}
						onChange={(event) =>
							setFormData((pre) => {
								return {
									...pre,
									surname: event.target.value.trim(),
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
						Phone Number
					</div>
					<TextField
						placeholder={'Phone Number'}
						fullWidth={true}
						required={true}
						type={'text'}
						onChange={(event) =>
							setFormData((pre) => {
								return {
									...pre,
									phoneNumber: event.target.value.trim(),
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
						{'Pin (the one you get from company)'}
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
					Create Account
				</Button>
			</form>
		</>
	);
};

export default UserForm;
