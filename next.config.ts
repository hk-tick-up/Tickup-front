import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/game',
        destination: '/select-game-type',
      },
      {
        source: '/game/loading',
        destination: '/select-game-type/loading-page',
      },
      {
        source: '/game/together',
        destination: '/select-game-type/play-with-friends',
      },
      // {
      //   source: '/game/waiting/:gameRoomCode',
      //   destination: '/GameWaitingRoom/:gameRoomCode',
      // },
      {
        source: '/game/waiting',
        destination: '/game-waiting-room',
      }
    ];
  },
  output: 'standalone'
};

export default nextConfig;
