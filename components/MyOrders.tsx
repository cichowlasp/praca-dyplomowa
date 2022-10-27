import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Loading from './Loading';
import PinInput from 'react-pin-input';

const MyOrders = () => {
	const { data: sesstion, status } = useSession();

	const handleComplete = (pin: string) => {
		signOut({ redirect: false });
		signIn('credentials', { redirect: false, pin });
	};

	if (status === 'loading') return <Loading />;
	if (status === 'unauthenticated' || !sesstion?.user?.pin)
		return (
			<>
				<h1>To see your orders you need to type in your access pin</h1>
				<PinInput
					length={6}
					initialValue=''
					secret
					type='numeric'
					inputMode='number'
					style={{ padding: '10px' }}
					inputStyle={{
						borderColor: 'black',
						borderRadius: '10px',
						borderWidth: '3px',
					}}
					inputFocusStyle={{
						borderColor: 'blue',
						borderRadius: '10px',
						borderWidth: '3px',
					}}
					onComplete={(pin) => handleComplete(pin)}
					autoSelect={true}
				/>
			</>
		);
	return <h1>MyOrders</h1>;
};

export default MyOrders;
