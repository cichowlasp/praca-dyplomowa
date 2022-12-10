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
import RenderSelect from './RenderSelect';

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
	const [initIndex, setInitalIndex] = useState(0);
	const [disabled, setDisabled] = useState(false);
	const [formData, setFormData] = useState<FormData[]>([]);
	const [localPopId, setLocalPopId] = useState<string>('');

	useEffect(() => {
		if (form === null || form === undefined) {
			fetch('/api/user/getform', { method: 'POST', body: order.formId })
				.then((response) => response.json())
				.then((form) => {
					setForm(form);
					if (!form) return;
					setFormData(() => {
						const arr: FormData[] = [];
						form.inputs.forEach((el: Input, index: number) =>
							arr.push({
								name: el.label,
								fill: '',
								index: initIndex + index,
								id: el.id,
							})
						);

						form.selects.forEach(
							(
								el: SelectTS & { options: Option[] },
								index: number
							) =>
								arr.push({
									name: el.label,
									fill: '',
									index:
										initIndex + form.inputs.length + index,
									id: el.id,
								})
						);
						form.checkboxes.forEach((el: CheckBox, index: number) =>
							arr.push({
								name: el.label,
								fill: 'false',
								index:
									initIndex +
									form.inputs.length +
									form.selects.length +
									index,
								id: el.id,
							})
						);
						return arr.sort((a, b) => a.index - b.index);
					});
				});
		}
	}, [order.formId, form, initIndex]);

	if (form === null || form === undefined) return <Loading />;

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		id: string,
		ind: number
	) => {
		setFormData((pre) => {
			const index = pre.findIndex(
				(el) => el.id === id && ind === el.index
			);
			const previous = pre[index];
			pre[index] = { ...previous, fill: event.target.value };
			return pre;
		});
	};

	const handleSelectChange = async (
		event: SelectChangeEvent<unknown>,
		index: number,
		id: string,
		ind: number
	) => {
		setFormData((pre) => {
			const index = pre.findIndex(
				(el) => el.id === id && ind === el.index
			);
			const previous = pre[index];

			pre[index] = {
				...previous,
				fill: JSON.stringify(event.target.value),
			};
			return pre;
		});

		const option = form?.selects[index].options.find(
			(option: Option) => option.value === event.target.value
		);
		if (option?.formId !== null && option?.formType === 'POPUP') {
			setLocalPopId(option.formId);
			return;
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
						pre.push(form);
						return pre;
					});
				});
			setDisabled(false);
		} else {
			setNextForm((pre) =>
				pre.filter((_, localIndex) => localIndex !== index)
			);
		}
	};

	const handleCheckboxChange = (id: string, ind: number) => {
		setFormData((pre) => {
			const index = pre.findIndex(
				(el) => el.id === id && ind === el.index
			);
			const previous = pre[index];
			pre[index] = {
				...previous,
				fill: JSON.stringify(!JSON.parse(previous.fill)),
			};
			return pre;
		});
	};

	const handleClick = async () => {
		let data: FormData[] = [];
		let mainData = formData.map((el) => {
			if (el.popup) {
				data = [...data, ...el.popup];
				delete el.popup;
				return el;
			}
			return el;
		});
		const dataToSend = [...mainData, ...data];
		setError(validForm(dataToSend));
		if (validForm(dataToSend).length !== 0) {
			return;
		}
		setLoading(true);
		if (session?.user?.pin) {
			await fetch('/api/user/adddatatoorder', {
				method: 'POST',
				body: JSON.stringify(
					dataToSend.map((el) => {
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
					justifyContent: 'center',
					textAlign: 'center',
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
						<div className={styles.form}>
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
										style={{
											fontWeight: 'bold',
											alignItems: 'left',
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
												el.id,
												initIndex + index
											)
										}
									/>
								</div>
							))}
							{form?.selects?.map(
								(
									el: SelectTS & { options: Option[] },
									index: number
								) => {
									return (
										<div
											className={styles.input}
											key={el.id}
											style={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												order: 1 + el.order,
												width: '230px',
											}}>
											<RenderSelect
												el={el}
												handleSelectChange={
													handleSelectChange
												}
												formData={formData}
												setFormData={setFormData}
												index={index}
												popId={localPopId}
												ind={
													initIndex +
													form.inputs.length +
													index
												}
											/>
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
														form.selects.length +
														index
												].fill
											)}
											onChange={() =>
												handleCheckboxChange(
													el.id,
													initIndex +
														form.inputs.length +
														form.selects.length +
														index
												)
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
							{nextForm.length !== 0 ? (
								<>
									<Button
										type='button'
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
											setFormData((pre) => {
												const arr: FormData[] = pre;
												nextForm[0].inputs.forEach(
													(
														el: Input,
														index: number
													) =>
														arr.push({
															name: el.label,
															fill: '',
															index:
																pre.length +
																index,
															id: el.id,
														})
												);

												nextForm[0].selects.forEach(
													(
														el: SelectTS & {
															options: Option[];
														},
														index: number
													) =>
														arr.push({
															name: el.label,
															fill: '',
															index:
																pre.length +
																nextForm[0]
																	.inputs
																	.length -
																1 +
																index,
															id: el.id,
														})
												);
												nextForm[0].checkboxes.forEach(
													(
														el: CheckBox,
														index: number
													) =>
														arr.push({
															name: el.label,
															fill: 'false',
															index:
																pre.length +
																nextForm[0]
																	.inputs
																	.length -
																2 +
																nextForm[0]
																	.selects
																	.length +
																index,
															id: el.id,
														})
												);
												return arr.sort(
													(a, b) => a.index - b.index
												);
											});
											setNextForm((pre) => pre.splice(1));
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
									onClick={(event) => handleClick()}
									disabled={disabled}
									style={{
										order: 999999999,
										marginTop: '10px',
									}}
									variant='contained'>
									Update Order
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
