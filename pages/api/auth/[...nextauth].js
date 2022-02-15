import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/local`,
            {
              identifier: credentials.email,
              password: credentials.password,
            }
          );
          if (data) {
            return data;
          } else {
            return null;
          }
        } catch (e) {
          // console.log('caught error');
          // const errorMessage = e.response.data.message
          // Redirecting to the login page with error message          in the URL
          // throw new Error(errorMessage + '&email=' + credentials.email)
          return null;
        }
      },
    }),
  ],
  database: process.env.NEXT_PUBLIC_DATABASE_URL,
  callbacks: {
    async session(session, user) {
      session.jwt = user.jwt;
      session.id = user.id;
      return session;
    },
    async jwt(token, _, account) {
      if (account) {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/${account.provider}/callback`
        );
        url.searchParams.set("access_token", account.accessToken);
        const response = await fetch(url.toString());
        const data = await response.json();
        token.jwt = data.jwt;
        token.id = data.user.id;
      }
      return token;
    },
  },
});
