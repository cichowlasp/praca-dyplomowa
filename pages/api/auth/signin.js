import { getCsrfToken } from 'next-auth/react';
import { Button, TextField } from '@mui/material';

const SignIn = ({ csrfToken }) => {
	return (
		<form method='post' action='/api/auth/callback/credentials'>
			{/* <TextField
				variant='outlined'
				name={csrfToken}
				type='hidden'
				defaultValue={csrfToken}
			/>
			<label>
				Username
				<input name='username' type='text' />
			</label>
			<label>
				Password
				<TextField variant='outlined' name='password' type='password' />
			</label>
			<Button type='submit'>Sign in</Button> */}
		</form>
	);
};

export async function getServerSideProps(context) {
	return {
		props: {
			csrfToken: await getCsrfToken(context),
		},
	};
}
export default SignIn;
