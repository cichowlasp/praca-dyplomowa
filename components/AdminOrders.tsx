import React, { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Loading from './Loading';
import PinInput from 'react-pin-input';
import { Button } from '@mui/material';
import styles from '../styles/AdminOrders.module.css';
import OrderCard from './OrderCard';

const AdminOrders = () => {
	const { data: session, status } = useSession();
	const [orders, setOrders] = useState<any[] | null>(null);

	const handleComplete = async (pin: string) => {
		await signOut({ redirect: false });
		await signIn('credentials', { redirect: false, pin });
	};
	useEffect(() => {
		if (session?.user.admin) {
			fetch('/api/admin/getallorders')
				.then((response) => response.json())
				.then((data) => setOrders(data));
		}
	}, [session]);

	if (status === 'loading' || !status) return <Loading />;
	if (status === 'unauthenticated' || !session?.user.admin)
		return (
			<>
				<h1>To see this page you need to be administrator</h1>
			</>
		);
	return (
		<div className={styles.ordersContainer}>
			<h1>Orders</h1>
			{orders === null ? (
				<Loading />
			) : (
				<div className={styles.ordersContainer}>
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
				</div>
			)}
		</div>
	);
};

export default AdminOrders;
