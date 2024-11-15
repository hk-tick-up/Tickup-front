import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/game',
        destination: '/SelectGameType',
      },
      {
        source: '/game/random',
        destination: '/SelectGameType/RandomMatching',
      },
      {
        source: '/game/together',
        destination: '/SelectGameType/PlayWithFriends',
      },
      {
        source: '/game/room',
        destination: '/GameWaitingRoom',
      }
    ];
  },
};

export default nextConfig;
