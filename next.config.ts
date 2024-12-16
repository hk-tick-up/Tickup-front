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
      {
        source: '/game/waiting/:gameRoomId',
        destination: '/game-waiting-room/:gameRoomId',
      },
      {
        source: '/game/waiting',
        destination: '/game-waiting-room',
      },
      {
        source: '/game/waiting-loading',
        destination: '/game-waiting-room/game-waiting-loading',
      }
    ];
  },
  output: 'standalone'
};

export default nextConfig;
