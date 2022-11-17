import React, { Dispatch, useState, SetStateAction } from 'react';
import UserCard from './UserCard';
import styles from '../styles/AdminUsers.module.css';
import { TextField } from '@mui/material';
import { User } from '@prisma/client';

const AdminUsers = ({
	data,
	setUsersData,
}: {
	data: User[] | null;
	setUsersData: Dispatch<SetStateAction<User[] | null>>;
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
											user.email + user.company + user.pin
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
				{data?.filter(filters.search).map((el, index) => (
					<UserCard
						setUsersData={setUsersData}
						key={index}
						user={el}
						index={index}
					/>
				))}
			</div>
		</>
	);
};

export default AdminUsers;
