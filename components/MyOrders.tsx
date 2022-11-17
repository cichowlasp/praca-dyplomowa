import React, { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Loading from './Loading';
import PinInput from 'react-pin-input';
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

	const handleComplete = async (pin: string) => {
		setLoading(true);
		await signOut({ redirect: false });
		await signIn('credentials', { redirect: false, pin });
		setLoading(false);
	};

	const checkIfDataFetched = async () => {
		await fetch('/api/user/getorders')
			.then((response) => response.json())
			.then((data) => setOrders(data))
			.catch((err) => {
				console.error(err);
				return Promise.reject();
			});
	};

	useEffect(() => {
		const abortController = new AbortController();
		if (session?.user.pin) {
			const fetchData = async () => await checkIfDataFetched();
			fetchData();
		}
		return () => {
			abortController.abort();
		};
	}, [session]);

	if (status === 'loading' || !status) return <Loading />;
	if (status === 'unauthenticated' || !session?.user.pin)
		return (
			<>
				{!loading ? (
					<>
						<h1 style={{ maxWidth: '80vw' }}>
							To see your orders you need to type in your access
							pin
						</h1>
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
				) : (
					<Loading />
				)}
			</>
		);
	return (
		<div className={styles.ordersContainer}>
			<h2 style={{ marginTop: 0, marginBottom: 0 }}>
				Hi {session.user.company} your pin is: {session.user.pin}
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
				<Loading />
			) : (
				<div className={styles.orders}>
					{orders
						.filter(filters.search)
						.filter(filters.option)
						.map((order, index) => (
							<OrderCard
								key={index}
								order={order}
								setOrders={setOrders}
								index={index}
								admin={session?.user.admin}
							/>
						))}
				</div>
			)}
		</div>
	);
};

export default MyOrders;
