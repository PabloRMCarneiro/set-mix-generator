import { refreshToken } from '@/app/utils/spotify';
import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

const scopes = [
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-library-read",
  "user-library-modify",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "streaming",
].join(",");

const params = {
  scope: scopes
}
async function refreshAccessToken(token) {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', token.refreshToken);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_SECRET_ID}`).toString('base64')}`,
    },
    body: params,
  });

  const data = await response.json();
  return { 
    acessToken: data.access_token,
    refreshToken: data.refresh_token ?? token.refreshToken,
    acessTokenExpires: Date.now() + data.expires_in * 1000,
  }
}
const LOGIN_URL = 'https://accounts.spotify.com/authorize?' + new URLSearchParams(params).toString();


export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_SECRET_ID as string,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/generateSet',
  },
  callbacks: {
    async jwt({token, account}) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at;
        return token;
      }

      if (Date.now() < token.accessTokenExpires * 1000) {
        return token;
      }

      
      return refreshAccessToken(token);
    },
    async session({session, token}) {
      session.accessToken = token.accessToken;
      return session;
    }
  },
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST}