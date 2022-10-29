import React, { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Loading from './Loading';
import PinInput from 'react-pin-input';
import { Button, Paper, useTheme } from '@mui/material';
import styles from '../styles/MyOrders.module.css';
import { borderRadius, fontWeight } from '@mui/system';

const MyOrders = () => {
	const { data: session, status } = useSession();
	const [orders, setOrders] = useState<any[] | null>(null);
	const { palette } = useTheme();

	const handleComplete = async (pin: string) => {
		await signOut({ redirect: false });
		await signIn('credentials', { redirect: false, pin });
	};
	useEffect(() => {
		if (session?.user.pin) {
			fetch('/api/user/getorders')
				.then((response) => response.json())
				.then((data) => setOrders(data));
		}
	}, [session]);

	if (status === 'loading' || !status) return <Loading />;
	if (status === 'unauthenticated' || !session?.user.pin)
		return (
			<>
				<h1>To see your orders you need to type in your access pin</h1>
				<PinInput
					length={6}
					initialValue=''
					secret
					type='numeric'
					inputMode='number'
					style={{ padding: '10px' }}
					inputStyle={{
						borderColor: 'black',
						borderRadius: '10px',
						borderWidth: '3px',
					}}
					inputFocusStyle={{
						borderColor: 'blue',
						borderRadius: '10px',
						borderWidth: '3px',
					}}
					onComplete={(pin) => handleComplete(pin)}
					autoSelect={true}
				/>
			</>
		);
	return (
		<div className={styles.ordersContainer}>
			<h1>MyOrders</h1>
			{orders === null ? (
				<Loading />
			) : (
				<>
					<div className={styles.orders}>
						{orders.map((order, index) => {
							return (
								<div
									style={{
										marginBottom: '1rem',
										border: `2px solid ${palette.primary.main}`,
										borderRadius: '10px',
										padding: '5px',
										boxShadow:
											'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
									}}
									key={index}>
									<div
										style={{
											width: '20rem',
										}}>
										{order.id}
										{order.informations.map((el, index) => {
											return (
												<div key={index}>
													<span
														style={{
															fontWeight: 'bold',
															textAlign: 'left',
														}}>
														{el.name}:
													</span>
													<span
														style={{
															paddingLeft: '3px',
														}}>
														{el.fill}
													</span>
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</>
			)}
			<Button
				variant='outlined'
				onClick={() => signOut({ redirect: false })}>
				SignOut
			</Button>
		</div>
	);
};

export default MyOrders;
