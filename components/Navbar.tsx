import React, { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import RefreshIcon from '@mui/icons-material/Refresh';
import Loading from './Loading';
import { AppBar, Toolbar, Typography, MenuItem, Menu } from '@mui/material';
import ShowCompanyId from './ShowCompanyId';
import LockIcon from '@mui/icons-material/Lock';
import HomePageTitle from './HomePageTitle';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';

const Navbar = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(false);
	const [showHome, setShowHome] = useState(false);

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const updatePin = async () => {
		await fetch('/api/company/refreshCreateUserPin');
	};

	const close = () => {
		setShow(false);
	};

	return (
		<AppBar sx={{}} position='static'>
			<Toolbar>
				<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
					Welcome{' '}
					{session === null ? (
						<></>
					) : (
						<>
							{session?.user?.name &&
								`${session?.user?.name} (${
									session.user.admin ? 'Admin' : 'User'
								})`}
							{session?.company?.companyName &&
								`${session?.company?.companyName} (Company)`}
						</>
					)}
				</Typography>
				{session === null && router.pathname === '/admin' && (
					<div>
						<Button
							size='large'
							aria-label='account of current user'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={async () => signIn()}
							variant='outlined'
							color='inherit'>
							SIGNIN
						</Button>
					</div>
				)}
				{session === null &&
					router.pathname !== '/admin' &&
					router.pathname !== '/' && (
						<div>
							<Button
								size='large'
								aria-label='account of current user'
								aria-controls='menu-appbar'
								aria-haspopup='true'
								onClick={async () => router.push('/')}
								variant='outlined'
								color='inherit'>
								HOME
							</Button>
						</div>
					)}
				{(session?.user?.admin || session?.user?.pin) && (
					<div>
						<Button
							size='large'
							aria-label='account of current user'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleMenu}
							variant='outlined'
							color='inherit'>
							Options
						</Button>
						<Menu
							sx={{ minWidth: '5rem' }}
							id='menu-appbar'
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
							open={Boolean(anchorEl)}
							onClose={handleClose}>
							{loading ? (
								<div style={{}}>
									<Loading />
								</div>
							) : (
								<>
									<MenuItem
										onClick={async () => {
											setLoading(true);
											await signOut({ redirect: false });
											handleClose();
											setLoading(false);
										}}>
										<ExitToAppIcon /> {` SIGNOUT`}
									</MenuItem>
									<MenuItem
										onClick={async () => {
											setShowHome(true);
										}}>
										<WysiwygIcon /> {` HOME PAGE TITLE`}
									</MenuItem>
								</>
							)}
						</Menu>
					</div>
				)}
				{session?.company && (
					<div>
						<Button
							size='large'
							aria-label='account of current user'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleMenu}
							variant='outlined'
							color='inherit'>
							Options
						</Button>
						<Menu
							sx={{ minWidth: '5rem' }}
							id='menu-appbar'
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
							open={Boolean(anchorEl)}
							onClose={handleClose}>
							{loading ? (
								<div style={{}}>
									<Loading />
								</div>
							) : (
								<>
									{' '}
									<MenuItem
										onClick={async () => {
											setLoading(true);
											await signOut({ redirect: false });
											handleClose();
											setLoading(false);
										}}>
										<ExitToAppIcon /> {`SIGNOUT`}
									</MenuItem>
									<MenuItem
										onClick={async () => {
											setLoading(true);
											await updatePin();
											await router.reload();
											handleClose();
											setLoading(false);
										}}>
										<RefreshIcon /> {`REFRESH PIN`}
									</MenuItem>
									<MenuItem
										onClick={async () => {
											setShow(true);
											handleClose();
										}}>
										<LockIcon />
										{`Company ID`}
									</MenuItem>
								</>
							)}
						</Menu>
					</div>
				)}
			</Toolbar>
			{show ? <ShowCompanyId close={close} /> : null}
			{showHome ? (
				<HomePageTitle close={() => setShowHome(false)} />
			) : null}
		</AppBar>
	);
};

export default Navbar;
