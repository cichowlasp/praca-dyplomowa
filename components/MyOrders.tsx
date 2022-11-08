import React, { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Loading from './Loading';
import PinInput from 'react-pin-input';
import { Button } from '@mui/material';
import styles from '../styles/MyOrders.module.css';
import OrderCard from './OrderCard';

const MyOrders = () => {
	const { data: session, status } = useSession();
	const [orders, setOrders] = useState<any[] | null>(null);

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
			<h2 style={{ marginTop: 0 }}>
				Hi {session.user.company} your pin is: {session.user.pin}
			</h2>
			{orders === null ? (
				<Loading />
			) : (
				<div className={styles.orders}>
					{orders.map((order, index) => (
						<OrderCard
							key={index}
							order={order}
							setOrders={setOrders}
							index={index}
						/>
					))}
				</div>
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
