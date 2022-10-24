import React from 'react';
import { useSession } from 'next-auth/react';
import styles from '../styles/Nav.module.css';

const Navbar = () => {
	const { data } = useSession();
	return (
		<nav className={styles.nav}>
			<div className={styles.welcome}>
				<span>Welcome</span>
				<span className={styles.name}>
					{`${data?.user?.name} ${data?.user?.surname}`}
				</span>
			</div>
		</nav>
	);
};

export default Navbar;
