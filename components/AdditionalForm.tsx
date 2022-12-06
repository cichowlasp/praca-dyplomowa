import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import styles from '../styles/Edit.module.css';
import { Select, MenuItem, Button } from '@mui/material';
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

const AdditionalForm = ({
	setAdditionalFormView,
	order,
}: {
	setAdditionalFormView: React.Dispatch<React.SetStateAction<boolean>>;
	order: Order & { informations: Info[]; messages: Message[] };
}) => {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [forms, setForms] = useState<
		| (Form & {
				selects: (SelectTS & { options: Option[] })[];
				inputs: Input[];
				checkboxes: CheckBox[];
		  })[]
		| []
	>();
	const [formId, setFormId] = useState('');

	useEffect(() => {
		fetch('/api/admin/getforms')
			.then((response) => response.json())
			.then((data) => setForms(data));
	}, []);

	return (
		<div
			style={{ position: 'fixed', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
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
				{session?.user?.admin && !loading ? (
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
								<Select
									size='small'
									defaultValue={
										order?.formId ? order.formId : ''
									}
									onChange={async (event) => {
										setLoading(true);
										setFormId(event.target.value);
										setLoading(false);
									}}
									sx={{ width: '200px' }}>
									{forms
										?.filter(
											(form: Form) =>
												form.active === false
										)
										.map((form: Form) => {
											return (
												<MenuItem
													key={form.id}
													value={form.id}>
													{form.name}
												</MenuItem>
											);
										})}
								</Select>
							</div>
							<Button
								disabled={formId === ''}
								onClick={async () => {
									setLoading(true);
									await fetch('/api/admin/additionalform', {
										method: 'POST',
										body: JSON.stringify({
											orderId: order.id,
											formId: formId,
										}),
									});
									setLoading(false);
									setAdditionalFormView(false);
								}}
								variant='contained'>
								Add form
							</Button>
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
						setAdditionalFormView(false);
					}}
				/>
			</Paper>
		</div>
	);
};

export default AdditionalForm;
