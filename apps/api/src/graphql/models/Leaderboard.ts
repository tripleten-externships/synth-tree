builder.objectType('LeaderboardEntry', {
  fields: (t) => ({
    userId: t.id(),
    name: t.string(),
    score: t.int(),
    rank: t.int(),
  }),
});
