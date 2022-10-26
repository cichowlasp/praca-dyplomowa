import styles from '../styles/Home.module.css';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ButtonGroup, Button } from '@mui/material';
import MainForm from '../components/MainFrom';
import Loading from '../components/Loading';

enum PageOption {
	newOrder = 'new-order',
	myOrder = 'my-order',
}

const Home = () => {
	const router = useRouter();
	const { status } = useSession();
	const [pageOption, setPageOption] = useState<PageOption>(
		PageOption.newOrder
	);

	return (
		<>
			<div className={styles.container}>
				<main className={styles.main}>
					<ButtonGroup size='large' aria-label='large button group'>
						<Button
							onClick={() => setPageOption(PageOption.newOrder)}>
							New Order
						</Button>
						<Button
							onClick={() => setPageOption(PageOption.myOrder)}>
							My Orders
						</Button>
					</ButtonGroup>
				</main>
				<div className={styles.wrapper}>
					{pageOption === PageOption.newOrder ? (
						<MainForm />
					) : (
						<Loading />
					)}
				</div>
			</div>
			<footer className={styles.footer}>Politechnika Wrocławska</footer>
		</>
	);
};

export default Home;
