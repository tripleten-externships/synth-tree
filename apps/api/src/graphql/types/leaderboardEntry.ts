import { builder } from "../builder";

export type LeaderboardEntry = {
  userId: string;
  displayName: string;
  avatar: string | null;
  totalXp: number;
  streak: number;
  rank: number;
};

export const LeaderboardEntryRef = builder.objectRef<LeaderboardEntry>("LeaderboardEntry");

LeaderboardEntryRef.implement({
  fields: (t) => ({
    userId: t.exposeString("userId"),
    displayName: t.exposeString("displayName"),
    avatar: t.exposeString("avatar", { nullable: true }),
    totalXp: t.exposeInt("totalXp"),
    streak: t.exposeInt("streak"),
    rank: t.exposeInt("rank"),
  }),
});
