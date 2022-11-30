import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Loading from './Loading';
import styles from '../styles/AdminOrders.module.css';
import OrderCard from './OrderCard';
import { Reviewed } from './OrderCard';
import { TextField, Select, MenuItem } from '@mui/material';
import { Info, Order, User, Message, Company } from '@prisma/client';

const AdminOrders = ({}: {}) => {
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
	const [searchInputValue, setSearchInputValue] = useState('');
	const [selectValue, setSelectValue] = useState('');
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
		if (session?.user?.admin) {
			fetch('/api/admin/getalldata')
				.then((response) => response.json())
				.then((data) => {
					setCompanies(data);
				});
		}
	}, [session?.user?.admin, setCompanies]);

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
			<div className={styles.ordersContainer}>
				{companies.length === 0 ? (
					<Loading />
				) : (
					<div className={styles.orders}>
						{companies.map((company) => {
							return (
								<div key={company.id}>
									<h1 style={{ margin: 0 }}>
										{company.companyName}
									</h1>
									{company.users?.map((user) => {
										return (
											<>
												{user.orders
													?.sort((a, b) => {
														if (
															a.creationData >
															b.creationData
														) {
															return -1;
														}
														if (
															a.creationData <
															b.creationData
														) {
															return 1;
														}
														return 0;
													})
													?.filter(filters.search)
													?.filter(filters.option)
													?.map((order, index) => (
														<OrderCard
															key={order.id}
															order={order}
															index={index}
															admin={true}
															user={user}
															updateData={
																updateData
															}
														/>
													))}
											</>
										);
									})}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</>
	);
};

export default AdminOrders;
