import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, TextField, useTheme } from '@mui/material';
import Loading from './Loading';
import styles from '../styles/MainForm.module.css';
import { signIn } from 'next-auth/react';

const CreateCompanyAcc = ({}) => {
	const [error, setError] = useState<string>('');
	const [formData, setFormData] = useState({
		companyName: '',
		nip: '',
		companyEmail: '',
		companyAddress: '',
		phoneNumber: '',
		secretPhrase: '',
	});
	const [loading, setLoading] = useState<boolean>(false);
	const { palette } = useTheme();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(formData);
		setLoading(true);
		await fetch('/api/company/createcompany', {
			method: 'POST',
			body: JSON.stringify(formData),
		})
			.then((data) => data.json())
			.then(async (company) => {
				await signIn('credentials', {
					companyEmail: company.companyEmail,
					id: company.id,
				});
			});
		setLoading(false);
	};

	return (
		<>
			<h1 style={{ marginTop: 0 }}>Create Company Account</h1>
			{loading ? (
				<Loading />
			) : (
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
							Company Name
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
										companyName: event.target.value.trim(),
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
							NIP
						</div>
						<TextField
							placeholder={'NIP'}
							fullWidth={true}
							required={true}
							inputProps={{ minLength: 10, maxLength: 10 }}
							type={'text'}
							onChange={(event) =>
								setFormData((pre) => {
									return {
										...pre,
										nip: event.target.value,
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
							Company Email
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
										companyEmail: event.target.value.trim(),
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
							Company Address
						</div>
						<TextField
							placeholder={'Address'}
							fullWidth={true}
							required={true}
							type={'text'}
							onChange={(event) =>
								setFormData((pre) => {
									return {
										...pre,
										companyAddress:
											event.target.value.trim(),
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
						style={{
							color: palette.warning.main,
							fontWeight: '600',
						}}>
						{error}
					</div>
					<Button
						style={{ order: 999999999, marginBottom: '10px' }}
						type='submit'
						variant='contained'>
						Create Company Account
					</Button>
				</form>
			)}
		</>
	);
};

export default CreateCompanyAcc;
