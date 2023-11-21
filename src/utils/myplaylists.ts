export const getAllMyPLaylists = async (token: string, setMyPlaylist: Function, setIsLoading: Function) => {

  setIsLoading(true); // Start loading
  
  try {
    const userId = await getUserId(token);
    
    // if playlists quantity is greater than 50, we need to make more than one request
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists?limit=50`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao obter as playlists do usuário");
    }

    const data = await response.json();
    const playlists = data.items;

    const editablePlaylists = playlists.filter((playlist: any) => 
      playlist.owner.id === userId || playlist.collaborative
    );
    setMyPlaylist(editablePlaylists);
  } catch (error) {
    console.error(error);
    // Handle the error state if needed
  } finally {
    setIsLoading(false); // End loading
  }
}


export const getUserId = async (token: string) => {
  const response = await fetch(`https://api.spotify.com/v1/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao obter o userId");
  }

  const data = await response.json();
  return data.id;
}
