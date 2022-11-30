import React, { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Loading from './Loading';
import { TextField, Select, MenuItem } from '@mui/material';
import styles from '../styles/MyOrders.module.css';
import OrderCard from './OrderCard';
import { Reviewed } from './OrderCard';
import { Info, Order, Message } from '@prisma/client';

const MyOrders = () => {
	const { data: session, status } = useSession();
	const [orders, setOrders] = useState<
		(Order & { informations: Info[]; messages: Message[] })[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [searchInputValue, setSearchInputValue] = useState('');
	const [selectValue, setSelectValue] = useState('');
	const defaultFilters = {
		search: () => true,
		option: () => true,
	};
	const [filters, setFilters] = useState<{
		search: (o: Order & { informations: Info[] }) => boolean;
		option: (o: Order & { informations: Info[] }) => boolean;
	}>(defaultFilters);

	const checkIfDataFetched = async () => {
		setLoading(true);
		await fetch('/api/user/getorders')
			.then((response) => response.json())
			.then((data) => setOrders(data))
			.catch((err) => {
				console.error(err);
				return Promise.reject();
			});
		setLoading(false);
	};

	useEffect(() => {
		const abortController = new AbortController();
		if (session?.user?.pin) {
			const fetchData = async () => await checkIfDataFetched();
			fetchData();
		}
		return () => {
			abortController.abort();
		};
	}, [session]);

	const updateData = async (
		localLoading?: React.Dispatch<React.SetStateAction<boolean>>
	) => {
		if (localLoading) {
			localLoading(true);
			await fetch('/api/user/getorders')
				.then((response) => response.json())
				.then((data) => setOrders(data))
				.catch((err) => {
					console.error(err);
				});
			localLoading(false);
			return;
		}
		await fetch('/api/user/getorders')
			.then((response) => response.json())
			.then((data) => setOrders(data))
			.catch((err) => {
				console.error(err);
			});
	};

	if (status === 'loading' || !status || loading) return <Loading />;
	if (status === 'unauthenticated' || !session?.user?.pin) return <Loading />;
	return (
		<div className={styles.ordersContainer}>
			<h2 style={{ marginTop: 0, marginBottom: 0 }}>
				Hi {`${session.user.name} `} your pin is: {session.user.pin}
			</h2>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '[first] 1fr [line2] 0.5fr ',
					gridGap: '5px',
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
						<MenuItem value={''}>All</MenuItem>
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
			{orders.length === 0 ? (
				<div className={styles.orders}>
					<h3>{"You don't have any orders :c"}</h3>
				</div>
			) : (
				<div className={styles.orders}>
					{orders
						.sort((a, b) => {
							if (a.creationData > b.creationData) {
								return -1;
							}
							if (a.creationData < b.creationData) {
								return 1;
							}
							return 0;
						})
						.filter(filters.search)
						.filter(filters.option)
						.map((order, index) => (
							<OrderCard
								key={order.id}
								order={order}
								updateData={updateData}
								index={index}
								admin={
									session?.user?.admin
										? session?.user?.admin
										: false
								}
							/>
						))}
				</div>
			)}
		</div>
	);
};

export default MyOrders;
