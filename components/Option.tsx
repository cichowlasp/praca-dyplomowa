import React, { useState } from 'react';
import {
	TextField,
	Button,
	Switch,
	Select,
	MenuItem,
	useTheme,
} from '@mui/material';
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
	const [next, setNext] = useState(inp.formType === 'NEXT' ? true : false);
	const [pop, setPop] = useState(inp.formType === 'POPUP' ? true : false);
	const [value, setValue] = useState<String | null>('');
	const { palette } = useTheme();

	return (
		<div
			key={inp.id}
			style={{
				padding: '5px',
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				border: '2px solid ' + palette.primary.main,
				borderRadius: '0.5rem',
				marginBottom: '0.5rem',
			}}>
			<div>
				<TextField
					size='small'
					placeholder='option'
					value={
						forms[index].selects[selectIndex]?.options[inpIndex]
							.value
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
								options =
									data[index].selects[selectIndex].options;
							});
						setLoading(false);
						setForms((prev) => {
							let updatedList = prev;
							updatedList[index].selects[selectIndex].options =
								updatedList[index].selects[
									selectIndex
								].options = options;

							return [...updatedList];
						});
					}}>
					<DeleteIcon />
				</Button>
			</div>
			<div style={{ display: 'flex' }}>
				<span
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						marginLeft: '0.5rem',
					}}>
					Next Form
					<Switch
						checked={next}
						inputProps={{ role: 'switch' }}
						onChange={async () => {
							setNext((pre) => {
								return !pre;
							});
							if (next !== true) {
								setPop(false);
							}
							if (next !== false) {
								setLoading(true);
								setValue(null);
								await fetch('/api/admin/addconnectedform', {
									method: 'POST',
									body: JSON.stringify({
										...inp,
										formType: null,
										formId: null,
									}),
								});
								setLoading(false);
							}
						}}
					/>
				</span>
				<span
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						marginLeft: '0.5rem',
					}}>
					Popup Form
					<Switch
						checked={pop}
						inputProps={{ role: 'switch' }}
						onChange={async () => {
							setPop((pre) => {
								return !pre;
							});
							if (pop !== true) {
								setNext(false);
							}
							if (pop !== false) {
								setLoading(true);
								setValue(null);
								await fetch('/api/admin/addconnectedform', {
									method: 'POST',
									body: JSON.stringify({
										...inp,
										formType: null,
										formId: null,
									}),
								});
								setLoading(false);
							}
						}}
					/>
				</span>
			</div>

			{next && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						marginLeft: '0.5rem',
					}}>
					Next Form
					<Select
						size='small'
						defaultValue={
							inp?.formType === 'NEXT' ? inp?.formId : null
						}
						onChange={async (event) => {
							setLoading(true);
							setValue(event.target.value);
							await fetch('/api/admin/addconnectedform', {
								method: 'POST',
								body: JSON.stringify({
									...inp,
									formType: 'NEXT',
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
			{pop && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						marginLeft: '0.5rem',
					}}>
					Popup Form
					<Select
						size='small'
						defaultValue={
							inp?.formType === 'POPUP' ? inp?.formId : null
						}
						onChange={async (event) => {
							setLoading(true);
							setValue(event.target.value);
							await fetch('/api/admin/addconnectedform', {
								method: 'POST',
								body: JSON.stringify({
									...inp,
									formType: 'POPUP',
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
