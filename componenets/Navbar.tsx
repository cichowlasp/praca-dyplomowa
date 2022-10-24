import React from 'react';
import { useSession } from 'next-auth/react';
import styles from '../styles/Nav.module.css';
import { signIn, signOut } from 'next-auth/react';

const Navbar = () => {
	const { data, status } = useSession();
	return (
		<nav className={styles.nav}>
			<div className={styles.welcome}>
				<span>Welcome</span>
				<span className={styles.name}>
					{`${data?.user?.name} ${data?.user?.surname}`}
				</span>
			</div>
			{status === 'loading' || status === 'unauthenticated' ? (
				<a className={styles.button} href='#' onClick={() => signIn()}>
					SignIn
				</a>
			) : (
				<a className={styles.button} href='#' onClick={() => signOut()}>
					SignOut
				</a>
			)}
		</nav>
	);
};

export default Navbar;
