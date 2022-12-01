import styles from '../styles/Home.module.css';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { ButtonGroup, Button } from '@mui/material';
import MainForm from '../components/MainForm';
import MyOrders from '../components/MyOrders';
import CreateUserAcc from '../components/CreateUserAcc';

export enum PageOption {
	newOrder = 'new-order',
	myOrders = 'my-order',
}

const Home = () => {
	const { data: session, status } = useSession();
	const [pageOption, setPageOption] = useState<PageOption>(
		PageOption.newOrder
	);

	if (status === 'unauthenticated' || !session?.user?.pin)
		return <CreateUserAcc />;
	return (
		<>
			<main className={styles.main}>
				<ButtonGroup
					size='large'
					aria-label='large button group'
					style={{ order: 0 }}>
					<Button
						style={
							pageOption === PageOption.newOrder
								? {
										backgroundColor: '#1876D2',
										color: 'white',
								  }
								: {}
						}
						onClick={() => setPageOption(PageOption.newOrder)}>
						New Order
					</Button>
					<Button
						onClick={() => setPageOption(PageOption.myOrders)}
						style={
							pageOption === PageOption.myOrders
								? {
										backgroundColor: '#1876D2',
										color: 'white',
								  }
								: {}
						}>
						My Orders
					</Button>
				</ButtonGroup>
				<div className={styles.wrapper}>
					{pageOption === PageOption.newOrder ? (
						<MainForm setPageOption={setPageOption} />
					) : (
						<MyOrders />
					)}
				</div>
			</main>

			<footer className={styles.footer}>Politechnika Wrocławska</footer>
		</>
	);
};

export default Home;
