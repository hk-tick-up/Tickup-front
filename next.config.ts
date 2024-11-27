import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/game',
        destination: '/SelectGameType',
      },
      {
        source: '/game/loading',
        destination: '/SelectGameType/LoadingPage',
      },
      {
        source: '/game/together',
        destination: '/SelectGameType/PlayWithFriends',
      },
      {
        source: '/game/waiting/:gameRoomCode',
        destination: '/GameWaitingRoom/:gameRoomCode',
      },
      {
        source: '/game/waiting',
        destination: '/GameWaitingRoom',
      }
    ];
  },
};

export default nextConfig;
