import { Order, User } from '@prisma/client';
import NextAuth from 'next-auth';

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user?: {
			id: string;
			name?: string;
			surname?: string;
			email: string;
			pin?: string;
			password: string;
			admin: boolean;
			company?: string;
			orders: Order[];
		};
		company?: {
			id: string;
			companyName: string;
			nip: string;
			companyEmail: string;
			companyAddress: string;
			phoneNumber: string;
			createUserPin: string;
			users: User[];
		};
	}
}
