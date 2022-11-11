import styles from '../styles/Home.module.css';
import { useSession, signOut } from 'next-auth/react';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ButtonGroup, Button } from '@mui/material';
import MainForm from '../components/MainFrom';
import MyOrders from '../components/MyOrders';

export enum PageOption {
	newOrder = 'new-order',
	myOrders = 'my-order',
}

const Home = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [pageOption, setPageOption] = useState<PageOption>(
		PageOption.newOrder
	);

	return (
		<>
			{session?.user.pin ? (
				<Button
					variant='outlined'
					onClick={async () =>
						await signOut({
							redirect: false,
						})
					}
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',
					}}>
					SignOut
				</Button>
			) : (
				<div
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',
						fontWeight: 'bold',
					}}>
					Have a pin?
					<Button
						style={{ marginLeft: '10px' }}
						variant='contained'
						onClick={() => setPageOption(PageOption.myOrders)}>
						SignIn
					</Button>
				</div>
			)}
			<div className={styles.container}>
				<main className={styles.main}>
					<ButtonGroup size='large' aria-label='large button group'>
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
				</main>
				<div className={styles.wrapper}>
					{pageOption === PageOption.newOrder ? (
						<MainForm setPageOption={setPageOption} />
					) : (
						<MyOrders />
					)}
				</div>
			</div>
			<footer className={styles.footer}>Politechnika Wrocławska</footer>
		</>
	);
};

export default Home;
