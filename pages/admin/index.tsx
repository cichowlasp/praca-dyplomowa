import Head from 'next/head';
import styles from '../../styles/HomeAdmin.module.css';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Loading from '../../components/Loading';
import { Button, ButtonGroup } from '@mui/material';
import AdminOrders from '../../components/AdminOrders';
import AdminUsers from '../../components/AdminUsers';
import AdminForms from '../../components/AdminForms';
import { Company, Message, User, Order } from '@prisma/client';

export enum PageOption {
	orders = 'orders',
	form = 'form',
	users = 'users',
}

const Home = () => {
	const { data: session, status } = useSession();
	const [pageOption, setPageOption] = useState<PageOption>(PageOption.orders);
	const [companiesData, setCompaniesData] = useState<
		| (Company & {
				users: User[] & {
					messages: Message[];
					orders: Order[];
				};
		  })[]
		| null
	>(null);

	useEffect(() => {
		if (session?.user?.admin) {
			fetch('/api/admin/getalldata')
				.then((response) => response.json())
				.then((data) => setCompaniesData(data));
		}
	}, [session?.user?.admin, setCompaniesData]);

	if (status === 'loading') return <></>;
	if (status === 'authenticated' && session.user?.admin) {
		return (
			<>
				<div className={styles.container}>
					<Head>
						<title>Admin Page</title>
						<meta
							name='description'
							content='Generated by create next app'
						/>
						<link rel='icon' href='/favicon.ico' />
					</Head>
					<div style={{ height: '20px' }} />
					<main className={styles.main}>
						<ButtonGroup
							size='large'
							aria-label='large button group'>
							<Button
								style={
									pageOption === PageOption.orders
										? {
												backgroundColor: '#1876D2',
												color: 'white',
										  }
										: {}
								}
								onClick={() =>
									setPageOption(PageOption.orders)
								}>
								Orders
							</Button>
							<Button
								onClick={() => setPageOption(PageOption.form)}
								style={
									pageOption === PageOption.form
										? {
												backgroundColor: '#1876D2',
												color: 'white',
										  }
										: {}
								}>
								Form
							</Button>
							<Button
								onClick={() => setPageOption(PageOption.users)}
								style={
									pageOption === PageOption.users
										? {
												backgroundColor: '#1876D2',
												color: 'white',
										  }
										: {}
								}>
								Users
							</Button>
						</ButtonGroup>
						{pageOption === PageOption.orders && <AdminOrders />}
						{pageOption === PageOption.users && (
							<AdminUsers
								data={companiesData}
								setUsersData={setCompaniesData}
							/>
						)}
						{pageOption === PageOption.form && <AdminForms />}
					</main>

					<footer className={styles.footer}>
						Politechnika Wrocławska
					</footer>
				</div>
			</>
		);
	}
	return (
		<>
			<div className={styles.container}>
				<main className={styles.main}>
					<h1 style={{ maxWidth: '80vw' }}>
						This is admin page please SIGNIN to access
					</h1>
				</main>
				<footer className={styles.footer}>
					<div>Politechnika Wrocławska</div>
				</footer>
			</div>
		</>
	);
};

export default Home;
