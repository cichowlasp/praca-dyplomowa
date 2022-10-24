import React, { PropsWithChildren } from 'react';

import { useSession } from 'next-auth/react';

const Auth: React.FC<PropsWithChildren> = ({ children }) => {
	// if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
	const { status } = useSession({ required: true });

	if (status === 'loading') {
		return <div>Loading...</div>;
	}

	return <>{children}</>;
};

export default Auth;
