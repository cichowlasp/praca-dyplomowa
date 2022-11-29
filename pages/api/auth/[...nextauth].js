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
				if (credentials?.companyEmail && credentials?.id) {
					const company = await prisma.company.findFirst({
						where: {
							companyEmail: credentials.companyEmail,
							id: credentials.id,
						},
					});
					if (company) return company;
					return null;
				}
				if (credentials?.pin && credentials?.secretPhrase) {
					const company = await prisma.company.findFirst({
						where: {
							secretPhrase: credentials.secretPhrase,
						},
						include: {
							users: true,
						},
					});
					const user = await company.users.find(
						(user) => user.pin === credentials.pin
					);
					console.log(user);
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
			(token?.user.admin || token?.user.pin) &&
				(session.user = token.user);
			token.user.nip && (session.company = token.user);

			return session;
		},
	},
	pages: {
		signIn: '/admin/signin',
	},
};

const authHandler = (req, res) => NextAuth(req, res, authOptions);
export default authHandler;
