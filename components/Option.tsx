import React, { useState } from 'react';
import { TextField, Button, Switch, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Option,
	Form,
	Input,
	Select as SelectTS,
	CheckBox,
} from '@prisma/client';

const Option = ({
	inp,
	forms,
	index,
	selectIndex,
	inpIndex,
	loading,
	setLoading,
	setForms,
}: {
	inp: Option;
	forms: (Form & {
		inputs: Input[];
		selects: (SelectTS & { options: Option[] })[];
		checkboxes: CheckBox[];
	})[];
	index: number;
	selectIndex: number;
	inpIndex: number;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setForms: React.Dispatch<
		React.SetStateAction<
			(Form & {
				inputs: Input[];
				selects: (SelectTS & { options: Option[] })[];
				checkboxes: CheckBox[];
			})[]
		>
	>;
}) => {
	const [connect, setConnect] = useState(false);
	const [value, setValue] = useState<String | null>('');

	return (
		<div
			key={inp.id}
			style={{
				padding: '5px',
				display: 'flex',
				alignItems: 'center',
			}}>
			<TextField
				size='small'
				placeholder='option'
				value={
					forms[index].selects[selectIndex]?.options[inpIndex].value
				}
				onChange={(event) =>
					setForms((prev) => {
						let updatedList = prev;
						updatedList[index].selects[selectIndex].options[
							inpIndex
						].value = event.target.value;
						return [...updatedList];
					})
				}
			/>
			<Button
				color='error'
				variant='contained'
				disabled={loading}
				style={{
					marginLeft: '5px',
				}}
				onClick={async () => {
					let options: Option[];
					setLoading(true);
					await fetch('/api/admin/removeoption', {
						method: 'POST',
						body: inp.id,
					});

					await fetch('/api/admin/getforms')
						.then((response) => response.json())
						.then((data) => {
							options = data[index].selects[selectIndex].options;
						});
					setLoading(false);
					setForms((prev) => {
						let updatedList = prev;
						updatedList[index].selects[selectIndex].options =
							updatedList[index].selects[selectIndex].options =
								options;

						return [...updatedList];
					});
				}}>
				<DeleteIcon />
			</Button>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					marginLeft: '0.5rem',
				}}>
				Connect Form
				<Switch
					checked={connect}
					onChange={async () => {
						setConnect((pre) => {
							if (!pre === false) {
								setLoading(true);
								setValue(null);
								fetch('/api/admin/addconnectedform', {
									method: 'POST',
									body: JSON.stringify({
										...inp,
										formId: null,
									}),
								});
								setLoading(false);
							}
							return !pre;
						});
					}}
				/>
			</div>
			{connect && (
				<div style={{ marginLeft: '0.5rem' }}>
					<Select
						value={value}
						onChange={async (event) => {
							setLoading(true);
							setValue(event.target.value);
							await fetch('/api/admin/addconnectedform', {
								method: 'POST',
								body: JSON.stringify({
									...inp,
									formId: event.target.value,
								}),
							});
							setLoading(false);
						}}
						sx={{ width: '200px' }}>
						{forms
							.filter((form: Form) => form.active === false)
							.map((form: Form) => {
								return (
									<MenuItem key={form.id} value={form.id}>
										{form.name}
									</MenuItem>
								);
							})}
					</Select>
				</div>
			)}
		</div>
	);
};

export default Option;
