import React, { useMemo, useState } from "react";
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

export default function ChartBPM({
  userPlaylist,
}: {
  userPlaylist: AudioSearch[];
}) {
  // pegar a energy da userPlaylist e colocar em um array data
  const [isDownsampled, setIsDownsampled] = useState<boolean>(false); // Estado para verificar se houve regressão

  const sampledData = useMemo(() => {
    if (userPlaylist.length > 30) {
      setIsDownsampled(true); // Atualiza o estado para indicar que houve regressão
      const step = Math.ceil(userPlaylist.length / 15);
      const reducedData = [];

      for (let i = 0; i < userPlaylist.length; i += step) {
        const track = userPlaylist[i];
        reducedData.push({
          index: i / step + 1,
          name: track.name,
          bpm: Math.round(track.BPM),
        });
      }

      return reducedData.slice(0, 15); // Garante que teremos apenas 15 pontos
    } else {
      setIsDownsampled(false); // Não houve regressão
      return userPlaylist.map((track, index) => ({
        index: index + 1,
        name: track.name,
        bpm: Math.round(track.BPM),
      }));
    }
  }, [userPlaylist]);

  const domain = useMemo(() => {
    const bpms = sampledData.map((d) => d.bpm);
    const minBPM = Math.min(...bpms) - 1;
    const maxBPM = Math.max(...bpms) + 1;
    return [minBPM, maxBPM];
  }, [sampledData]);

  return (
    <>
      <ResponsiveContainer width="100%" aspect={4.0 / 2.0}>
        <LineChart
          data={sampledData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {!isDownsampled && <XAxis dataKey="index" />}
          <YAxis domain={domain} /> {/* Aplicando o domínio calculado */}
          <Tooltip />
          <Legend values={isDownsampled ? 'bpm down sampled' : 'bpm'} />
          <Line
            type="monotone"
            dataKey="bpm"
            stroke="#b607e2"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
