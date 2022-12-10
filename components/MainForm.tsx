import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
	Button,
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
	Input,
	Option,
	Select as SelectTS,
} from '@prisma/client';
import RenderSelect from './RenderSelect';

export interface FormData {
	fill: string;
	name: string;
	index: number;
	id: string;
	popup?: FormData[];
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
		| Form & {
				inputs: Input[];
				selects: (SelectTS & { options: Option[] })[];
				checkboxes: CheckBox[];
		  }
	>();
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [nextForm, setNextForm] = useState<
		(Form & {
			inputs: Input[];
			selects: (SelectTS & { options: Option[] })[];
			checkboxes: CheckBox[];
		})[]
	>([]);
	const [initIndex, setInitalIndex] = useState(0);
	const [disabled, setDisabled] = useState(false);
	const [popId, setPopId] = useState<string>();

	useEffect(() => {
		if (form === null || form === undefined) {
			fetch('api/getform')
				.then((response) => response.json())
				.then(({ form }) => {
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
	}, [initIndex, form]);

	const handleClick = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		let data: FormData[] = [];
		let mainData = formData.map((el) => {
			if (el.popup) {
				data = [...data, ...el.popup];
				delete el.popup;
				return el;
			}
			return el;
		});
		setError(validForm(formData));
		if (validForm(formData).length !== 0) {
			return;
		}
		setLoading(true);
		if (session?.user?.pin) {
			await fetch('/api/user/neworder', {
				method: 'POST',
				body: JSON.stringify([...mainData, ...data]),
			}).then((response) => {
				if (response.status === 200) {
					setFormData([]);
				}
			});
			setPageOption(PageOption.myOrders);
			return;
		}
	};

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
		console.log(formData);
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
			setPopId(option.formId);
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

	return (
		<>
			<h1>Fill up to take order</h1>
			<h2 style={{ margin: '0px' }}>{form?.name}</h2>
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
									el.id,
									initIndex + index
								)
							}
						/>
					</div>
				))}
				{form?.selects?.map(
					(el: SelectTS & { options: Option[] }, index: number) => {
						return (
							<RenderSelect
								key={el.id}
								el={el}
								handleSelectChange={handleSelectChange}
								formData={formData}
								setFormData={setFormData}
								index={index}
								popId={popId}
								ind={initIndex + form.inputs.length + index}
							/>
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
				<div style={{ color: palette.warning.main, fontWeight: '600' }}>
					{error}
				</div>
				{nextForm.length !== 0 ? (
					<>
						<Button
							type='button'
							disabled={disabled}
							onClick={() => {
								setError(validForm(formData));
								if (validForm(formData).length !== 0) {
									return;
								}
								setInitalIndex(formData.length);
								setForm(nextForm[0]);
								setFormData((pre) => {
									const arr: FormData[] = pre;
									nextForm[0].inputs.forEach(
										(el: Input, index: number) =>
											arr.push({
												name: el.label,
												fill: '',
												index: pre.length + index,
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
													nextForm[0].inputs.length -
													1 +
													index,
												id: el.id,
											})
									);
									nextForm[0].checkboxes.forEach(
										(el: CheckBox, index: number) =>
											arr.push({
												name: el.label,
												fill: 'false',
												index:
													pre.length +
													nextForm[0].inputs.length -
													2 +
													nextForm[0].selects.length +
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
							style={{ order: 999999999, marginBottom: '10px' }}
							variant='contained'>
							Next
						</Button>
					</>
				) : (
					<Button
						type='submit'
						disabled={disabled}
						style={{ order: 999999999, marginBottom: '10px' }}
						variant='contained'>
						Submit Order
					</Button>
				)}
			</form>
		</>
	);
};

export default MainFrom;
