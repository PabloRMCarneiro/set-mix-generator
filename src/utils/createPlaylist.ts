// notificações de retorno -> usar contextApi

/* 
  Se não existir a playlist -> "Playlist [playlistName] criada com sucesso!"
  Se existr a playlist, porém não tem nenhuma música nova  e na mesma sequência -> "Nenhuma música nova para adicionar à playlist [playlistName]"

  Se existir a playlist, porem não tem nenhum música nova, porém tem uma nova sequência -> "Playlist [playlistName] atualizada com sucesso!"
  Se existir a playlist e tiver pelo menos uma música nova -> "Playlist [playlistName] atualizada com sucesso!"

  Se não tiver um nome de playlist -> "Por favor, insira um nome para a playlist."
  Se não tiver nenhuma música selecionada -> "Por favor, selecione pelo menos uma música."
*/


export const handleCreatePlaylist = async (
  playlistName: string,
  tracksIds: string[],
  token: string,
  setNotification: Function,
) => {
  const userId = await getCurrentUserId(token);
  setNotification(''); // Armazenará a mensagem de resultado

  // Verifique se a playlist com o nome fornecido já existe
  const existingPlaylistId = await findPlaylistByName(
    userId,
    playlistName,
    token
  );

  let playlistId;

  if (existingPlaylistId) {
    // Se a playlist já existir, limpe a playlist antes de adicionar novas faixas
    playlistId = existingPlaylistId;
    await clearPlaylist(playlistId, token);
    setNotification('Playlist updated successfully');
  } else {
    // Caso contrário, crie uma nova playlist
    const response = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlistName,
          description: "Created with Set Mix Generator",
          public: true,
        }),
      }
    );

    const data = await response.json();
    playlistId = data.id;
    setNotification('New playlist created successfully');
  }

  // Adicione faixas à playlist (agora vazia ou nova)
  const response2 = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: tracksIds.map((item) => `spotify:track:${item}`),
      }),
    }
  );

  // Verifique se a adição foi bem-sucedida
  if (!response2.ok) {
    throw new Error('Erro ao adicionar faixas à playlist.');
  }

};


async function clearPlaylist(playlistId: string, token: string) {
  // Obtenha todos os track URIs da playlist
  const tracks = await getTracksFromPlaylist(playlistId, token);
  // Remova todas as faixas da playlist
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tracks: tracks.map((trackId) => ({ uri: `spotify:track:${trackId}` })),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao limpar a playlist");
  }
}


export async function getCurrentUserId(token: string) {
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

async function findPlaylistByName(
  userId: string,
  playlistName: string,
  token: string
): Promise<string | null> {
  const response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao obter as playlists do usuário");
  }

  const data = await response.json();
  for (let playlist of data.items) {
    if (playlist.name === playlistName) {
      return playlist.id;
    }
  }

  return null;
}

async function getTracksFromPlaylist(
  playlistId: string,
  token: string
): Promise<string[]> {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao obter as faixas da playlist");
  }

  const data = await response.json();
  return data.items.map((item: any) => item.track.id);
}
