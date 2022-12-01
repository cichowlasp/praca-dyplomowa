import styles from '../styles/Home.module.css';
import { useSession, signOut } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { ButtonGroup, Button } from '@mui/material';
import CreateCompanyAcc from '../components/CreateCompanyAcc';
import MyCompany from '../components/MyCompany';
import { useRouter } from 'next/router';

export enum PageOption {
	newOrder = 'new-order',
	myOrders = 'my-order',
}

const Home = () => {
	const { data: session } = useSession();
	const [pageOption, setPageOption] = useState<PageOption>(
		PageOption.newOrder
	);
	const router = useRouter();

	useEffect(() => {
		if (session?.company?.nip) {
			setPageOption(PageOption.myOrders);
		}
	}, [session?.company?.nip]);

	return (
		<>
			<main className={styles.main}>
				<ButtonGroup
					size='large'
					aria-label='large button group'
					style={{ order: 0 }}>
					{!session?.company?.nip && (
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
							New Company
						</Button>
					)}

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
						My Company
					</Button>
				</ButtonGroup>
				<div className={styles.wrapper}>
					{pageOption === PageOption.newOrder ? (
						<CreateCompanyAcc />
					) : (
						<MyCompany />
					)}
				</div>
			</main>

			<footer className={styles.footer}>Politechnika Wrocławska</footer>
		</>
	);
};

export default Home;
