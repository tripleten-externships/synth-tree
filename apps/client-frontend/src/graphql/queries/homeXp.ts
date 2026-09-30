import { gql } from "@apollo/client";

// Read by the learner home's "Today's goal" and "Your week" cards (SYN-50).
// XP events are grouped by local day on the client, since UserXp.weeklyXp only
// keeps one total per week. `since` is local midnight on this week's Monday.
export const HOME_XP_WIDGETS_QUERY = gql`
  query HomeXpWidgets($since: DateTime!) {
    currentUser {
      id
      dailyGoalMinutes
      timezone
      streak {
        currentDays
        lastActive
      }
      xpEvents(where: { createdAt: { gte: $since } }) {
        id
        amount
        createdAt
      }
    }
  }
`;
