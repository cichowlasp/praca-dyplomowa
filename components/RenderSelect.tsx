import React, { useState } from 'react';
import { MenuItem, Select, SelectChangeEvent, Button } from '@mui/material';
import styles from '../styles/MainForm.module.css';
import { Option, Select as SelectTS } from '@prisma/client';
import { FormData } from './MainForm';
import PopUpForm from './PopUpForm';

type Props = {
	el: SelectTS & { options: Option[] };
	handleSelectChange: (
		event: SelectChangeEvent<unknown>,
		index: number,
		id: string,
		ind: number
	) => void;
	formData: FormData[];
	setFormData: React.Dispatch<React.SetStateAction<FormData[]>>;
	index: number;
	popId: string | undefined;
	ind: number;
};

const RenderSelect = ({
	el,
	formData,
	setFormData,
	handleSelectChange,
	index,
	popId,
	ind,
}: Props) => {
	const [popForm, setPopForm] = useState(false);
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
				placeholder={el.placeholder ? el.placeholder : undefined}
				fullWidth={true}
				required={el.required}
				size={'small'}
				variant='outlined'
				defaultValue={''}
				onChange={(event) => {
					const option = el.options.find(
						(option: Option) => option.value === event.target.value
					);
					if (option?.formType === 'POPUP') {
						setPopForm(true);
					}
					handleSelectChange(event, index, el.id, ind);
				}}>
				{el.options.map((option: Option) => {
					return (
						<MenuItem key={option.id} value={option.value}>
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
					startIndex={formData.length}
					ind={ind}
				/>
			)}
		</div>
	);
};

export default RenderSelect;
