import React, { useState } from 'react';
import UserCard from './UserCard';
import styles from '../styles/AdminUsers.module.css';
import { TextField } from '@mui/material';
import { Company, User, Message, Order, Info } from '@prisma/client';

const AdminUsers = ({
	data,
	updateData,
}: {
	data:
		| (Company & {
				users: User[] & {
					orders: Order[] & {
						messages: Message[];
						informations: Info[];
					};
				};
		  })[]
		| null;
	updateData: () => {};
}) => {
	const [searchInputValue, setSearchInputValue] = useState('');
	const defaultFilters = {
		search: () => true,
	};
	const [filters, setFilters] = useState<{
		search: (o: User) => boolean;
	}>(defaultFilters);

	return (
		<>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '[first] 1fr',
					gridGap: '5px',
					marginTop: '10px',
					marginBottom: '20px',
					width: '20rem',
				}}>
				<span>
					<TextField
						style={{ borderRadius: '50%' }}
						placeholder='Search'
						size='small'
						fullWidth={true}
						value={searchInputValue}
						onChange={(event) => {
							setSearchInputValue(event.target.value);
							setFilters((prev) => {
								return {
									...prev,
									search: (user) => {
										return `${
											user.email +
											user.company +
											user.pin +
											user.name +
											user.surname +
											user.phoneNumber
										}`
											.toLowerCase()
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
			</div>
			<div className={styles.orders}>
				{data?.map(
					(
						el: Company & {
							users: User[] & {
								orders: Order[] & {
									messages: Message[];
									informations: Info[];
								};
							};
						}
					) => (
						<div key={el.id}>
							{el.users.filter(filters.search).length !== 0 && (
								<h2 style={{ margin: 0 }}>{el.companyName}</h2>
							)}

							{el.users
								.filter(filters.search)
								.map((el, index) => (
									<UserCard
										updateData={updateData}
										key={index}
										user={el}
										index={index}
									/>
								))}
						</div>
					)
				)}
			</div>
		</>
	);
};

export default AdminUsers;
