import React, { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Loading from './Loading';
import PinInput from 'react-pin-input';
import { Button } from '@mui/material';
import styles from '../styles/AdminOrders.module.css';
import OrderCard from './OrderCard';

const AdminOrders = ({}: {}) => {
	const { data: session, status } = useSession();
	const [orders, setOrders] = useState<any[] | null>(null);

	useEffect(() => {
		if (session?.user.admin) {
			fetch('/api/admin/getalldata')
				.then((response) => response.json())
				.then((data) =>
					setOrders(data.map((el: any) => el.orders).flat(1))
				);
		}
	}, [session?.user.admin, setOrders]);

	const handleComplete = async (pin: string) => {
		await signOut({ redirect: false });
		await signIn('credentials', { redirect: false, pin });
	};

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
						{orders?.map((order, index) => (
							<OrderCard
								key={order.id}
								order={order}
								index={index}
								admin={true}
								setOrders={setOrders}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminOrders;
