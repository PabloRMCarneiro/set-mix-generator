import NextAuth, { AuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt';
import SpotifyProvider from 'next-auth/providers/spotify'
import axios from 'axios';

const scope = "playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-follow-modify"

import qs from 'qs';

async function refreshAccessToken(token: JWT): Promise<JWT> {
  console.log('refreshAccessToken')
  try {
    const url = process.env.SPOTIFY_REFRESH_TOKEN_URL;
    const basicAuth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_SECRET_ID}`).toString('base64');

    const body = qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken,
      clientId: process.env.SPOTIFY_CLIENT_ID,
    });

    const { data } = await axios.post(url as string, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
    });

    if (!data.access_token) {
      throw new Error('RefreshAccessTokenError');
    }

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}



const authOptions: AuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_SECRET_ID as string,
      authorization: {
        params: { scope },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at * 1000,
          user,
        }
      }
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }
      const newToken = await refreshAccessToken(token)
      return newToken
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.error = token.error
      session.user = token.user
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST}