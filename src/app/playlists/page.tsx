"use client";
import { getAllMyPLaylists } from "@/src/utils/myplaylists";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function Playlists() {
  const session = useSession();

  const [myPlaylists, setMyPlaylists] = useState<any[]>([]);

  useEffect(() => {
    if (session.data) {
      getAllMyPLaylists((session.data as any).accessToken, setMyPlaylists);
    }
  }, [session.data]);

  console.log(myPlaylists)

  return (
    <>
      <div className="block w-8/12 mx-auto" style={{border: '1px solid white'}}>
        <p className="text-center text-6xl tracking-wider font-black pt-24">
          My Playlists
        </p>
        <div className="flex flex-wrap justify-center">
          {myPlaylists && myPlaylists.map((playlist, index) => (
            <div
              className="w-5/12 h-96 mx-5 my-10"
              style={{ border: "1px solid white" }}
              key={index}
            >
              <p className="text-center text-2xl">{playlist.name}</p>
            </div>
          ))}
          </div>
      </div>
    </>
  );
}

export default Playlists;
