/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { signIn as LogIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../../styles/signin.module.css';
import Loading from '../../components/Loading';

const signIn = () => {
	const [credentials, setCredentials] = useState<{
		email: string;
		password: string;
	}>({ email: '', password: '' });
	const [loading, setLoading] = useState(false);
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === 'authenticated' && session.user?.admin) {
			router.push('/admin');
		}
	}, [status, router, session]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		await LogIn('credentials', {
			redirect: false,
			email: credentials.email,
			password: credentials.password,
		});
		setLoading(false);
	};

	if (loading) return <Loading />;

	return (
		<div className={styles.container}>
			<h1>Admin Login Page </h1>
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
