import React from 'react';
import UserCard from './UserCard';
import styles from '../styles/AdminUsers.module.css';

type Props = { data: any[] | null };

const AdminUsers = ({ data }: Props) => {
	return (
		<div className={styles.ordersContainer}>
			<h1>Users</h1>
			<div className={styles.orders}>
				{data?.map((el, index) => (
					<UserCard key={index} user={el} index={index} />
				))}
			</div>
		</div>
	);
};

export default AdminUsers;
