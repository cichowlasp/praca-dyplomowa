import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import styles from '../styles/Edit.module.css';
import {
	Select,
	MenuItem,
	Button,
	TextField,
	Switch,
	SelectChangeEvent,
	useTheme,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import Loading from './Loading';
import {
	Form,
	Select as SelectTS,
	Option,
	Input,
	CheckBox,
} from '@prisma/client';
import { FormData } from './MainForm';
import { validForm } from '../utils/validationSchema';

const PopUpForm = ({
	popId,
	closeForm,
	setFormDataMain,
}: {
	closeForm: () => void;
	popId: string | undefined;
	setFormDataMain: React.Dispatch<React.SetStateAction<FormData[]>>;
}) => {
	const { palette } = useTheme();
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState<
		| (Form & {
				selects: (SelectTS & { options: Option[] })[];
				inputs: Input[];
				checkboxes: CheckBox[];
		  })
		| null
	>();
	const [error, setError] = useState<string>('');
	const [nextForm, setNextForm] = useState<
		(Form & {
			inputs: Input[];
			selects: (SelectTS & { options: Option[] })[];
			checkboxes: CheckBox[];
		})[]
	>([]);
	const [initalIndex, setInitalIndex] = useState(0);
	const [disabled, setDisabled] = useState(false);
	const [formData, setFormData] = useState<FormData[]>([]);

	useEffect(() => {
		if (form === null || form === undefined) {
			fetch('/api/user/getform', { method: 'POST', body: popId })
				.then((response) => response.json())
				.then((data) => {
					setForm(data);
				});
		}
	}, [popId, form]);

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
		if (!form) {
			return;
		}
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
		if (option?.formId !== null) {
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
		if (!form) {
			return;
		}
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

	const handleClick = async () => {
		setError(validForm(formData));
		if (validForm(formData).length !== 0) {
			return;
		}
		setFormDataMain((pre) => [...pre, ...formData]);
		closeForm();
	};

	return (
		<>
			<div
				style={{
					position: 'absolute',
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
				}}
				className={styles.container}>
				<Paper
					style={{
						position: 'relative',
						padding: '20px',
						paddingBottom: '20px',
						display: 'flex',
						flexDirection: 'column',
						alignContent: 'center',
						width: '25rem',
						maxWidth: '90vw',
						maxHeight: '90%',
					}}
					elevation={3}>
					{form === null || form === undefined ? (
						<Loading />
					) : (
						<>
							<h1 style={{ textAlign: 'center', marginTop: 0 }}>
								{form.name} informations
							</h1>

							<>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										height: '100%',
										maxHeight: '100%',
										gap: '10px',
									}}>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											textAlign: 'left',
											width: '100%',
											gap: '10px',
										}}>
										{form.inputs.map(
											(el: Input, index: number) => (
												<div
													style={{
														justifyContent:
															'center',
														order: 1 + el.order,
													}}
													key={el.id}>
													<div
														style={{
															width: '100%',
															fontWeight: 'bold',
															textAlign: 'left',
														}}>
														{el.label}
													</div>
													<TextField
														placeholder={
															el.placeholder
																? el.placeholder
																: undefined
														}
														fullWidth={true}
														required={el.required}
														type={el.type}
														onChange={(event) =>
															handleInputChange(
																event,
																index,
																el.label
																	? el.label
																	: el.id,
																el.order
															)
														}
													/>
												</div>
											)
										)}
										{form.selects.map(
											(
												el: SelectTS & {
													options: Option[];
												},
												index: number
											) => (
												<div
													style={{
														justifyContent:
															'center',
														order: el.order,
													}}
													key={el.id}>
													<div
														className={styles.label}
														style={{
															fontWeight: 'bold',
															textAlign: 'left',
															width: '100%',
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
																el.label
																	? el.label
																	: el.id,
																el.order
															);
														}}>
														{el.options.map(
															(
																option: Option
															) => {
																return (
																	<MenuItem
																		key={
																			option.id
																		}
																		value={
																			option.value
																		}>
																		{
																			option.value
																		}
																	</MenuItem>
																);
															}
														)}
													</Select>
												</div>
											)
										)}
										{form?.checkboxes.map(
											(el, index: number) => (
												<div
													className={styles.input}
													style={{
														display: 'flex',
														alignItems: 'center',
														justifyContent:
															'center',
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
													<div
														className={
															styles.checkbox
														}>
														<Switch
															style={{
																alignSelf:
																	'left',
															}}
															defaultChecked={JSON.parse(
																formData[
																	form.inputs
																		.length +
																		form
																			.selects
																			.length +
																		index
																].fill
															)}
															onChange={() =>
																handleCheckboxChange(
																	index,
																	el.label
																		? el.label
																		: el.id,
																	el.order
																)
															}
														/>
													</div>
												</div>
											)
										)}
										<div
											style={{
												color: palette.warning.main,
												fontWeight: '600',
											}}>
											{error}
										</div>
									</div>
									{nextForm.length !== 0 ? (
										<>
											<Button
												disabled={disabled}
												onClick={() => {
													setError(
														validForm(formData)
													);
													if (
														validForm(formData)
															.length !== 0
													) {
														return;
													}
													setInitalIndex(
														formData.length
													);
													setForm(nextForm[0]);
													if (nextForm.length !== 0) {
														setNextForm((pre) =>
															pre.splice(1)
														);
													}
												}}
												style={{
													order: 999999999,
													marginBottom: '10px',
												}}
												variant='contained'>
												Next
											</Button>
										</>
									) : (
										<Button
											onClick={handleClick}
											disabled={disabled}
											style={{
												order: 999999999,
												marginBottom: '10px',
											}}
											type='button'
											variant='contained'>
											Add
										</Button>
									)}
								</div>
							</>
						</>
					)}
				</Paper>
			</div>
		</>
	);
};

export default PopUpForm;
