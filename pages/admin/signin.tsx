/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { signIn as LogIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../../styles/signin.module.css';

const signIn = () => {
	const [credentials, setCredentials] = useState<{
		email: string;
		password: string;
	}>({ email: '', password: '' });
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === 'authenticated' && session.user.admin) {
			router.push('/admin');
		}
	}, [status, router, session]);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		LogIn('credentials', {
			redirect: false,
			email: credentials.email,
			password: credentials.password,
		});
	};

	return (
		<div className={styles.container}>
			<form onSubmit={(event) => handleSubmit(event)}>
				<TextField
					name='username'
					type='text'
					label='Email'
					onChange={(event) =>
						setCredentials((prev) => ({
							...prev,
							email: event.target.value,
						}))
					}
				/>

				<TextField
					variant='outlined'
					name='password'
					label='Password'
					type='password'
					onChange={(event) =>
						setCredentials((prev) => ({
							...prev,
							password: event.target.value,
						}))
					}
				/>

				<Button variant='contained' type='submit'>
					Sign in
				</Button>
			</form>
		</div>
	);
};

export default signIn;
