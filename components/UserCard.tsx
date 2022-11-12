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
import styles from '../styles/UserCard.module.css';

const UserCard = ({
	user,
	index,
	setUsersData,
}: {
	user: any;
	index: number;
	setUsersData: any;
}) => {
	const { palette } = useTheme();
	const [loading, setLoading] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = async () => {
		setAnchorEl(null);
	};
	const open = Boolean(anchorEl);

	const deleteUser = async (id: string) => {
		setLoading(true);
		await fetch('/api/admin/deleteuser', {
			method: 'POST',
			body: id,
		});
		await fetch('/api/admin/getalldata')
			.then((response) => response.json())
			.then((data) => setUsersData(data));
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
				key={user.id}>
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
						{user.email}
					</span>
				</div>
				<div>
					<span
						style={{
							fontWeight: 'bold',
							textAlign: 'left',
						}}>
						Company:
					</span>
					<span
						style={{
							paddingLeft: '3px',
						}}>
						{user.company}
					</span>
				</div>
				<div>
					<span
						style={{
							fontWeight: 'bold',
							textAlign: 'left',
						}}>
						Pin:
					</span>
					<span
						style={{
							paddingLeft: '3px',
						}}>
						{user.pin}
					</span>
				</div>
				<div onClick={handleClick} className={styles.moreicon}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 128 512'>
						<path d='M64 360c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm0-160c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zM120 96c0 30.9-25.1 56-56 56S8 126.9 8 96S33.1 40 64 40s56 25.1 56 56z' />
					</svg>
				</div>
				{
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
									onClick={() => {
										deleteUser(user.id);
									}}>
									<DeleteForeverIcon fontSize='large' />
									Delete User
								</MenuItem>
							</div>
						)}
					</StyledMenu>
				}
			</div>
		</>
	);
};

export default UserCard;
