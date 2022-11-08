import React, { useState } from 'react';
import {
	useTheme,
	Menu,
	MenuItem,
	MenuProps,
	styled,
	alpha,
	CircularProgress,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import styles from '../styles/OrderCard.module.css';
import Loading from './Loading';
import Edit from './Edit';

const OrderCard = ({ order, setOrders, index }) => {
	const { palette } = useTheme();
	const [loading, setLoading] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [editView, setEditView] = useState<boolean>(false);
	const [reorderView, setReorderView] = useState<boolean>(false);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const updateData = async () => {
		await fetch('/api/user/getorders')
			.then((response) => response.json())
			.then((data) => setOrders(data));
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
		await updateData();
		setLoading(false);
		handleClose();
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
		<>
			<div
				className={styles.card}
				style={{ border: `2px solid ${palette.primary.main}` }}
				key={index}>
				<div
					style={{
						width: '20rem',
					}}>
					{order.id}
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
							{`${order.edited}`}
						</span>
					</div>
					{order.informations.map((el, index) => {
						return (
							<div key={index}>
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
				<div onClick={handleClick} className={styles.moreicon}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 128 512'>
						<path d='M64 360c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm0-160c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zM120 96c0 30.9-25.1 56-56 56S8 126.9 8 96S33.1 40 64 40s56 25.1 56 56z' />
					</svg>
				</div>
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
						</div>
					)}
				</StyledMenu>
			</div>
			{editView ? (
				<Edit
					order={order}
					setEditView={setEditView}
					updateData={updateData}
					reorder={reorderView}
				/>
			) : (
				<></>
			)}
		</>
	);
};

export default OrderCard;
