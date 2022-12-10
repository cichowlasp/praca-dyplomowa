import React, { Dispatch, SetStateAction, useState } from 'react';
import { Paper, TextField, Button, CircularProgress } from '@mui/material';
import styles from '../styles/Edit.module.css';
import CancelIcon from '@mui/icons-material/Cancel';
import { validForm } from '../utils/validationSchema';
import { MobileDatePicker } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';
import { Reviewed } from './OrderCard';
import { Info, Order, User, Message } from '@prisma/client';
import { useSession } from 'next-auth/react';

type Props = {
	order: Order & { informations: Info[] };
	setEditView: React.Dispatch<React.SetStateAction<boolean>>;
	updateData: (
		loaclLoading?: React.Dispatch<React.SetStateAction<boolean>>
	) => {};
	reorder: boolean;
	date?: boolean;
	realizationDate: {
		realizationDateStart: Moment | null;
		realizationDateEnd: Moment | null;
	};
	setRealizationDate: React.Dispatch<
		React.SetStateAction<{
			realizationDateStart: Moment | null;
			realizationDateEnd: Moment | null;
		}>
	>;
	updateOrder: (data: {
		data:
			| {
					reviewed: Reviewed;
					realizationDate?: {
						realizationDateStart: Moment | null;
						realizationDateEnd: Moment | null;
					};
					approvedBy: string;
			  }
			| {
					reviewed: Reviewed;
					completedAt: Moment | null;
					approvedBy: string;
			  };
		orderId: string;
	}) => Promise<void>;
	setCompleteView: React.Dispatch<React.SetStateAction<boolean>>;
	setCompleteDate: React.Dispatch<React.SetStateAction<Moment | null>>;
	completeView: boolean;
	completeDate: Moment | null;
};

