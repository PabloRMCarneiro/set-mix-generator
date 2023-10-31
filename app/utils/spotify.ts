const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_SECRET_ID;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const auth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

export async function refreshToken(token: any) {
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refresh_token,
        redirect_uri: redirect_uri || "", // Use a string value or empty string if undefined
      }).toString(), // Convert the URLSearchParams object to a string
    });
    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      expires_at: Date.now() + refreshedTokens.expires_in * 1000,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "Refreshaccess_tokenError",
    };
  }
}
