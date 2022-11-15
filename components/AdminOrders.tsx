import React, { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Loading from './Loading';
import styles from '../styles/AdminOrders.module.css';
import OrderCard from './OrderCard';
import { Reviewed } from './OrderCard';
import { TextField, Select, MenuItem } from '@mui/material';

const AdminOrders = ({}: {}) => {
	const { data: session, status } = useSession();
	const [orders, setOrders] = useState<any[]>([]);
	const [searchInputValue, setSearchInputValue] = useState('');
	const [selectValue, setSelectValue] = useState('');
	const defaultFilters = {
		search: () => true,
		option: () => true,
	};
	const [filters, setFilters] = useState<{
		search: (o: any) => boolean;
		option: (o: any) => boolean;
	}>(defaultFilters);

	useEffect(() => {
		if (session?.user.admin) {
			fetch('/api/admin/getalldata')
				.then((response) => response.json())
				.then((data) =>
					setOrders(data.map((el: any) => el.orders).flat(1))
				);
		}
	}, [session?.user.admin, setOrders]);

	if (status === 'loading' || !status) return <Loading />;
	if (status === 'unauthenticated' || !session?.user.admin)
		return (
			<>
				<h1>To see this page you need to be administrator</h1>
			</>
		);
	return (
		<>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '[first] 1fr [line2] 0.5fr ',
					gridGap: '5px',
					marginTop: '10px',
					marginBottom: '5px',
				}}>
				<span>
					<TextField
						style={{ borderRadius: '50%' }}
						placeholder='Search'
						size='small'
						value={searchInputValue}
						onChange={(event) => {
							setSearchInputValue(event.target.value);
							setFilters((prev) => {
								return {
									...prev,
									search: (order) => {
										return order.informations
											.map(
												(el: {
													name: string;
													fill: string;
												}) => {
													return el.fill
														.toLowerCase()
														.includes(
															event.target.value
																.trim()
																.toLowerCase()
														);
												}
											)
											.includes(true);
									},
								};
							});
						}}>
						Search
					</TextField>
				</span>
				<span>
					<Select
						displayEmpty={true}
						value={selectValue}
						size='small'
						fullWidth={true}
						onChange={(event) => {
							setSelectValue(event.target.value);
							setFilters((prev) => {
								return {
									...prev,
									option: (order) => {
										return order.reviewed.includes(
											event.target.value
										);
									},
								};
							});
						}}>
						<MenuItem value={''}>None</MenuItem>
						<MenuItem value={Reviewed.notReviewed}>
							Awaiting Review
						</MenuItem>
						<MenuItem value={Reviewed.approved}>Approved</MenuItem>
						<MenuItem value={Reviewed.decline}>
							Not Approved
						</MenuItem>
					</Select>
				</span>
			</div>
			<div className={styles.ordersContainer}>
				{orders.length === 0 ? (
					<Loading />
				) : (
					<div className={styles.orders}>
						{orders
							?.filter(filters.search)
							?.filter(filters.option)
							?.map((order, index) => (
								<OrderCard
									key={order.id}
									order={order}
									index={index}
									admin={true}
									setOrders={setOrders}
								/>
							))}
					</div>
				)}
			</div>
		</>
	);
};

export default AdminOrders;
