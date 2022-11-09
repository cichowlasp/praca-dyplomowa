import React, { useState } from 'react';
import { useTheme, Menu, MenuProps, styled, alpha } from '@mui/material';
import styles from '../styles/UserCard.module.css';

const UserCard = ({ user, index }: { user: any; index: number }) => {
	const { palette } = useTheme();
	return (
		<>
			<div
				className={styles.card}
				style={{ border: `2px solid ${palette.primary.main}` }}
				key={user.id}>
				<div>
					<span
						style={{
							fontWeight: 'bold',
							textAlign: 'left',
						}}>
						Email:
					</span>
					<span
						style={{
							paddingLeft: '3px',
						}}>
						{user.email}
					</span>
				</div>
				<div>
					<span
						style={{
							fontWeight: 'bold',
							textAlign: 'left',
						}}>
						Company:
					</span>
					<span
						style={{
							paddingLeft: '3px',
						}}>
						{user.company}
					</span>
				</div>
				<div>
					<span
						style={{
							fontWeight: 'bold',
							textAlign: 'left',
						}}>
						Pin:
					</span>
					<span
						style={{
							paddingLeft: '3px',
						}}>
						{user.pin}
					</span>
				</div>
			</div>
		</>
	);
};

export default UserCard;
