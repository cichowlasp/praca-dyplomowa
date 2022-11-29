import styles from '../styles/Home.module.css';
import { useSession, signOut } from 'next-auth/react';
import React, { useState } from 'react';
import { ButtonGroup, Button, useTheme } from '@mui/material';
import UserForm from './UserForm';
import UserLogin from './UserLogin';

export enum PageOption {
	newOrder = 'new-order',
	myOrders = 'my-order',
}

const CreateUserAcc = () => {
	const { data: session } = useSession();
	const { palette } = useTheme();
	const [pageOption, setPageOption] = useState<PageOption>(
		PageOption.newOrder
	);

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
										backgroundColor: palette.primary.main,
										color: 'white',
								  }
								: {}
						}
						onClick={() => setPageOption(PageOption.newOrder)}>
						New User
					</Button>
					<Button
						onClick={() => setPageOption(PageOption.myOrders)}
						style={
							pageOption === PageOption.myOrders
								? {
										backgroundColor: palette.primary.main,
										color: 'white',
								  }
								: {}
						}>
						Login
					</Button>
				</ButtonGroup>
				<div className={styles.wrapper}>
					{pageOption === PageOption.newOrder ? (
						<UserForm />
					) : (
						<UserLogin />
					)}
				</div>
			</main>

			<footer className={styles.footer}>Politechnika Wrocławska</footer>
		</>
	);
};

export default CreateUserAcc;
