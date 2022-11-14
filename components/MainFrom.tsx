import React, { useEffect, useRef, useState } from 'react';
import { Button, TextField, useTheme } from '@mui/material';
import Loading from './Loading';
import styles from '../styles/MainForm.module.css';
import { signIn, useSession } from 'next-auth/react';
import { validForm } from '../utils/validationSchema';
import { PageOption } from '../pages/index';

const MainFrom = ({ setPageOption }: { setPageOption: any }) => {
	const defaultState: { fill: string; name: string }[] = [];
	const { data: session } = useSession();
	const { palette } = useTheme();
	const [formData, setFormData] = useState<any[]>(defaultState);
	const [userData, setUserData] = useState<{
		company: string;
		email: string;
	}>({ company: '', email: '' });
	const [form, setForm] = useState<{ inputs: any[] } | null>(null);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const handleChange = (event: any, index: number, name: string) => {
		setFormData((pre) => {
			let modifyFormData: any[] = pre;
			modifyFormData[index] = { name, fill: event.target.value };
			return modifyFormData;
		});
	};

	const handleClick = async () => {
		setError(validForm(formData));
		if (validForm(formData).length !== 0) {
			return;
		}
		setLoading(true);
		if (userData.company !== '' && userData.email !== '') {
			await fetch('/api/user/createnewuser', {
				method: 'POST',
				body: JSON.stringify(userData),
			})
				.then((response) => response.json())
				.then(async (data) => {
					await signIn('credentials', {
						redirect: false,
						pin: data.pin,
					});
					await fetch('/api/user/neworder', {
						method: 'POST',
						body: JSON.stringify(formData),
					}).then((response) => {
						if (response.status === 200) {
							setFormData(defaultState);
						}
					});
					setPageOption(PageOption.myOrders);
					setLoading(false);
					return;
				});
		}
		if (session?.user.pin) {
			await fetch('/api/user/neworder', {
				method: 'POST',
				body: JSON.stringify(formData),
			}).then((response) => {
				if (response.status === 200) {
					setFormData(defaultState);
				}
			});
			setPageOption(PageOption.myOrders);
			return;
		}
	};

	useEffect(() => {
		fetch('api/getform')
			.then((response) => response.json())
			.then((data) => setForm(data));
	}, []);
	if (form === null || loading) return <Loading />;
	return (
		<div className={styles.form}>
			<h1>Fill up to take order</h1>
			{session?.user.pin ? (
				<></>
			) : (
				<>
					<div className={styles.input}>
						<TextField
							placeholder={'Company'}
							type={'text'}
							onChange={(event) => {
								setUserData((prev) => {
									return {
										...prev,
										company: event.target.value.trim(),
									};
								});
							}}
						/>
					</div>
					<div className={styles.input}>
						<TextField
							placeholder={'Email'}
							type={'text'}
							onChange={(event) => {
								setUserData((prev) => {
									return {
										...prev,
										email: event.target.value.trim(),
									};
								});
							}}
						/>
					</div>
				</>
			)}
			{form.inputs.map((el, index: number) => (
				<div
					className={styles.input}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
					key={el.id}>
					<TextField
						placeholder={el.placeholder}
						type={el.type}
						onChange={(event) =>
							handleChange(event, index, el.placeholder)
						}
					/>
				</div>
			))}
			<div style={{ color: palette.warning.main, fontWeight: '600' }}>
				{error}
			</div>
			<Button variant='contained' onClick={handleClick}>
				Submit Order
			</Button>
		</div>
	);
};

export default MainFrom;
