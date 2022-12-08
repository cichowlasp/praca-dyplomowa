import React, { useState, useEffect, useRef } from 'react';
import {
	useTheme,
	Menu,
	MenuItem,
	MenuProps,
	styled,
	alpha,
	CircularProgress,
	TextField,
	Button,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import styles from '../styles/OrderCard.module.css';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MessageIcon from '@mui/icons-material/Message';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Edit from './Edit';
import SendIcon from '@mui/icons-material/Send';
import { Moment } from 'moment';
import { Order, Info, Message, User, Company } from '@prisma/client';
import Loading from './Loading';
import AdditionalForm from './AdditionalForm';
import AddFormView from './AddFormView';

export enum Reviewed {
	approved = 'APPROVED',
	decline = 'DECLINE',
	notReviewed = 'NOTREVIEWED',
	completed = 'COMPLETED',
}

const OrderCard = ({
	order,
	updateData,
	user,
	index,
	admin,
}: {
	order: Order & { informations: Info[]; messages: Message[] };
	updateData: (
		localLoading?: React.Dispatch<React.SetStateAction<boolean>>
	) => {};

	index: number;
	admin: boolean;
	user?: User;
}) => {
	const { palette } = useTheme();
	const [loading, setLoading] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [editView, setEditView] = useState<boolean>(false);
	const [date, setDate] = useState<boolean>(false);
	const [reorderView, setReorderView] = useState<boolean>(false);
	const [expanded, setExpanded] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');
	const [messages, setMessages] = useState<Message[]>([]);
	const [realizationDate, setRealizationDate] = useState<{
		realizationDateStart: Moment | null;
		realizationDateEnd: Moment | null;
	}>({ realizationDateStart: null, realizationDateEnd: null });
	const [completeView, setCompleteView] = useState(false);
	const [completeDate, setCompleteDate] = useState<Moment | null>(null);
	const [additionalFormView, setAdditionalFormView] = useState(false);
	const open = Boolean(anchorEl);
	const { data: session } = useSession();
	const [formView, setFormView] = useState(false);

	const messageField = useRef(null);
	useEffect(() => {
		setMessages(order.messages);
	}, [order.messages, setMessages]);

	const bottomRef = useRef<null | HTMLDivElement>(null);

	if (session === null || session === undefined) {
		return <Loading />;
	}
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
		{ id }: { id: string }
	) => {
		setLoading(true);
		event.preventDefault();
		await fetch('/api/user/sendmessage', {
			method: 'POST',
			body: JSON.stringify({
				orderId: id,
				message,
			}),
		}).then((response) => {
			if (response.status === 200) {
				setMessages((prev) => [
					...prev,
					{
						id,
						date: new Date(),
						message,
						name: `${
							session.user?.name
						} ${session.user?.surname?.substring(0, 1)}`,
						orderId: id,
						from: session.user?.admin ? 'ADMIN' : 'USER',
					},
				]);
			}
		});
		bottomRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
			inline: 'start',
		});
		setMessage('');
		setLoading(false);
	};

	const updateOrder = async (data: {
		data:
			| {
					reviewed: Reviewed;
					realizationDate?: {
						realizationDateStart: Moment | null;
						realizationDateEnd: Moment | null;
					};
			  }
			| { reviewed: Reviewed; completedAt: Moment | null };
		orderId: string;
	}) => {
		await fetch('/api/admin/orderupdate', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	};

	const handleClose = async () => {
		setAnchorEl(null);
	};

	const deleteOrder = async (id: string) => {
		setLoading(true);
		await fetch('/api/user/deleteorder', {
			method: 'POST',
			body: id,
		});

		await updateData(setLoading);

		setLoading(false);
		handleClose();
	};

	const openForm = () => {
		console.log(formView);
		setFormView(true);
	};
	const closeForm = () => {
		setFormView(false);
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu elevation={0} {...props} />
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 180,
			color:
				theme.palette.mode === 'light'
					? 'rgb(55, 65, 81)'
					: theme.palette.grey[300],
			boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px;',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 25,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(
						theme.palette.primary.main,
						theme.palette.action.selectedOpacity
					),
				},
			},
		},
	}));

	return (
		<div className={styles.cardWrapper}>
			<div
				className={styles.card}
				style={{
					border: `2px solid ${palette.primary.main}`,
					backgroundColor:
						order.reviewed === 'APPROVED'
							? 'rgba(40, 255, 0, 0.3)'
							: order.reviewed === 'NOTREVIEWED'
							? 'rgba(0, 0, 0, 0.0)'
							: order.reviewed === 'DECLINE'
							? 'rgba(255, 0, 0, 0.3)'
							: order.reviewed === 'COMPLETED'
							? 'rgba(25, 118, 210, 0.3'
							: '',
					height: expanded ? 'fit-content' : '8rem',
					marginTop: session.user?.admin ? '0' : '1rem',
					marginBottom: session.user?.admin ? '1rem' : '0',
				}}
				key={index}>
				<div
					style={{
						width: '20rem',
						height: '100%',
						overflow: 'hidden',
					}}>
					{order.reviewed === 'COMPLETED' && (
						<div className={styles.orderTitle}>
							completed at:{' '}
							{new Date(
								order?.completedAt
									? order?.completedAt
									: Date.now()
							).toLocaleDateString('en-GB')}
						</div>
					)}
					{order.reviewed === 'APPROVED' && (
						<div className={styles.orderTitle}>
							Approved, realization date:
							<div>
								{new Date(
									order?.realizationDateStart
										? order?.realizationDateStart
										: Date.now()
								).toLocaleDateString('en-GB')}
								{' - '}
								{new Date(
									order?.realizationDateEnd
										? order?.realizationDateEnd
										: Date.now()
								).toLocaleDateString('en-GB')}
							</div>
						</div>
					)}
					{order.reviewed === 'NOTREVIEWED' && (
						<div className={styles.orderTitle}>Awaiting review</div>
					)}
					{order.reviewed === 'DECLINE' && (
						<div className={styles.orderTitle}>
							Not approved {':('}
						</div>
					)}

					<div style={{ maxHeight: '100%', overflow: 'hidden' }}>
						{user ? (
							<>
								<div>
									<span
										style={{
											fontWeight: 'bold',
											textAlign: 'left',
										}}>
										Name:
									</span>
									<span
										style={{
											paddingLeft: '3px',
										}}>
										{`${user.name} ${user.surname}`}
									</span>
								</div>
								<div>
									<span
										style={{
											fontWeight: 'bold',
											textAlign: 'left',
										}}>
										Email:
									</span>
									<span
										style={{
											paddingLeft: '3px',
										}}>
										{`${user.email}`}
									</span>
								</div>
								<div>
									<span
										style={{
											fontWeight: 'bold',
											textAlign: 'left',
										}}>
										Phone:
									</span>
									<span
										style={{
											paddingLeft: '3px',
										}}>
										{`${user.phoneNumber}`}
									</span>
								</div>
							</>
						) : (
							<></>
						)}
						<div>
							<span
								style={{
									fontWeight: 'bold',
									textAlign: 'left',
								}}>
								Edited:
							</span>
							<span
								style={{
									paddingLeft: '3px',
								}}>
								{order.edited ? 'Yes' : 'No'}
							</span>
						</div>
						{order.informations.map((el: Info) => {
							return (
								<div key={el.id}>
									<span
										style={{
											fontWeight: 'bold',
											textAlign: 'left',
										}}>
										{el.name}:
									</span>
									<span
										style={{
											paddingLeft: '3px',
										}}>
										{el.fill}
									</span>
								</div>
							);
						})}
					</div>

					<div className={styles.messages}>
						<div
							style={{
								visibility:
									messages.length === 0
										? 'hidden'
										: 'visible',
							}}
							className={styles.chat}>
							{messages?.map((el) => (
								<div style={{ width: '100%' }} key={el.id}>
									<div
										style={{
											marginLeft:
												(el.from === 'USER' &&
													!session.user?.admin) ||
												(el.from === 'ADMIN' &&
													session.user?.admin)
													? 'auto'
													: '',
											marginRight:
												(el.from === 'USER' &&
													!session.user?.admin) ||
												(el.from === 'ADMIN' &&
													session.user?.admin)
													? ''
													: 'auto',
										}}
										className={styles.container}>
										<div className={styles.date}>
											{new Date(el.date).toLocaleString(
												'en-US',
												{
													dateStyle: 'short',
													hour12: false,
													timeStyle: 'short',
												}
											)}
										</div>
										<div
											style={{
												textAlign:
													(el.from === 'USER' &&
														!session.user?.admin) ||
													(el.from === 'ADMIN' &&
														session.user?.admin)
														? 'right'
														: 'left',
											}}
											className={styles.name}>
											{el.name}
										</div>
										<div
											style={{
												textAlign:
													(el.from === 'USER' &&
														!session.user?.admin) ||
													(el.from === 'ADMIN' &&
														session.user?.admin)
														? 'right'
														: 'left',
											}}
											className={styles.text}>
											{el.message}
										</div>
									</div>
								</div>
							))}
							<div ref={bottomRef} />
						</div>
						<form onSubmit={(event) => handleSubmit(event, order)}>
							<TextField
								ref={messageField}
								placeholder='Message'
								size='small'
								multiline={true}
								fullWidth={true}
								style={{
									backgroundColor: 'white',
								}}
								value={message}
								onChange={(event) =>
									setMessage(event.target.value)
								}
							/>
							<Button
								variant='contained'
								size='small'
								disabled={
									loading || message.trim().length === 0
								}
								style={{
									maxWidth: '40px',
									maxHeight: '40px',
									minWidth: '40px',
									minHeight: '40px',
									marginLeft: '10px',
								}}
								type='submit'>
								<SendIcon style={{ paddingLeft: '3px' }} />
							</Button>
						</form>
					</div>
					{order.formId && session.user?.pin && (
						<Button
							sx={{ justifySelf: 'center' }}
							onClick={() => openForm()}>
							Fill aditional info
						</Button>
					)}
				</div>

				<div
					className={styles.expand}
					onClick={() => setExpanded((prev) => !prev)}
					style={{
						transform: `rotate(${expanded ? '180deg' : 0})`,
					}}>
					<ExpandMoreIcon fontSize='large' />
				</div>

				<div onClick={handleClick} className={styles.moreicon}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 128 512'>
						<path d='M64 360c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm0-160c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zM120 96c0 30.9-25.1 56-56 56S8 126.9 8 96S33.1 40 64 40s56 25.1 56 56z' />
					</svg>
				</div>
				{messages.length !== 0 ? (
					messages.at(-1)?.name !==
					`${session.user?.name} ${session.user?.surname?.substring(
						0,
						1
					)}` ? (
						<div className={styles.dot} />
					) : (
						<></>
					)
				) : (
					<></>
				)}
				{!admin ? (
					<StyledMenu
						id='basic-menu'
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						style={{}}>
						{loading ? (
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									width: '100%',
									height: '100%',
								}}>
								<CircularProgress />
							</div>
						) : (
							<div>
								<MenuItem
									style={{ maxHeight: '2rem' }}
									onClick={() => deleteOrder(order.id)}>
									<DeleteForeverIcon fontSize='large' />
									Delete
								</MenuItem>
								<MenuItem
									style={{ maxHeight: '2rem' }}
									onClick={() => {
										setReorderView(false);
										setEditView(true);
										handleClose();
									}}>
									<EditIcon fontSize='large' />
									Edit
								</MenuItem>
								<MenuItem
									style={{ maxHeight: '2rem' }}
									onClick={() => {
										setReorderView(true);
										setEditView(true);
										handleClose();
									}}>
									<RefreshIcon fontSize='large' />
									Reorder
								</MenuItem>
								<MenuItem
									style={{ maxHeight: '2rem' }}
									onClick={() => {
										setExpanded((pre) => !pre);
										handleClose();
									}}>
									<MessageIcon fontSize='large' />
									Respond
								</MenuItem>
							</div>
						)}
					</StyledMenu>
				) : (
					<StyledMenu
						id='basic-menu'
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						style={{}}>
						{loading ? (
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									width: '100%',
									height: '100%',
								}}>
								<CircularProgress />
							</div>
						) : (
							<div>
								<MenuItem
									style={{ maxHeight: '2rem' }}
									onClick={async () => {
										setAdditionalFormView(true);
										handleClose();
									}}>
									<TextFieldsIcon fontSize='large' />
									Additional form
								</MenuItem>
								<MenuItem
									style={{ maxHeight: '2rem' }}
									onClick={async () => {
										setLoading(true);
										setCompleteView(true);
										setLoading(false);
										handleClose();
										setEditView(true);
									}}>
									<SportsScoreIcon fontSize='large' />
									Complete
								</MenuItem>
								<MenuItem
									style={{ maxHeight: '2rem' }}
									onClick={async () => {
										setLoading(true);
										setDate(true);
										setLoading(false);
										handleClose();
										setEditView(true);
									}}>
									<CheckIcon fontSize='large' />
									Approve
								</MenuItem>
								<MenuItem
									style={{ maxHeight: '2rem' }}
									onClick={async () => {
										setLoading(true);
										await updateOrder({
											data: {
												reviewed: Reviewed.decline,
											},
											orderId: order.id,
										});
										setLoading(false);
										await updateData(setLoading);
										handleClose();
									}}>
									<CloseIcon fontSize='large' />
									Decline
								</MenuItem>
								<MenuItem
									style={{ maxHeight: '2rem' }}
									onClick={() => {
										setExpanded((pre) => !pre);
										handleClose();
									}}>
									<MessageIcon fontSize='large' />
									Respond
								</MenuItem>
								<MenuItem
									style={{ maxHeight: '2rem' }}
									onClick={() => deleteOrder(order.id)}>
									<DeleteForeverIcon fontSize='large' />
									Delete
								</MenuItem>
							</div>
						)}
					</StyledMenu>
				)}
			</div>
			{editView && (
				<Edit
					order={order}
					setEditView={setEditView}
					updateData={updateData}
					reorder={reorderView}
					setRealizationDate={setRealizationDate}
					realizationDate={realizationDate}
					date={date}
					updateOrder={updateOrder}
					setCompleteView={setCompleteView}
					setCompleteDate={setCompleteDate}
					completeView={completeView}
					completeDate={completeDate}
				/>
			)}
			{additionalFormView && (
				<AdditionalForm
					setAdditionalFormView={setAdditionalFormView}
					order={order}
				/>
			)}
			{formView && (
				<AddFormView
					closeForm={closeForm}
					order={order}
					updateData={updateData}
				/>
			)}
		</div>
	);
};

export default OrderCard;
