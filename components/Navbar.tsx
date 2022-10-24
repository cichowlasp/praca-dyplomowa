import React from 'react';
import { useSession } from 'next-auth/react';
import styles from '../styles/Nav.module.css';
import { signIn, signOut } from 'next-auth/react';
import { Button } from '@mui/material';

const Navbar = () => {
	const { data: session, status } = useSession();
	return (
		<nav className={styles.nav}>
			{status === 'unauthenticated' ? (
				<div className={styles.welcome}>Login Page</div>
			) : (
				<div className={styles.welcome}>
					<span>Welcome</span>
					<span className={styles.name}>
						{`${session?.user?.name} ${session?.user?.surname}`}
					</span>
				</div>
			)}

			{status === 'loading' || status === 'unauthenticated' ? (
				<Button variant='contained' onClick={() => signIn()}>
					SignIn
				</Button>
			) : (
				<Button variant='outlined' onClick={() => signOut()}>
					SignOut
				</Button>
			)}
		</nav>
	);
};

export default Navbar;
