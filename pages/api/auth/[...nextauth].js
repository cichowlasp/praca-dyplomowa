import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions = {
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt',
	},
	jwt: { maxAge: 60 * 60 },
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
			async authorize(credentials) {
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
					},
				});
				//hash generate!
				// const salt = await bcrypt.genSalt(10);
				// const hash = await bcrypt.hash(credentials.password, salt);

				const passCorrect = await bcrypt.compare(
					credentials.password,
					user.password
				);

				// If no error and we have user data, return it
				if (user && passCorrect) {
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

const authHandler = (req, res) => NextAuth(req, res, authOptions);
export default authHandler;
