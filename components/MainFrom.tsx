import React, { useEffect, useRef, useState } from 'react';
import {
	Button,
	MenuItem,
	Select,
	Switch,
	TextField,
	useTheme,
} from '@mui/material';
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
	const [form, setForm] = useState<{
		form: { inputs: any[]; selects: any[]; checkboxes: any[] };
	} | null>(null);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const handleInputChange = (event: any, index: number, name: string) => {
		setFormData((pre) => {
			let modifyFormData: any[] = pre;
			modifyFormData[index] = { name, fill: event.target.value };
			return modifyFormData;
		});
	};
	const handleSelectChange = (event: any, index: number, name: string) => {
		setFormData((pre) => {
			const indexAtArr = form.inputs.length + index;
			let modifyFormData: any[] = pre;
			modifyFormData[indexAtArr] = { name, fill: event.target.value };
			return modifyFormData;
		});
	};

	const handleCheckboxChange = (event: any, index: number, name: string) => {
		setFormData((pre) => {
			const indexAtArr = form.inputs.length + form.selects.length + index;
			let modifyFormData: any[] = pre;
			modifyFormData[indexAtArr] = { name, fill: event.target.checked };
			return modifyFormData;
		});
		console.log(formData);
	};

	const handleClick = async (event: any) => {
		event.preventDefault();
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
			.then(({ form }) => setForm(form));
	}, []);

	if (form === null || loading) return <Loading />;
	return (
		<>
			<h1>Fill up to take order</h1>
			<form
				className={styles.form}
				onSubmit={(event) => handleClick(event)}>
				{session?.user.pin ? (
					<></>
				) : (
					<>
						<div className={styles.input}>
							<div
								style={{
									fontWeight: 'bold',
									textAlign: 'left',
								}}>
								Company
							</div>
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
							<div
								style={{
									fontWeight: 'bold',
									textAlign: 'left',
								}}>
								Email
							</div>
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
						<div
							className={styles.label}
							style={{ fontWeight: 'bold', textAlign: 'left' }}>
							{el.label}
						</div>
						<TextField
							placeholder={el.placeholder}
							fullWidth={true}
							required={el.required}
							type={el.type}
							onChange={(event) =>
								handleInputChange(event, index, el.placeholder)
							}
						/>
					</div>
				))}
				{form.selects.map((el, index: number) => (
					<div
						className={styles.input}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						key={el.id}>
						<div
							className={styles.label}
							style={{ fontWeight: 'bold', textAlign: 'left' }}>
							{el.label}
						</div>
						<Select
							placeholder={el.placeholder}
							fullWidth={true}
							required={el.required}
							size={'small'}
							type={el.type}
							variant='outlined'
							defaultValue={
								!el.required ? '' : el.options[0].value
							}
							value={formData[form.inputs.length + index]?.fill}
							onChange={(event) => {
								handleSelectChange(event, index, el.label);
							}}>
							{!el.required && (
								<MenuItem value={''}>None</MenuItem>
							)}
							{el.options.map((option: any) => {
								return (
									<MenuItem
										key={option.id}
										value={option.value}>
										{option.value}
									</MenuItem>
								);
							})}
						</Select>
					</div>
				))}
				{form.checkboxes.map((el, index: number) => (
					<div
						className={styles.input}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						key={el.id}>
						<div
							className={styles.label}
							style={{ fontWeight: 'bold', textAlign: 'left' }}>
							{el.label}
						</div>
						<Switch
							checked={
								formData[
									form.inputs.length +
										form.selects.length +
										index
								]?.fill
							}
							onChange={(event) =>
								handleCheckboxChange(event, index, el.label)
							}
						/>
					</div>
				))}
				<div style={{ color: palette.warning.main, fontWeight: '600' }}>
					{error}
				</div>
				<Button type='submit' variant='contained'>
					Submit Order
				</Button>
			</form>
		</>
	);
};

export default MainFrom;
