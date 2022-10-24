import Head from 'next/head';
import Nav from '../componenets/Navbar';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
	const router = useRouter();
	const { data, status } = useSession();
	console.log(status);
	return (
		<div className={styles.container}>
			<Nav />
			<Head>
				<title>Create Next App</title>
				<meta
					name='description'
					content='Generated by create next app'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>
					Home <a href='#'>Page</a>
				</h1>

				<p className={styles.description}>
					Get started by editing{' '}
					<code className={styles.code}>pages/index.js</code>
				</p>
			</main>

			<footer className={styles.footer}>Politechnika Wrocławska</footer>
		</div>
	);
};

export default Home;
