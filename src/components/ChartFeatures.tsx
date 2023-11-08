import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { AudioSearch } from "../utils/types";

export default function ChartFeatures({
  userPlaylist,
}: {
  userPlaylist: AudioSearch[];
}) {
  // pegar a enerfy da userPlaylist e colocar em um array data
  const data = userPlaylist.map((track, index) => {
    return {
      index: index + 1,
      name: track.name,
      energy: (track.energy * 100).toFixed(1),
      dance: (track.danceability * 100).toFixed(1),
      instrumentalness: (track.instrumentalness * 100).toFixed(1),
      valence: (track.valence * 100).toFixed(1),
    };
  });

  return (
    <>
      <LineChart
        width={data.length * 50 > 1100 ? data.length * 50 : 1100}
        height={400}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="energy"
          stroke="#38d845"
          strokeWidth={3}
        />
        <Line
          type="monotone"
          dataKey="dance"
          stroke="#d84338"
          strokeWidth={3}
        />
        <Line
          type="monotone"
          dataKey="instrumentalness"
          stroke="#d8d538"
          strokeWidth={1}
        />
        <Line
          type="monotone"
          dataKey="valence"
          stroke="#d838d8"
          strokeWidth={1}
        />
      </LineChart>
    </>
  );
}