const Edit = ({
	order,
	setEditView,
	updateData,
	reorder,
	setRealizationDate,
	date,
	realizationDate,
	updateOrder,
	setCompleteView,
	setCompleteDate,
	completeDate,
	completeView,
}: Props) => {
	const [editedInfo, setEditedInfo] = useState<Info[]>(order.informations);
	const [loading, setLoading] = useState<boolean>(false);
	const [errorMessage, setError] = useState<string>('');
	const { data: session } = useSession();

	const handleSubmit = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		setError('');
		const error = validForm(editedInfo);
		if (error) {
			setError(error);
			return;
		}
		setLoading(true);
		if (reorder) {
			const data = editedInfo.map(
				(el: { name: string; fill: string }) => {
					return { name: el.name, fill: el.fill };
				}
			);
			await fetch('/api/user/neworder', {
				method: 'POST',
				body: JSON.stringify(data),
			}).then((response) => {
				if (response.status === 200) {
					setEditView(false);
				}
			});
		} else {
			await fetch('/api/user/updateorder', {
				method: 'POST',
				body: JSON.stringify(editedInfo),
			});
		}
		await updateData();
		setLoading(false);
		setEditView(false);
	};

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		index: number
	) => {
		setEditedInfo((prev: Info[]) => {
			let formData: Info[] = prev;
			formData[index] = {
				...formData[index],
				fill: event.target.value.trim(),
			};

			return formData;
		});
	};

	if (completeView) {
		return (
			<div className={styles.dateContainer}>
				<Paper
					style={{
						position: 'relative',
						height: 'fit-content',
						width: 'fit-content',
						padding: '20px',
						display: 'flex',
						flexDirection: 'column',
						alignContent: 'center',
						overflowY: 'auto',
					}}
					elevation={3}>
					<h3 style={{ textAlign: 'center' }}>
						Choose completed date
					</h3>
					<div
						style={{
							display: 'flex',
							maxWidth: '350px',
							gap: '10px',
						}}>
						<span>
							<MobileDatePicker
								label='Date'
								value={completeDate}
								onChange={(newValue: Moment | null) =>
									setCompleteDate(newValue)
								}
								renderInput={(params) => (
									<TextField {...params} />
								)}
							/>
						</span>
					</div>

					<div style={{ height: '20px' }} />
					<Button
						disabled={loading}
						onClick={async () => {
							setLoading(true);
							await updateOrder({
								data: {
									reviewed: Reviewed.completed,
									completedAt: completeDate,
									approvedBy: `${session?.user?.name} ${session?.user?.surname}`,
								},
								orderId: order.id,
							});

							await fetch('/api/admin/getalldata')
								.then((response) => response.json())
								.then(() => updateData(setLoading));
							setEditView(false);
						}}
						variant='contained'>
						Set date
					</Button>
					<CancelIcon
						style={{
							position: 'absolute',
							top: '10px',
							right: '10px',
							cursor: 'pointer',
						}}
						fontSize='medium'
						onClick={async () => {
							setEditView(false);
						}}
					/>
				</Paper>
			</div>
		);
	}

	if (date) {
		return (
			<div className={styles.dateContainer}>
				<Paper
					style={{
						position: 'relative',
						height: 'fit-content',
						width: 'fit-content',
						padding: '20px',
						display: 'flex',
						flexDirection: 'column',
						alignContent: 'center',
						overflowY: 'auto',
					}}
					elevation={3}>
					<h3 style={{ textAlign: 'center' }}>
						Choose realization date
					</h3>
					<div
						style={{
							display: 'flex',
							maxWidth: '350px',
							gap: '10px',
						}}>
						<span>
							<MobileDatePicker
								minDate={moment(new Date())}
								label='Start Date'
								value={realizationDate?.realizationDateStart}
								onChange={(newValue: Moment | null) => {
									setRealizationDate((pre) => {
										return {
											...pre,
											realizationDateStart: newValue,
										};
									});
								}}
								renderInput={(params) => (
									<TextField {...params} />
								)}
							/>
						</span>
						<span>
							<MobileDatePicker
								minDate={
									realizationDate.realizationDateStart
										? moment(
												realizationDate.realizationDateStart
										  ).add(1, 'd')
										: moment().add(1, 'd')
								}
								label='End Date'
								value={realizationDate?.realizationDateEnd}
								componentsProps={{}}
								onChange={(newValue: Moment | null) => {
									setRealizationDate((pre) => {
										return {
											...pre,
											realizationDateEnd: newValue,
										};
									});
								}}
								renderInput={(params) => (
									<TextField {...params} />
								)}
							/>
						</span>
					</div>

					<div style={{ height: '20px' }} />
					<Button
						disabled={loading}
						onClick={async () => {
							setLoading(true);
							await updateOrder({
								data: {
									reviewed: Reviewed.approved,
									realizationDate,
									approvedBy: `${session?.user?.name} ${session?.user?.surname}`,
								},
								orderId: order.id,
							});

							await fetch('/api/admin/getalldata')
								.then((response) => response.json())
								.then(() => updateData(setLoading));
							setEditView(false);
						}}
						variant='contained'>
						Set date
					</Button>
					<CancelIcon
						style={{
							position: 'absolute',
							top: '10px',
							right: '10px',
							cursor: 'pointer',
						}}
						fontSize='medium'
						onClick={async () => {
							setEditView(false);
						}}
					/>
				</Paper>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<Paper
				style={{
					position: 'relative',
					height: '90%',
					width: '90%',
					padding: '20px',
					display: 'flex',
					flexDirection: 'column',
					alignContent: 'center',
					overflowY: 'auto',
				}}
				elevation={3}>
				<h1 style={{ textAlign: 'center' }}>
					{reorder ? 'Reorder' : 'Order editing'}
				</h1>
				<CancelIcon
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',
						cursor: 'pointer',
					}}
					fontSize='large'
					onClick={async () => {
						await updateData();
						setEditView(false);
					}}
				/>
				<form
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
					onSubmit={(event) => handleSubmit(event)}>
					{order.informations.map((el: Info, index: number) => (
						<div className={styles.input} key={el.name}>
							<div>{el.name}</div>
							<TextField
								defaultValue={el.fill}
								onChange={(event) => handleChange(event, index)}
							/>
						</div>
					))}
					<div className={styles.error}>{errorMessage}</div>
					<Button
						type='submit'
						variant='contained'
						style={{ width: 'fit-content', margin: '0 auto' }}>
						{loading ? (
							<CircularProgress style={{ color: 'white' }} />
						) : reorder ? (
							'Place a new order'
						) : (
							'Update your order'
						)}
					</Button>
				</form>
			</Paper>
		</div>
	);
};

export default Edit;
