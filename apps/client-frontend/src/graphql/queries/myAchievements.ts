import { gql } from "@apollo/client";

export const MY_ACHIEVEMENTS_QUERY = gql`
  query MyAchievements {
    myAchievements {
      earnedAt
      achievement {
        id
        name
        description
        icon
        color
      }
    }
  }
`;

export interface MyAchievementsResponse {
  myAchievements: Array<{
    earnedAt: string;
    achievement: {
      id: string;
      name: string;
      description: string;
      icon: string;
      color: string;
    };
  }>;
}
