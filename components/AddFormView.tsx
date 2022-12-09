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
import CancelIcon from '@mui/icons-material/Cancel';
import { useSession } from 'next-auth/react';
import Loading from './Loading';
import {
	Form,
	Select as SelectTS,
	Option,
	Input,
	CheckBox,
	Order,
	Info,
	Message,
} from '@prisma/client';
import { FormData } from './MainForm';
import { validForm } from '../utils/validationSchema';

const AddFormView = ({
	closeForm,
	order,
	updateData,
}: {
	closeForm: () => void;
	order: Order & { informations: Info[]; messages: Message[] };
	updateData: (
		localLoading?: React.Dispatch<React.SetStateAction<boolean>>
	) => {};
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
	const [localPopId, setLocalPopId] = useState<string>('');
	const [localPopForm, setLocalPopForm] = useState(false);

	useEffect(() => {
		if (form === null || form === undefined) {
			fetch('/api/user/getform', { method: 'POST', body: order.formId })
				.then((response) => response.json())
				.then((data) => {
					setForm(data);
				});
		}
	}, [order.formId, form]);

	if (form === null || form === undefined) return <Loading />;

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
				fill: event.target.value
					? JSON.stringify(event.target.value)
					: '',
			};
			return pre;
		});

		const option = form?.selects[index].options.find(
			(option: Option) => option.value === event.target.value
		);

		if (option?.formId !== null && option?.formType === 'POPUP') {
			setLocalPopId(option.formId);
			setLocalPopForm(true);
		} else {
			const start =
				form.inputs.length +
				form.selects.length +
				form.checkboxes.length;
			setFormData((pre) => pre.filter((_, index) => index < start));
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
		setLoading(true);
		if (session?.user?.pin) {
			await fetch('/api/user/adddatatoorder', {
				method: 'POST',
				body: JSON.stringify(
					formData.map((el) => {
						return {
							...el,
							index: order.informations.length + el.index,
							orderId: order.id,
						};
					})
				),
			}).then((response) => {
				if (response.status === 200) {
					setFormData([]);
				}
			});
			updateData();
			closeForm();
			return;
		}
	};

	return (
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
				<h1 style={{ textAlign: 'center', marginTop: 0 }}>
					Additional Form:
				</h1>
				{session?.user?.pin && !loading ? (
					<>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								height: '100%',
								maxHeight: '100%',
								justifyContent: 'center',
								alignItems: 'center',
								gap: '10px',
							}}>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									marginLeft: '0.5rem',
								}}>
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
											style={{
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
												handleInputChange(event, el.id)
											}
										/>
									</div>
								))}
								{form.selects.map(
									(
										el: SelectTS & { options: Option[] },
										index: number
									) => (
										<div
											className={styles.input}
											style={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												order: el.order,
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
														el.id
													);
												}}>
												{el.options.map(
													(option: Option) => {
														return (
															<MenuItem
																key={option.id}
																value={
																	option.value
																}>
																{option.value}
															</MenuItem>
														);
													}
												)}
											</Select>
										</div>
									)
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
											style={{
												fontWeight: 'bold',
												textAlign: 'left',
											}}>
											{el.label}
										</div>
										<div className={styles.checkbox}>
											<Switch
												style={{ alignSelf: 'left' }}
												defaultChecked={JSON.parse(
													formData[
														form.inputs.length +
															form.selects
																.length +
															index
													].fill
												)}
												onChange={() =>
													handleCheckboxChange(el.id)
												}
											/>
										</div>
									</div>
								))}
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
											setError(validForm(formData));
											if (
												validForm(formData).length !== 0
											) {
												return;
											}
											setInitalIndex(formData.length);
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
									type='submit'
									variant='contained'>
									Submit Order
								</Button>
							)}
						</div>
					</>
				) : (
					<Loading />
				)}

				<CancelIcon
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',
						cursor: 'pointer',
					}}
					fontSize='large'
					onClick={async () => {
						closeForm();
					}}
				/>
			</Paper>
		</div>
	);
};

export default AddFormView;
