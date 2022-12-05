import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
	Button,
	MenuItem,
	Select,
	SelectChangeEvent,
	Switch,
	TextField,
	useTheme,
} from '@mui/material';
import Loading from './Loading';
import styles from '../styles/MainForm.module.css';
import { signIn, useSession } from 'next-auth/react';
import { validForm } from '../utils/validationSchema';
import { PageOption } from '../pages/company';
import { CheckBox, Input, Option, Select as SelectTS } from '@prisma/client';

export interface FormData {
	fill: string;
	name: string;
	index: number;
}

const MainFrom = ({
	setPageOption,
}: {
	setPageOption: Dispatch<SetStateAction<PageOption>>;
}) => {
	const [formData, setFormData] = useState<FormData[]>([]);
	const { data: session } = useSession();
	const { palette } = useTheme();
	const [userData, setUserData] = useState<{
		company: string;
		email: string;
	}>({ company: '', email: '' });
	const [form, setForm] = useState<{
		inputs: Input[];
		selects: (SelectTS & { options: Option[] })[];
		checkboxes: CheckBox[];
	} | null>(null);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [nextForm, setNextForm] = useState<{
		inputs: Input[];
		selects: (SelectTS & { options: Option[] })[];
		checkboxes: CheckBox[];
	} | null>(null);

	useEffect(() => {
		fetch('api/getform')
			.then((response) => response.json())
			.then(({ form }) => {
				setForm(form);
				if (!form) return;
				setFormData(() => {
					const arr: FormData[] = [];
					form.inputs.forEach((el: Input) =>
						arr.push({
							name: el.label ? el.label : '',
							fill: '',
							index: el.order,
						})
					);

					form.selects.forEach(
						(el: SelectTS & { options: Option[] }) =>
							arr.push({
								name: el.label ? el.label : '',
								fill: !el.required ? '' : el.options[0].value,
								index: el.order,
							})
					);
					form.checkboxes.forEach((el: CheckBox) =>
						arr.push({
							name: el.label ? el.label : '',
							fill: JSON.stringify(false),
							index: el.order,
						})
					);
					return arr;
				});
			});
		setNextForm(null);
	}, []);

	if (form === null || loading) return <Loading />;

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		index: number,
		name: string,
		order: number
	) => {
		setFormData((pre) => {
			let modifyFormData: FormData[] = pre;
			modifyFormData[index] = {
				name,
				fill: event.target.value,
				index: order,
			};
			return modifyFormData;
		});
	};
	const handleSelectChange = async (
		event: SelectChangeEvent<string>,
		index: number,
		name: string,
		order: number
	) => {
		setFormData((pre) => {
			const indexAtArr = form.inputs.length + index;
			let modifyFormData: FormData[] = pre;
			modifyFormData[indexAtArr] = {
				name,
				fill: event.target.value,
				index: order,
			};
			return modifyFormData;
		});
		const option = form.selects[index].options.find(
			(option: Option) => option.value === event.target.value
		);
		if (option?.formId !== null) {
			await fetch('api/nextform', {
				method: 'POST',
				body: option?.formId,
			})
				.then((response) => response.json())
				.then(({ form }) => {
					setNextForm(form);
					if (!nextForm) return;
				});
		} else {
			setNextForm(null);
		}
	};

	const handleCheckboxChange = (
		index: number,
		name: string,
		order: number
	) => {
		setFormData((pre) => {
			const indexAtArr = form.inputs.length + form.selects.length + index;
			let modifyFormData: FormData[] = pre;
			modifyFormData[indexAtArr] = {
				name,
				fill: JSON.stringify(!JSON.parse(pre[indexAtArr].fill)),
				index: order,
			};
			return modifyFormData;
		});
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
							setFormData([]);
						}
					});
					setPageOption(PageOption.myOrders);
					setLoading(false);
					return;
				});
		}
		if (session?.user?.pin) {
			await fetch('/api/user/neworder', {
				method: 'POST',
				body: JSON.stringify(formData),
			}).then((response) => {
				if (response.status === 200) {
					setFormData([]);
				}
			});
			setPageOption(PageOption.myOrders);
			return;
		}
	};

	return (
		<>
			<h1>Fill up to take order</h1>
			<form
				className={styles.form}
				onSubmit={(event) => handleClick(event)}>
				{session?.user?.pin ? (
					<></>
				) : (
					<>
						<div style={{ order: 1 }} className={styles.input}>
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
								required={true}
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
						<div style={{ order: 1 }} className={styles.input}>
							<div
								style={{
									fontWeight: 'bold',
									textAlign: 'left',
								}}>
								Email
							</div>
							<TextField
								placeholder={'Email'}
								type={'email'}
								required={true}
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
				{form.inputs.map((el: Input, index: number) => (
					<div
						className={styles.input}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							order: 1 + el.order,
						}}
						key={el.id}>
						<div
							className={styles.label}
							style={{ fontWeight: 'bold', textAlign: 'left' }}>
							{el.label}
						</div>
						<TextField
							placeholder={
								el.placeholder ? el.placeholder : undefined
							}
							fullWidth={true}
							required={el.required}
							type={el.type}
							onChange={(event) =>
								handleInputChange(
									event,
									index,
									el.label ? el.label : el.id,
									el.order
								)
							}
						/>
					</div>
				))}
				{form?.selects?.map(
					(el: SelectTS & { options: Option[] }, index: number) => (
						<div
							className={styles.input}
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								order: 1 + el.order,
							}}
							key={el.id}>
							<div
								className={styles.label}
								style={{
									fontWeight: 'bold',
									textAlign: 'left',
								}}>
								{el.label}
							</div>
							<Select
								placeholder={
									el.placeholder ? el.placeholder : undefined
								}
								fullWidth={true}
								required={el.required}
								size={'small'}
								variant='outlined'
								defaultValue={
									''
									// formData[form.inputs.length + index].fill
								}
								onChange={(event) => {
									handleSelectChange(
										event,
										index,
										el.label ? el.label : el.id,
										el.order
									);
								}}>
								<MenuItem value={''}></MenuItem>

								{el.options.map((option: Option) => {
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
					)
				)}
				{form.checkboxes.map((el, index: number) => (
					<div
						className={styles.input}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							order: 1 + el.order,
						}}
						key={el.id}>
						<div
							className={styles.label}
							style={{ fontWeight: 'bold', textAlign: 'left' }}>
							{el.label}
						</div>
						<div className={styles.checkbox}>
							<Switch
								style={{ alignSelf: 'left' }}
								defaultChecked={JSON.parse(
									formData[
										form.inputs.length +
											form.selects.length +
											index
									].fill
								)}
								onChange={() =>
									handleCheckboxChange(
										index,
										el.label ? el.label : el.id,
										el.order
									)
								}
							/>
						</div>
					</div>
				))}
				<div style={{ color: palette.warning.main, fontWeight: '600' }}>
					{error}
				</div>
				{nextForm !== null ? (
					<>
						<Button
							onClick={(event) => {
								setForm(nextForm);
								setNextForm(null);
							}}
							style={{ order: 999999999, marginBottom: '10px' }}
							variant='contained'>
							Next
						</Button>
					</>
				) : (
					<Button
						style={{ order: 999999999, marginBottom: '10px' }}
						type='submit'
						variant='contained'>
						Submit Order
					</Button>
				)}
			</form>
		</>
	);
};

export default MainFrom;
