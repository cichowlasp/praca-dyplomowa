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
	if (router.pathname !== '/admin')
		return session ? (
			<Button
				variant='outlined'
				style={{ position: 'absolute', right: '10px', top: '10px' }}
				onClick={() => signOut({ redirect: false })}>
				SignOut
			</Button>
		) : (
			<></>
		);
	return (
		<nav className={styles.nav}>
			{status === 'unauthenticated' ? (
				<div className={styles.welcome}>Admin Page</div>
			) : (
				<div className={styles.welcome}>
					<span>Welcome</span>
					<span className={styles.name}>
						{session?.user?.admin
							? `${session?.user?.name} ${session?.user?.surname}`
							: ''}
						{}
					</span>
				</div>
			)}

			{status === 'unauthenticated' || session?.user.pin ? (
				<Button
					variant='contained'
					onClick={() => {
						if (session?.user.pin) {
							signOut({ redirect: false });
						}
						router.push('/admin/signin');
					}}>
					SignIn
				</Button>
			) : (
				<Button
					variant='outlined'
					onClick={async () => {
						const data = await signOut({
							redirect: false,
							callbackUrl: '/',
						});
						router.push(data.url);
					}}>
					SignOut
				</Button>
			)}
		</nav>
	);
};

export default Navbar;
