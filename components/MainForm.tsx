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
import { useSession } from 'next-auth/react';
import { validForm } from '../utils/validationSchema';
import { PageOption } from '../pages/company';
import {
	CheckBox,
	Form,
	From,
	Input,
	Option,
	Select as SelectTS,
} from '@prisma/client';
import PopUpForm from './PopUpForm';

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
	const [form, setForm] = useState<
		| (Form & {
				inputs: Input[];
				selects: (SelectTS & { options: Option[] })[];
				checkboxes: CheckBox[];
		  })
		| null
	>(null);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [nextForm, setNextForm] = useState<
		(Form & {
			inputs: Input[];
			selects: (SelectTS & { options: Option[] })[];
			checkboxes: CheckBox[];
		})[]
	>([]);
	const [initalIndex, setInitalIndex] = useState(0);
	const [disabled, setDisabled] = useState(false);
	const [popForm, setPopForm] = useState(false);
	const [popId, setPopId] = useState<string>();

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
								fill: '',
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
			modifyFormData[initalIndex + index] = {
				name,
				fill: event.target.value,
				index: initalIndex + order,
			};
			return modifyFormData;
		});
	};
	const handleSelectChange = async (
		event: SelectChangeEvent<unknown>,
		index: number,
		name: string,
		order: number
	) => {
		setFormData((pre) => {
			const indexAtArr = initalIndex + form.inputs.length + index;
			let modifyFormData: FormData[] = pre;
			modifyFormData[indexAtArr] = {
				name,
				fill: event.target.value
					? JSON.stringify(event.target.value)
					: '',
				index: initalIndex + order,
			};
			return modifyFormData;
		});
		const option = form.selects[index].options.find(
			(option: Option) => option.value === event.target.value
		);

		if (option?.formId !== null && option?.formType === 'POPUP') {
			setPopId(option.formId);
			setPopForm(true);
		} else {
			const start =
				form.inputs.length +
				form.selects.length +
				form.checkboxes.length;
			setFormData((pre) => pre.slice(start, -1));
		}

		if (option?.formId !== null && option?.formType === 'NEXT') {
			setDisabled(true);
			await fetch('api/nextform', {
				method: 'POST',
				body: option?.formId,
			})
				.then((response) => response.json())
				.then(({ form }) => {
					setNextForm((pre) => {
						let tab = pre;
						tab[index] = form;
						return tab;
					});
					if (!nextForm) return;
				});
			setDisabled(false);
		} else {
			setNextForm((pre) =>
				pre.filter((_, localIndex) => localIndex !== index)
			);
		}
	};

	const handleCheckboxChange = (
		index: number,
		name: string,
		order: number
	) => {
		setFormData((pre) => {
			const indexAtArr =
				initalIndex + form.inputs.length + form.selects.length + index;
			let modifyFormData: FormData[] = pre;
			modifyFormData[indexAtArr] = {
				name,
				fill: JSON.stringify(!JSON.parse(pre[indexAtArr].fill)),
				index: initalIndex + order,
			};
			return modifyFormData;
		});
	};

	const handleClick = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(validForm(formData));
		if (validForm(formData).length !== 0) {
			return;
		}
		setLoading(true);
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
			<h2 style={{ margin: '0px' }}>{form.name}</h2>
			<form
				className={styles.form}
				onSubmit={(event) => handleClick(event)}>
				{form?.inputs.map((el: Input, index: number) => (
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
					(el: SelectTS & { options: Option[] }, index: number) => {
						return (
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
										el.placeholder
											? el.placeholder
											: undefined
									}
									fullWidth={true}
									required={el.required}
									size={'small'}
									variant='outlined'
									defaultValue={''}
									onChange={(event) => {
										handleSelectChange(
											event,
											index,
											el.label ? el.label : el.id,
											el.order
										);
									}}>
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
								{popForm && (
									<PopUpForm
										popId={popId}
										closeForm={() => setPopForm(false)}
										setFormDataMain={setFormData}
									/>
								)}
							</div>
						);
					}
				)}
				{form?.checkboxes.map((el, index: number) => (
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
				{nextForm.length !== 0 ? (
					<>
						<Button
							disabled={disabled}
							onClick={() => {
								setError(validForm(formData));
								if (validForm(formData).length !== 0) {
									return;
								}
								setInitalIndex(formData.length);
								setForm(nextForm[0]);
								if (nextForm.length !== 0) {
									setNextForm((pre) => pre.splice(1));
								}
							}}
							style={{ order: 999999999, marginBottom: '10px' }}
							variant='contained'>
							Next
						</Button>
					</>
				) : (
					<Button
						disabled={disabled}
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
