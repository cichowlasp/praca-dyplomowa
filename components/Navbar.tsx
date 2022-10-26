import React from 'react';
import { useSession } from 'next-auth/react';
import styles from '../styles/Nav.module.css';
import { signIn, signOut } from 'next-auth/react';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import Loading from './Loading';

const Navbar = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	if (status === 'loading') return <Loading />;
	if (router.pathname !== '/admin') return <></>;
	return (
		<nav className={styles.nav}>
			{status === 'unauthenticated' ? (
				<div className={styles.welcome}>Admin Page</div>
			) : (
				<div className={styles.welcome}>
					<span>Welcome</span>
					<span className={styles.name}>
						{`${session?.user?.name} ${session?.user?.surname}`}
					</span>
				</div>
			)}

			{status === 'unauthenticated' ? (
				<Button
					variant='contained'
					onClick={() => router.push('/admin/signin')}>
					SignIn
				</Button>
			) : (
				<Button
					variant='outlined'
					onClick={() => signOut({ callbackUrl: '/' })}>
					SignOut
				</Button>
			)}
		</nav>
	);
};

export default Navbar;
