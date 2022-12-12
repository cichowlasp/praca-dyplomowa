import React, { useState } from 'react';
import { Button, Paper } from '@mui/material';
import styles from '../styles/Edit.module.css';
import { TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSession } from 'next-auth/react';
import Loading from './Loading';

const HomePageTitle = ({ close }: { close: () => void }) => {
	const { data: session } = useSession();
	const [data, setData] = useState({
		text: '',
		link: '',
	});
	const [loading, setLoading] = useState(false);
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
				<h1 style={{ textAlign: 'center' }}>Homepage</h1>
				{session?.user?.admin && !loading ? (
					<form
						onSubmit={async (event) => {
							event.preventDefault();
							setLoading(true);
							await fetch('/api/admin/update-homepage', {
								method: 'POST',
								body: JSON.stringify(data),
							});
							setLoading(false);
							close();
						}}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '10px',
						}}>
						<TextField
							placeholder='Home page text'
							value={data.text}
							onChange={(event) =>
								setData((pre) => ({
									...pre,
									text: event.target.value,
								}))
							}
						/>
						<TextField
							placeholder='link to website'
							value={data.link}
							onChange={(event) =>
								setData((pre) => ({
									...pre,
									link: event.target.value,
								}))
							}
						/>
						<Button
							disabled={
								data.link.trim() === '' ||
								data.text.trim() === ''
							}
							type='submit'
							variant='contained'>
							Set Homepage
						</Button>
					</form>
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

export default HomePageTitle;
