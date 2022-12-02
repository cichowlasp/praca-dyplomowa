import React, { useState } from 'react';
import styles from '../styles/AdminForms.module.css';
import {
	Select,
	MenuItem,
	TextField,
	Switch,
	useTheme,
	Button,
} from '@mui/material';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
	CheckBox,
	Form,
	Input,
	Option,
	Select as SelectTS,
} from '@prisma/client';
import SelectOptions from './SelectOptions';

const SelectView = ({
	select,
	selectIndex,
	deleteFromForm,
	forms,
	setForms,
	index,
	numberOfOptions,
	loading,
	setLoading,
}: {
	select: SelectTS & { options: Option[] };
	selectIndex: number;
	deleteFromForm: (type: string, id: string) => {};
	forms: (Form & {
		inputs: Input[];
		selects: (SelectTS & { options: Option[] })[];
		checkboxes: CheckBox[];
	})[];
	setForms: React.Dispatch<
		React.SetStateAction<
			(Form & {
				inputs: Input[];
				selects: (SelectTS & { options: Option[] })[];
				checkboxes: CheckBox[];
			})[]
		>
	>;
	index: number;
	numberOfOptions: number;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { palette } = useTheme();
	const [open, setOpen] = useState<boolean>(false);

	return (
		<div
			key={select.id}
			className={styles.inputEdit}
			style={{
				border: `2px solid ${palette.primary.main}`,
			}}>
			<div
				className={styles.delete}
				onClick={() => {
					deleteFromForm('select', select.id);
				}}>
				<DeleteForeverIcon color='error' />
			</div>
			Select
			<div className={styles.options}>
				<div className={styles.option}>
					<div
						style={{
							fontWeight: 'bold',
							marginTop: 'auto',
						}}>
						Order
					</div>
					<div>
						<Select
							value={forms[index].selects[selectIndex].order}
							size='small'
							onChange={(event) =>
								setForms((prev) => {
									let updatedList = prev;
									updatedList[index].selects[
										selectIndex
									].order = parseInt(`${event.target.value}`);
									return [...updatedList];
								})
							}>
							{Array.from(Array(numberOfOptions).keys()).map(
								(num: number, index: number) => (
									<MenuItem key={index} value={num}>
										{num}
									</MenuItem>
								)
							)}
						</Select>
					</div>
				</div>
				<div className={styles.option}>
					<span
						style={{
							fontWeight: 'bold',
							marginTop: 'auto',
						}}>
						Label
					</span>
					<span>
						<TextField
							size='small'
							value={forms[index].selects[selectIndex]?.label}
							onChange={(event) =>
								setForms((prev) => {
									let updatedList = prev;
									updatedList[index].selects[
										selectIndex
									].label = event.target.value;
									return [...updatedList];
								})
							}
						/>
					</span>
				</div>
				<div className={styles.option}>
					<span
						style={{
							fontWeight: 'bold',
							marginTop: 'auto',
						}}>
						Options
					</span>
					<span>
						<Button
							variant='contained'
							onClick={() => setOpen(true)}>
							Options
						</Button>
						{open && (
							<SelectOptions
								setLoading={setLoading}
								index={index}
								forms={forms}
								loading={loading}
								select={select}
								selectIndex={selectIndex}
								setForms={setForms}
								close={() => setOpen(false)}
							/>
						)}
					</span>
				</div>
				<div className={styles.option}>
					<span
						style={{
							fontWeight: 'bold',
							marginTop: 'auto',
						}}>
						Required
					</span>
					<span>
						<Switch
							checked={
								forms[index].selects[selectIndex]?.required
							}
							onChange={() =>
								setForms((prev) => {
									let updatedList = prev;
									updatedList[index].selects[
										selectIndex
									].required =
										!updatedList[index].selects[selectIndex]
											.required;
									return [...updatedList];
								})
							}
						/>
					</span>
				</div>
			</div>
		</div>
	);
};

export default SelectView;
