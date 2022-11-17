import React, { Dispatch, SetStateAction, useState } from 'react';
import { Paper, TextField, Button, CircularProgress } from '@mui/material';
import styles from '../styles/Edit.module.css';
import CancelIcon from '@mui/icons-material/Cancel';
import { validForm } from '../utils/validationSchema';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment, { Moment } from 'moment';
import { Reviewed } from './OrderCard';
import { Info, Order, User, Message } from '@prisma/client';

type Props = {
	order: Order & { informations: Info[] };
	setEditView: React.Dispatch<React.SetStateAction<boolean>>;
	updateData: () => {};
	reorder: boolean;
	date?: boolean;
	realizationDate: Moment | null;
	setRealizationDate: React.Dispatch<React.SetStateAction<Moment | null>>;
	updateOrder: (data: {
		data: {
			reviewed: Reviewed;
			realizationDate?: moment.Moment | null | undefined;
		};
		orderId: string;
	}) => Promise<void>;
	setOrders: Dispatch<
		SetStateAction<
			(Order & { informations: Info[]; messages: Message[] })[]
		>
	>;
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
	setOrders,
}: Props) => {
	const [editedInfo, setEditedInfo] = useState<Info[]>(order.informations);
	const [loading, setLoading] = useState<boolean>(false);
	const [errorMessage, setError] = useState<string>('');

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
					}}
					elevation={3}>
					<h3 style={{ textAlign: 'center' }}>
						Choose realization date
					</h3>
					<DatePicker
						minDate={moment()}
						label='Realization Date'
						value={realizationDate}
						onChange={(newValue: Moment | null) => {
							setRealizationDate(newValue);
						}}
						renderInput={(params) => <TextField {...params} />}
					/>
					<div style={{ height: '20px' }} />
					<Button
						disabled={loading}
						onClick={async () => {
							setLoading(true);
							await updateOrder({
								data: {
									reviewed: Reviewed.approved,
									realizationDate,
								},
								orderId: order.id,
							});

							await fetch('/api/admin/getalldata')
								.then((response) => response.json())
								.then((data) =>
									setOrders(
										data
											.map(
												(
													el: User & {
														orders: Order[];
													}
												) => el.orders
											)
											.flat(1)
									)
								);
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
