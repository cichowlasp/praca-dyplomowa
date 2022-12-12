import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { GetServerSideProps } from 'next';
import { Welcome } from '@prisma/client';
import prisma from '../lib/prisma';

const Index = ({ welcome }: { welcome: Welcome }) => {
	const router = useRouter();

	return (
		<div
			style={{
				width: '100vw',
				height: '100%',
				maxWidth: '100%',
				maxHeight: 'calc(100% - 50px)',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				gap: '20px',
			}}>
			<a href={welcome.link}>
				<h1>{welcome.text}</h1>
			</a>

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

export const getServerSideProps: GetServerSideProps = async () => {
	const welcome = await prisma.welcome.findFirst();
	return {
		props: { welcome },
	};
};

export default Index;
