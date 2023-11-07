"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const stats = [
  { name: "of songs for you to choose", value: "+ 40 M" },
  { name: "your set as a playlist", value: "Spotify" },
  { name: "made by a DJ for all DJs", value: "Unlimited" },
  { name: `no fine print`, value: "100% Free" },
];

export default function Home() {
  const session = useSession();
  const router = useRouter();
  const handleLogin = () => {
    signIn("spotify", { callbackUrl: "http://localhost:3000" });
  };

  if (session.status === "authenticated") {
    router.push("/");
    return null;
  }

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 sm:py-80" >
      <div
        className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div
        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
        aria-hidden="true"
      >
        <div
          className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className=" mx-auto max-w-7xl px-6 lg:px-8 my-auto">
        <div className="mx-auto max-w-2xl lg:mx-0 my-auto">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Set Mix Generator
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Based on the songs on Spotify you can choose various parameters such
            as energy, danceability, tone... to generate a unique and memorable
            Set Mix.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            The proposal is quite simplified, you will have a search field to
            add the song you want and you will have a set of attributes that
            will help us recommend that next song for your Set.
          </p>
        </div>
        <div className="m x-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-10 text-white sm:grid-cols-2 md:flex lg:gap-x-20 ">
            <p className="text-xl hover:cursor-pointer">
              <span aria-hidden="true" onClick={handleLogin}>
                Get Started &rarr;
              </span>
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col-reverse">
                <dt className="text-base leading-7 text-gray-300">
                  {stat.name}
                </dt>
                <dd className="text-2xl font-bold leading-9 tracking-tight text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
