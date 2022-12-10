import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Loading from './Loading';
import styles from '../styles/AdminOrders.module.css';
import OrderWithCompany from './OrderWithCompany';
import OrderCard, { Reviewed } from './OrderCard';
import {
	TextField,
	Select,
	MenuItem,
	Stack,
	Typography,
	Switch,
	styled,
} from '@mui/material';
import { Info, Order, User, Message, Company } from '@prisma/client';

const AdminOrders = () => {
	const { data: session, status } = useSession();
	const [companies, setCompanies] = useState<
		(Company & {
			users: (User & {
				orders: (Order & {
					informations: Info[];
					messages: Message[];
				})[];
			})[];
		})[]
	>([]);
	const [orders, setOrders] = useState<
		(Order & {
			informations: Info[];
			messages: Message[];
			user: User;
		})[]
	>();
	const [searchInputValue, setSearchInputValue] = useState('');
	const [selectValue, setSelectValue] = useState('');
	const [orderView, setOrderView] = useState(false);
	const defaultFilters = {
		search: () => true,
		option: () => true,
	};
	const [filters, setFilters] = useState<{
		search: (
			o: Order & { informations: Info[]; messages: Message[] }
		) => boolean;
		option: (
			o: Order & { informations: Info[]; messages: Message[] }
		) => boolean;
	}>(defaultFilters);

	useEffect(() => {
		if (companies.length == 0) {
			fetch('/api/admin/getalldata')
				.then((response) => response.json())
				.then(
					(
						data: (Company & {
							users: (User & {
								orders: (Order & {
									informations: Info[];
									messages: Message[];
								})[];
							})[];
						})[]
					) => {
						setCompanies(data);
						let orders: (Order & {
							informations: Info[];
							messages: Message[];
							user: User;
						})[] = [];
						data.forEach((el) => {
							el.users.forEach((el) => {
								const fixedOrders = el.orders.map((order) => {
									return { ...order, user: el };
								});
								orders = [...orders, ...fixedOrders];
							});
						});
						orders.sort((a, b) => {
							if (a.creationData > b.creationData) {
								return -1;
							}
							if (a.creationData < b.creationData) {
								return 1;
							}
							return 0;
						});
						setOrders(orders);
					}
				);
		}
	}, [session?.user?.admin, companies]);

	const updateData = async (
		localLoading?: React.Dispatch<React.SetStateAction<boolean>>
	) => {
		if (localLoading) {
			localLoading(true);
			await fetch('/api/admin/getalldata')
				.then((response) => response.json())
				.then((data) => {
					setCompanies(data);
				});
			localLoading(false);
			return;
		}
		await fetch('/api/admin/getalldata')
			.then((response) => response.json())
			.then((data) => {
				setCompanies(data);
			});
	};
	if (status === 'loading' || !status) return <Loading />;
	if (status === 'unauthenticated' || !session?.user?.admin)
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
					gridTemplateColumns:
						'[first] 1fr [line2] 0.5fr  [line3] 0.5fr',
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
													return (
														el.fill.toLowerCase() +
														' ' +
														el.name
															.toLocaleLowerCase
													);
												}
											)
											.join(' ')
											.includes(
												event.target.value
													.trim()
													.toLowerCase()
											);
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
						<MenuItem value={Reviewed.completed}>
							Completed
						</MenuItem>
					</Select>
				</span>
				<span>
					<Stack direction='column' alignItems='center'>
						<Typography fontWeight={'bold'}>
							Companies/Orders
						</Typography>
						<Switch
							size='small'
							checked={orderView}
							onClick={() => setOrderView((pre) => !pre)}
							inputProps={{ 'aria-label': 'ant design' }}
						/>
					</Stack>
				</span>
			</div>
			<div className={styles.ordersContainer}>
				{companies.length === 0 ? (
					<Loading />
				) : (
					<div className={styles.orders}>
						{orderView ? (
							<>
								{orders
									?.filter(filters.search)
									?.filter(filters.option)
									?.map((order, index) => (
										<OrderCard
											key={order.id}
											order={order}
											updateData={updateData}
											user={order.user}
											admin={true}
											index={index}
										/>
									))}
							</>
						) : (
							<>
								{companies.map((company) => {
									return (
										<OrderWithCompany
											key={company.id}
											company={company}
											updateData={updateData}
											filters={filters}
										/>
									);
								})}
							</>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default AdminOrders;
