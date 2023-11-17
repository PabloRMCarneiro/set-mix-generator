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
import { s2c, spotify2Camelot } from "../utils/commonFunctions";

export default function ChartKey({
  userPlaylist,
}: {
  userPlaylist: AudioSearch[];
}) {
  // pegar a enerfy da userPlaylist e colocar em um array data
  const data = userPlaylist.map((track, index) => {
    return {
      index: index + 1,
      name: track.name,
      Key: s2c(track.key, track.mode),
      mode: track.mode,
    };
  });

  return (
    <>
      <ResponsiveContainer width="100%" aspect={4.0 / 2.0}>
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
          <Tooltip
            formatter={(value: any, name: any, props: any) => {
              return props.payload.mode ? `${value}B` : `${value}A`;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="Key"
            stroke="#3843d8"
            strokeWidth={3}
            legendType="rect"
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
