import React from 'react';
import {
	useTheme,
	Menu,
	MenuItem,
	MenuProps,
	styled,
	alpha,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import styles from '../styles/OrderCard.module.css';

const OrderCards = ({ orders, setOrders }) => {
	const { palette } = useTheme();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = async () => {
		setAnchorEl(null);
	};

	const deleteOrder = async (id: string) => {
		await fetch('/api/user/deleteorder', {
			method: 'POST',
			body: id,
		});
		await fetch('/api/user/getorders')
			.then((response) => response.json())
			.then((data) => setOrders(data));
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
			{orders.map((order, index) => {
				return (
					<div
						className={styles.card}
						style={{ border: `2px solid ${palette.primary.main}` }}
						key={index}>
						<div
							style={{
								width: '20rem',
							}}>
							{order.id}
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
							style={{
								boxShadow: 'none',
							}}>
							<MenuItem onClick={() => deleteOrder(order.id)}>
								<DeleteForeverIcon fontSize='large' />
								Delete
							</MenuItem>
						</StyledMenu>
					</div>
				);
			})}
		</>
	);
};

export default OrderCards;
