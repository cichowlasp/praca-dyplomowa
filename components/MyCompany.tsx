import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import UserCard from './UserCard';
import { Button, TextField, useTheme } from '@mui/material';
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '../styles/MainForm.module.css';
import { User } from '@prisma/client';

const MyCompany = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [users, setUsers] = useState<User[] | null>(null);
	const [pin, setPin] = useState<string | null>(null);
	const [loginInfo, setLoginInfo] = useState({
		companyEmail: '',
		id: '',
	});

	const { palette } = useTheme();
	const { data: session, status } = useSession();

	useEffect(() => {
		if (session?.company?.id) {
			fetch('/api/company/getusers')
				.then((response) => response.json())
				.then(({ users, createUserPin }) => {
					setUsers(users);
					setPin(createUserPin);
				});
		}
	}, [session?.company?.id]);

	if (status === 'loading') return <Loading />;

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		await signOut({ redirect: false });
		await signIn('credentials', {
			redirect: false,
			...loginInfo,
		});
		setLoading(false);
		console.log(session);
	};

	return (
		<>
			{status === 'unauthenticated' || !session?.company?.id ? (
				<>
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
								style={{
									fontWeight: 'bold',
									textAlign: 'left',
								}}>
								Company Email
							</div>
							<TextField
								placeholder={'Email'}
								fullWidth={true}
								required={true}
								type={'email'}
								value={loginInfo.companyEmail}
								onChange={(event) =>
									setLoginInfo((pre) => {
										return {
											...pre,
											companyEmail:
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
								style={{
									fontWeight: 'bold',
									textAlign: 'left',
								}}>
								Company Identificator
							</div>
							<TextField
								placeholder={'Company Identificator'}
								fullWidth={true}
								required={true}
								type={'password'}
								value={loginInfo.id}
								onChange={(event) =>
									setLoginInfo((pre) => {
										return {
											...pre,
											id: event.target.value.trim(),
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
							LogIn
						</Button>
					</form>
				</>
			) : (
				<>
					<h2 style={{ marginTop: 0 }}>
						<span>Pin to create user account:</span>{' '}
						<span style={{ color: palette.primary.main }}>
							{pin ? pin : session.company.createUserPin}
						</span>
					</h2>
					<div style={{ height: '100%', overflow: 'hidden' }}>
						<h3 style={{ marginTop: 0, marginBottom: 0 }}>
							Registered Users:
						</h3>
						{users ? (
							<>
								{users?.length === 0 ? (
									<div>{'0 users registerd :('}</div>
								) : (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											height: 'calc(100% - 20px)',
											overflowY: 'auto',
											textAlign: 'left',
										}}>
										{users?.map(
											(user: User, index: number) => {
												return (
													<UserCard
														key={user.id}
														user={user}
														index={index}
														setUsersData={setUsers}
													/>
												);
											}
										)}
									</div>
								)}
							</>
						) : (
							<Loading />
						)}
					</div>
				</>
			)}
		</>
	);
};

export default MyCompany;
