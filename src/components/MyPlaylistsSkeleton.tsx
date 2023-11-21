import { Skeleton } from "@/src/components/ui/skeleton";

function MyPlaylistsSkeleton() {
  const myPlaylists = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <>
      {myPlaylists &&
        myPlaylists.map((_, index) => (
          <Skeleton
            className="w-auto hover:cursor-pointer hover:bg-[#222222] mr-10 mb-5 playlist-item"
            style={{
              width: "14rem",
              height: "15rem",
              borderRadius: "10px",
              transition: "all 0.2s ease-in-out",
            }}
            key={index}
          >
            <Skeleton
              className="mx-auto mt-6"
              style={{
                width: "80%",
                height: "auto",
              }}
            />
          </Skeleton>
        ))}
    </>
  );
}

export default MyPlaylistsSkeleton;
