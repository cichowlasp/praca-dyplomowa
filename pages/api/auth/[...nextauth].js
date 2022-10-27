import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../lib/prisma';

export const authOptions = {
	// Configure one or more authentication providers
	secret: process.env.SECRET,
	session: {
		strategy: 'jwt',
	},
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: 'Credentials',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				username: {
					label: 'Email',
					type: 'email',
					placeholder: 'Email',
				},
				password: {
					label: 'Password',
					type: 'password',
					placeholder: 'Password',
				},
			},
			async authorize(credentials, req) {
				if (credentials?.pin) {
					const user = await prisma.user.findFirst({
						where: {
							pin: credentials.pin,
						},
					});
					if (user) return user;
					return null;
				}
				const user = await prisma.user.findFirst({
					where: {
						email: credentials.email,
						password: credentials.password,
					},
				});

				// If no error and we have user data, return it
				if (user) {
					return user;
				}
				// Return null if user data could not be retrieved
				return null;
			},
		}),
	],
	callbacks: {
		jwt: async ({ token, user }) => {
			if (typeof user !== typeof undefined) token.user = user;

			return token;
		},
		session: async ({ session, token }) => {
			token?.user && (session.user = token.user);

			return session;
		},
	},
	pages: {
		signIn: '/admin/signin',
	},
};

export default NextAuth(authOptions);
