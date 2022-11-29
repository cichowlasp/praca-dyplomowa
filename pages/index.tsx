import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

const Index = () => {
	const router = useRouter();

	return (
		<div
			style={{
				width: '100vw',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				gap: '20px',
			}}>
			<h1>Who are you?</h1>
			<div style={{ width: '200px', maxWidth: '80vw' }}>
				<Button
					fullWidth
					variant='contained'
					size='large'
					onClick={() => router.push('/company')}>
					Company
				</Button>
			</div>
			<div style={{ width: '200px', maxWidth: '80vw' }}>
				<Button
					fullWidth
					variant='outlined'
					size='large'
					onClick={() => router.push('/user')}>
					User
				</Button>
			</div>
		</div>
	);
};

export default Index;
