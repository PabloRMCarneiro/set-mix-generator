/* import React from "react";
import {
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import { AudioSearch } from "../utils/types";

function getTopArtistsChartData(userPlaylist: AudioSearch[]) {
  // Create a map to count the occurrences of each artist
  const artistCounts = userPlaylist.reduce((acc, track) => {
    // Assuming each track's artists are separated by a comma and a space
    const artists = track.artists.split(", ");
    artists.forEach((artist) => {
      acc[artist] = (acc[artist] || 0) + 1;
    });
    return acc;
  }, {});

  // Create an array from the counts and sort it
  const sortedArtists = Object.keys(artistCounts)
    .map((artist) => ({ artist, quantity: artistCounts[artist] }))
    .sort((a, b) => b.quantity - a.quantity);

  // Slice the array to get the top six artists and map it to the desired format
  const topArtistsChartData = sortedArtists.slice(0, 6).map((artistData) => ({
    artist: artistData.artist,
    quantity: artistData.quantity,
    fullMark: userPlaylist.length, // Assuming 150 is the fullMark value you want to use
  }));

  return topArtistsChartData;
}

export default function ChartGenres({
  userPlaylist,
}: {
  userPlaylist: AudioSearch[];
}) {
  // pegar a enerfy da userPlaylist e colocar em um array data
  // verificar quais são os 6 artista mais presentes na playlist
  // colocar em um array data o nome dos artistas e a quantidade de musicas de cada artista
  // os nomes dos artistas em cada música é uma string, precisa separar cada artista em um array (', ')

  const data = getTopArtistsChartData(userPlaylist);
  console.log(data);

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx={350} cy={350} outerRadius={userPlaylist.le} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="artist" />
          <PolarRadiusAxis />
          <Radar
            dataKey="quantity"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </>
  );
}
 */

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

import { AudioSearch } from "../utils/types";

function getTopArtistsChartData(userPlaylist: AudioSearch[]) {
  // Create a map to count the occurrences of each artist
  const artistCounts = userPlaylist.reduce((acc, track) => {
    // Assuming each track's artists are separated by a comma and a space
    const artists = track.artists.split(", ");
    artists.forEach((artist) => {
      acc[artist] = (acc[artist] || 0) + 1;
    });
    return acc;
  }, {});

  // Create an array from the counts and sort it
  const sortedArtists = Object.keys(artistCounts)
    .map((artist) => ({ artist, quantity: artistCounts[artist] }))
    .sort((a, b) => b.quantity - a.quantity);

  // Slice the array to get the top six artists and map it to the desired format
  const topArtistsChartData = sortedArtists.slice(0, 6).map((artistData) => ({
    artist: artistData.artist,
    quantity: artistData.quantity,
    fullMark: userPlaylist.length, // Assuming 150 is the fullMark value you want to use
  }));

  return topArtistsChartData;
}

export default function ChartArtists({
  userPlaylist,
}: {
  userPlaylist: AudioSearch[];
}) {
  const data = getTopArtistsChartData(userPlaylist);

  return (
    <ResponsiveContainer width="100%" aspect={2.0 / 2.0}>
      <RadarChart
        width={800}
        height={800}
        data={data}
        className="flex justify-center"
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="artist" />
        <PolarRadiusAxis />
        <Radar
          name="Artists"
          dataKey="quantity"
          fill="#d8bb84"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
