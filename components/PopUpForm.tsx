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
	startIndex,
	ind,
}: {
	closeForm: () => void;
	popId: string | undefined;
	setFormDataMain: React.Dispatch<React.SetStateAction<FormData[]>>;
	startIndex: number;
	ind: number;
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
	const [initalIndex, setInitalIndex] = useState(startIndex);
	const [disabled, setDisabled] = useState(false);
	const [formData, setFormData] = useState<FormData[]>([]);
	const [localPopId, setLocalPopId] = useState<string | undefined>('');
	const [localPopForm, setLocalPopForm] = useState(false);

	useEffect(() => {
		if (form === null || form === undefined) {
			fetch('/api/user/getform', { method: 'POST', body: popId })
				.then((response) => response.json())
				.then((data) => {
					setForm(() => {
						setFormData(() => {
							const arr: FormData[] = [];
							data.inputs.forEach((el: Input) =>
								arr.push({
									name: el.label ? el.label : '',
									fill: '',
									index: el.order,
									id: el.id,
								})
							);

							data.selects.forEach(
								(el: SelectTS & { options: Option[] }) =>
									arr.push({
										name: el.label ? el.label : '',
										fill: '',
										index: el.order,
										id: el.id,
									})
							);
							data.checkboxes.forEach((el: CheckBox) =>
								arr.push({
									name: el.label ? el.label : '',
									fill: JSON.stringify(false),
									index: el.order,
									id: el.id,
								})
							);

							return arr;
						});
						return data;
					});
				});
		}
	}, [popId, form, formData, setFormDataMain]);

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		id: string
	) => {
		setFormData((pre) => {
			const index = pre.findIndex((el) => el.id === id);
			const previous = pre[index];
			pre[index] = { ...previous, fill: event.target.value };
			return pre;
		});
	};
	const handleSelectChange = async (
		event: SelectChangeEvent<unknown>,
		index: number,
		id: string
	) => {
		setFormData((pre) => {
			const index = pre.findIndex((el) => el.id === id);
			const previous = pre[index];

			pre[index] = {
				...previous,
				fill: JSON.stringify(event.target.value),
			};
			return pre;
		});

		if (form === undefined || form === null) return;

		const option = form.selects[index].options.find(
			(option: Option) => option.value === event.target.value
		);

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
			return;
		} else {
			setNextForm((pre) =>
				pre.filter((_, localIndex) => localIndex !== index)
			);
		}

		if (option?.formId !== null && option?.formType === 'POPUP') {
			setLocalPopId(option.formId);
			setLocalPopForm(true);
			return;
		} else {
			setLocalPopId(undefined);
			const start =
				form.inputs.length +
				form.selects.length +
				form.checkboxes.length;
			setFormData((pre) => pre.filter((_, index) => index < start));
		}
	};
	const handleCheckboxChange = (id: string) => {
		setFormData((pre) => {
			const index = pre.findIndex((el) => el.id === id);
			const previous = pre[index];
			pre[index] = {
				...previous,
				fill: JSON.stringify(!JSON.parse(previous.fill)),
			};
			return pre;
		});
	};

	const handleClick = async () => {
		setError(validForm(formData));
		if (validForm(formData).length !== 0) {
			return;
		}
		console.log(ind);
		setFormDataMain((pre) => {
			pre[ind].popup = formData;
			return pre;
		});
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
								{form.name} {ind}
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
																el.id
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
																el.id
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
																	el.id
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
									<div
										style={{
											placeSelf: 'center',
										}}>
										<span style={{ width: '20px' }}>
											<Button
												onClick={() => {
													closeForm();
												}}
												variant='outlined'
												style={{
													order: 999999999,
												}}>
												Cancel
											</Button>
										</span>
										<span style={{ width: '20px' }}>
											{' '}
											{nextForm.length !== 0 ? (
												<>
													<Button
														disabled={disabled}
														onClick={() => {
															setError(
																validForm(
																	formData
																)
															);
															if (
																validForm(
																	formData
																).length !== 0
															) {
																return;
															}
															setInitalIndex(
																formData.length
															);
															setForm(() => {
																setFormData(
																	(pre) => {
																		const arr: FormData[] =
																			formData;
																		nextForm[0].inputs.forEach(
																			(
																				el: Input
																			) =>
																				arr.push(
																					{
																						name: el.label
																							? el.label
																							: '',
																						fill: '',
																						index: el.order,
																						id: el.id,
																					}
																				)
																		);

																		nextForm[0].selects.forEach(
																			(
																				el: SelectTS & {
																					options: Option[];
																				}
																			) =>
																				arr.push(
																					{
																						name: el.label
																							? el.label
																							: '',
																						fill: '',
																						index: el.order,
																						id: el.id,
																					}
																				)
																		);
																		nextForm[0].checkboxes.forEach(
																			(
																				el: CheckBox
																			) =>
																				arr.push(
																					{
																						name: el.label
																							? el.label
																							: '',
																						fill: JSON.stringify(
																							false
																						),
																						index: el.order,
																						id: el.id,
																					}
																				)
																		);
																		return arr;
																	}
																);

																return nextForm[0];
															});

															if (
																nextForm.length !==
																0
															) {
																setNextForm(
																	(pre) =>
																		pre.splice(
																			1
																		)
																);
															}
														}}
														style={{
															order: 999999999,
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
													}}
													type='button'
													variant='contained'>
													Add
												</Button>
											)}
										</span>
									</div>
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
