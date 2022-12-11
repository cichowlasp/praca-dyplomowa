import React from 'react';
import { Paper } from '@mui/material';
import styles from '../styles/Edit.module.css';
import { TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSession } from 'next-auth/react';
import Loading from './Loading';

const ShowCompanyId = ({ close }: { close: () => void }) => {
	const { data: session } = useSession();
	return (
		<div className={styles.container}>
			<Paper
				style={{
					position: 'relative',
					height: 'fit-content',

					padding: '20px',
					paddingBottom: '40px',
					display: 'flex',
					flexDirection: 'column',
					alignContent: 'center',
				}}
				elevation={3}>
				<h1 style={{ textAlign: 'center' }}>ID</h1>
				{session?.company?.id ? (
					<TextField
						focused={true}
						value={session.company.id}
						inputProps={{ min: 0, style: { textAlign: 'center' } }}
						sx={{ textAlign: 'center' }}
					/>
				) : (
					<Loading />
				)}

				<CancelIcon
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',
						cursor: 'pointer',
					}}
					fontSize='large'
					onClick={close}
				/>
			</Paper>
		</div>
	);
};

export default ShowCompanyId;
