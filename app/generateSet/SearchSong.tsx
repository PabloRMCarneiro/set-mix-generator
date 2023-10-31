import { getSession } from "next-auth/react";

async function getTrack(id: string, token?: string) {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: {
      Authorization: `Bearer BQBipq1rg8nDX9HOQcMQJfXIoa7VQ-AVP3R1Wug6N2tSzRdORVm1KuaF1Yi3OLPu03YllR4IspekP5q2girtkFKUD2_cj0REeO2SUe0h8Ou4aVBFNF4dGOzbIomkVdJ8WPBmkALkLe9PvQeGn4yQDRgd36QBsfjN3gVa9S_Brva7_YwEZn_wYPA6ePOwVNjLu4Aoe8_GI5CxaxUGJRtWU8k-5K5zLz5CRqgRIknONrTmR73-I6Gv_Tv_0kcHrym-XuQsA0uxhcvNPdY3J2zslhKieNAK9mufigAkDEHxxYM`,
    },
  });
  const data = await response.json();
  return data;
}

export default function SearchSong() {
  
  
  const track = getTrack('24UyP8vlf7Yut97V1NEjVm');


  console.log(track)

  return (
    <div>aksndkjas</div>
  )
}
