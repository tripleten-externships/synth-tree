query LearnerCourseTree($courseId: ID!) {
  courseForLearner(id: $courseId) {
    id
    title
    description
    trees {
      id
      nodes {
        id
        title
        posX
        posY
        isBoss
        xpReward
        lessonCount
        prerequisites {
          dependsOnNodeId
        }
        progressForViewer {
          status
          completedAt
        }
      }
    }
  }
}

