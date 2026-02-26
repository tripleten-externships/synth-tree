# GraphQL Playground Demo Script

## Comprehensive Skill Tree / Course Management API Demo

This demo script showcases the complete capabilities of the skill tree/course management API through a realistic educational platform scenario. Follow the sections in order to see how an instructor can create a course, build a skill tree, add content, create assessments, and track student progress.

---

## Table of Contents

1. [Setup & Authentication](#1-setup--authentication)
2. [Course Creation](#2-course-creation)
3. [Building the Skill Tree](#3-building-the-skill-tree)
4. [Adding Lesson Content](#4-adding-lesson-content)
5. [Creating Quizzes](#5-creating-quizzes)
6. [Student Progress Tracking](#6-student-progress-tracking)
7. [Admin Queries](#7-admin-queries)
8. [Update Operations](#8-update-operations)
9. [Advanced Features](#9-advanced-features)

---

## 1. Setup & Authentication

### 1.1 Sync Current User (First-time login)

```graphql
mutation SyncCurrentUser {
  syncCurrentUser(
    name: "Dr. Sarah Johnson"
    photoUrl: "https://example.com/photos/sarah.jpg"
  ) {
    id
    email
    name
    photoUrl
    role
    createdAt
  }
}
```

**Purpose**: Creates or updates the current user's profile. This is typically called on first login or profile update.

### 1.2 List All Users (Admin only)

```graphql
query ListAllUsers {
  allUsers(limit: 50, offset: 0) {
    id
    email
    name
    role
    createdAt
    coursesAuthored {
      id
      title
    }
  }
}
```

**Purpose**: View all users in the system. Useful for admin dashboards.

### 1.3 Set User Role (Admin only)

```graphql
mutation PromoteToAdmin {
  setUserRole(userId: "user-id-here", role: ADMIN) {
    id
    email
    name
    role
  }
}
```

**Purpose**: Promote a user to admin or demote to regular user. Use `ADMIN` or `USER` for the role.

---

## 2. Course Creation

### 2.1 Create a New Course

```graphql
mutation CreateWebDevelopmentCourse {
  createCourse(
    input: {
      title: "Full-Stack Web Development Bootcamp"
      description: "Master modern web development from HTML basics to advanced React and Node.js. Build real-world projects and launch your career as a full-stack developer."
      defaultTreeTitle: "Web Development Learning Path"
    }
  ) {
    id
    title
    description
    status
    createdAt
    author {
      id
      name
      email
    }
    trees {
      id
      title
      description
    }
  }
}
```

**Purpose**: Creates a new course with an initial skill tree. The course starts in `DRAFT` status.

**Note**: Save the `courseId` and `treeId` from the response for subsequent operations!

### 2.2 Create Additional Skill Tree

```graphql
mutation CreateAdvancedTree {
  createSkillTree(
    input: {
      courseId: "COURSE_ID_FROM_ABOVE"
      title: "Advanced Topics & Specializations"
      description: "Deep dive into advanced web development topics including performance optimization, security, and DevOps"
    }
  ) {
    id
    title
    description
    courseId
    createdAt
  }
}
```

**Purpose**: Courses can have multiple skill trees for different learning paths.

### 2.3 Query My Courses with Content

```graphql
query MyCoursesWithContent {
  adminMyCoursesWithContent(limit: 10, page: 1, status: DRAFT, search: "Web") {
    id
    title
    description
    status
    createdAt
    updatedAt
    trees {
      id
      title
      nodes {
        id
        title
        step
        orderInStep
      }
    }
  }
}
```

**Purpose**: View all courses you've created with their complete structure.

---

## 3. Building the Skill Tree

### 3.1 Create the First Node (Root Node)

```graphql
mutation CreateFirstNode {
  createFirstSkillNode(
    input: { treeId: "TREE_ID_FROM_ABOVE", title: "HTML Fundamentals" }
  ) {
    id
    title
    step
    orderInStep
    posX
    posY
    treeId
  }
}
```

**Purpose**: Creates the first node in a skill tree at position (1,1). This is the entry point for students.

**Note**: Save the `nodeId` for the next steps!

### 3.2 Add Node to the Right (Same Step)

```graphql
mutation AddCSSNode {
  createSkillNodeToRight(
    input: { referenceNodeId: "HTML_NODE_ID", title: "CSS Styling Basics" }
  ) {
    id
    title
    step
    orderInStep
    posX
    posY
    prerequisites {
      dependsOnNodeId
      dependsOn {
        title
      }
    }
  }
}
```

**Purpose**: Adds a node to the right in the same row (step). This node is gated by the previous node in the row.

### 3.3 Add Another Node to the Right

```graphql
mutation AddJSNode {
  createSkillNodeToRight(
    input: { referenceNodeId: "CSS_NODE_ID", title: "JavaScript Essentials" }
  ) {
    id
    title
    step
    orderInStep
    posX
    posY
    prerequisites {
      dependsOn {
        title
      }
    }
  }
}
```

### 3.4 Add Node Below (Next Step)

```graphql
mutation AddReactNode {
  createSkillNodeBelow(
    input: { referenceNodeId: "JS_NODE_ID", title: "React Fundamentals" }
  ) {
    id
    title
    step
    orderInStep
    posX
    posY
    prerequisites {
      dependsOn {
        title
      }
    }
  }
}
```

**Purpose**: Creates a new node in the next step (new row). This is gated by the rightmost node in the previous step.

### 3.5 Build More Complex Tree Structure

```graphql
# Add more nodes to step 2
mutation AddNodeJSNode {
  createSkillNodeToRight(
    input: { referenceNodeId: "REACT_NODE_ID", title: "Node.js & Express" }
  ) {
    id
    title
    step
    orderInStep
  }
}

# Add database node to the right
mutation AddDatabaseNode {
  createSkillNodeToRight(
    input: { referenceNodeId: "NODEJS_NODE_ID", title: "Database Design & SQL" }
  ) {
    id
    title
    step
    orderInStep
  }
}

# Add final project node below
mutation AddCapstoneNode {
  createSkillNodeBelow(
    input: {
      referenceNodeId: "DATABASE_NODE_ID"
      title: "Full-Stack Capstone Project"
    }
  ) {
    id
    title
    step
    orderInStep
    prerequisites {
      dependsOn {
        title
      }
    }
  }
}
```

### 3.6 Query Skill Tree Structure

```graphql
query ViewSkillTreeStructure {
  adminMySkillTree(id: "TREE_ID") {
    id
    title
    description
    course {
      title
    }
    nodes {
      id
      title
      step
      orderInStep
      posX
      posY
      prerequisites {
        dependsOn {
          id
          title
        }
      }
      lessons {
        id
        type
        status
      }
      quiz {
        id
        title
        required
      }
    }
  }
}
```

---

## 4. Adding Lesson Content

### 4.1 Add Video Lesson Block

```graphql
mutation AddVideoLesson {
  createLessonBlock(
    input: {
      node: { connect: { id: "HTML_NODE_ID" } }
      type: VIDEO
      status: DRAFT
      order: 1
      caption: "Introduction to HTML - Building Your First Webpage"
      url: "https://youtube.com/watch?v=example123"
      meta: {
        duration: 1200
        thumbnail: "https://example.com/thumbnails/html-intro.jpg"
      }
    }
  ) {
    id
    type
    caption
    url
    order
    status
    meta
    node {
      title
    }
  }
}
```

**Purpose**: Adds a video lesson to a skill node. Videos can include duration and thumbnail metadata.

### 4.2 Add HTML Content Block

```graphql
mutation AddHTMLContent {
  createLessonBlock(
    input: {
      node: { connect: { id: "HTML_NODE_ID" } }
      type: HTML
      status: DRAFT
      order: 2
      caption: "HTML Elements Reference Guide"
      html: "<h2>Common HTML Elements</h2><ul><li><code>&lt;div&gt;</code> - Container element</li><li><code>&lt;p&gt;</code> - Paragraph</li><li><code>&lt;a&gt;</code> - Hyperlink</li></ul>"
    }
  ) {
    id
    type
    caption
    html
    order
    status
  }
}
```

**Purpose**: Adds rich HTML content for documentation, references, or formatted text.

### 4.3 Add Image Block

```graphql
mutation AddImageBlock {
  createLessonBlock(
    input: {
      node: { connect: { id: "CSS_NODE_ID" } }
      type: IMAGE
      status: DRAFT
      order: 1
      caption: "CSS Box Model Diagram"
      url: "https://example.com/images/css-box-model.png"
      meta: {
        width: 800
        height: 600
        alt: "Diagram showing content, padding, border, and margin"
      }
    }
  ) {
    id
    type
    caption
    url
    meta
    order
  }
}
```

### 4.4 Add Embedded Content (CodePen, JSFiddle, etc.)

```graphql
mutation AddCodeEmbed {
  createLessonBlock(
    input: {
      node: { connect: { id: "JS_NODE_ID" } }
      type: EMBED
      status: DRAFT
      order: 1
      caption: "Interactive JavaScript Calculator"
      url: "https://codepen.io/example/embed/calculator123"
      meta: { embedType: "codepen", allowFullscreen: true }
    }
  ) {
    id
    type
    caption
    url
    meta
  }
}
```

### 4.5 Publish Lesson Block

```graphql
mutation PublishLesson {
  publishLessonBlock(id: "LESSON_BLOCK_ID") {
    id
    status
    caption
    updatedAt
  }
}
```

**Purpose**: Changes lesson status from `DRAFT` to `PUBLISHED`, making it visible to students.

### 4.6 Query Lessons for a Node

```graphql
query GetNodeLessons {
  lessonBlocksByNode(nodeId: "HTML_NODE_ID") {
    id
    type
    caption
    url
    html
    order
    status
    meta
    createdAt
    node {
      title
    }
  }
}
```

---

## 5. Creating Quizzes

### 5.1 Create a Quiz for a Node

```graphql
mutation CreateHTMLQuiz {
  createQuiz(
    nodeId: "HTML_NODE_ID"
    title: "HTML Fundamentals Assessment"
    required: true
  ) {
    id
    title
    required
    nodeId
    createdAt
    node {
      title
    }
  }
}
```

**Purpose**: Attaches a quiz to a skill node. Set `required: true` to make it mandatory for completion.

**Note**: Save the `quizId` for adding questions!

### 5.2 Add Single Choice Question

```graphql
mutation AddSingleChoiceQuestion {
  createQuizQuestion(
    quizId: "QUIZ_ID"
    type: SINGLE_CHOICE
    prompt: "Which HTML element is used for the largest heading?"
    order: 1
  ) {
    id
    prompt
    type
    order
    quiz {
      title
    }
  }
}
```

**Note**: Save the `questionId` for adding options!

### 5.3 Add Options for Single Choice Question

```graphql
# Correct answer
mutation AddCorrectOption {
  createQuizOption(questionId: "QUESTION_ID", text: "<h1>", isCorrect: true) {
    id
    text
    isCorrect
  }
}

# Wrong answers
mutation AddWrongOption1 {
  createQuizOption(questionId: "QUESTION_ID", text: "<h6>", isCorrect: false) {
    id
    text
    isCorrect
  }
}

mutation AddWrongOption2 {
  createQuizOption(
    questionId: "QUESTION_ID"
    text: "<header>"
    isCorrect: false
  ) {
    id
    text
    isCorrect
  }
}

mutation AddWrongOption3 {
  createQuizOption(
    questionId: "QUESTION_ID"
    text: "<head>"
    isCorrect: false
  ) {
    id
    text
    isCorrect
  }
}
```

### 5.4 Add Multiple Choice Question

```graphql
mutation AddMultipleChoiceQuestion {
  createQuizQuestion(
    quizId: "QUIZ_ID"
    type: MULTIPLE_CHOICE
    prompt: "Which of the following are valid HTML5 semantic elements? (Select all that apply)"
    order: 2
  ) {
    id
    prompt
    type
    order
  }
}

# Add multiple correct options
mutation AddCorrectOption1 {
  createQuizOption(
    questionId: "NEW_QUESTION_ID"
    text: "<article>"
    isCorrect: true
  ) {
    id
    text
    isCorrect
  }
}

mutation AddCorrectOption2 {
  createQuizOption(
    questionId: "NEW_QUESTION_ID"
    text: "<nav>"
    isCorrect: true
  ) {
    id
    text
    isCorrect
  }
}

mutation AddWrongOption {
  createQuizOption(
    questionId: "NEW_QUESTION_ID"
    text: "<div>"
    isCorrect: false
  ) {
    id
    text
    isCorrect
  }
}
```

### 5.5 Add Open-Ended Question

```graphql
mutation AddOpenQuestion {
  createQuizQuestion(
    quizId: "QUIZ_ID"
    type: OPEN_QUESTION
    prompt: "Explain the difference between inline and block-level elements in HTML. Provide at least two examples of each."
    order: 3
  ) {
    id
    prompt
    type
    order
  }
}
```

**Note**: Open questions don't have options - they require manual grading.

### 5.6 Query Quiz with All Questions

```graphql
query GetQuizDetails {
  quiz(id: "QUIZ_ID") {
    id
    title
    required
    createdAt
    node {
      title
    }
    questions {
      id
      prompt
      type
      order
      options {
        id
        text
        isCorrect
      }
    }
  }
}
```

### 5.7 Query All Quizzes for a Tree

```graphql
query GetTreeQuizzes {
  quizzesByTree(treeId: "TREE_ID") {
    id
    title
    required
    node {
      id
      title
      step
    }
    questions {
      id
      prompt
      type
    }
  }
}
```

---

## 6. Student Progress Tracking

### 6.1 View My Progress (Current User)

```graphql
query MyLearningProgress {
  myProgress {
    id
    status
    completedAt
    createdAt
    updatedAt
    node {
      id
      title
      step
      orderInStep
      tree {
        title
        course {
          title
        }
      }
    }
  }
}
```

**Purpose**: Shows all progress records for the current user across all courses.

### 6.2 View Progress for Specific Node

```graphql
query NodeProgress {
  nodeProgress(nodeId: "HTML_NODE_ID") {
    id
    status
    completedAt
    createdAt
    node {
      title
    }
    user {
      name
      email
    }
  }
}
```

**Purpose**: Check progress for a single node. Returns `null` if not started yet (implicit `NOT_STARTED`).

### 6.3 View Course-Level Progress

```graphql
query CourseProgressSummary {
  courseProgress(courseId: "COURSE_ID") {
    courseId
    totalNodes
    completedNodes
    inProgressNodes
    notStartedNodes
    completionPercentage
  }
}
```

**Purpose**: Get aggregated statistics for a user's progress in a course.

### 6.4 Admin View Another User's Progress

```graphql
query StudentProgress {
  myProgress(userId: "STUDENT_USER_ID") {
    id
    status
    completedAt
    node {
      title
      tree {
        course {
          title
        }
      }
    }
  }
}

query StudentCourseProgress {
  courseProgress(courseId: "COURSE_ID", userId: "STUDENT_USER_ID") {
    totalNodes
    completedNodes
    inProgressNodes
    notStartedNodes
    completionPercentage
  }
}
```

**Purpose**: Admins can view any student's progress by passing `userId` parameter.

---

## 7. Admin Queries

### 7.1 View All Courses (Admin)

```graphql
query AllCourses {
  adminGetAllCourses(limit: 20, page: 1, status: PUBLISHED, search: "web") {
    id
    title
    description
    status
    createdAt
    author {
      name
      email
    }
    trees {
      id
      title
    }
  }
}
```

**Purpose**: List all courses in the system with filtering and pagination.

### 7.2 View All Skill Trees

```graphql
query AllSkillTrees {
  adminSkillTrees(
    limit: 20
    page: 1
    courseId: "COURSE_ID"
    search: "fundamentals"
  ) {
    id
    title
    description
    createdAt
    course {
      title
      author {
        name
      }
    }
    nodes {
      id
      title
    }
  }
}
```

### 7.3 View All Skill Nodes

```graphql
query AllNodes {
  adminSkillNodes(limit: 50, page: 1, treeId: "TREE_ID") {
    id
    title
    step
    orderInStep
    createdAt
    tree {
      title
    }
    lessons {
      id
      type
      status
    }
    quiz {
      id
      title
    }
  }
}
```

### 7.4 View Specific Course (Detailed)

```graphql
query CourseDetails {
  adminCourse(id: "COURSE_ID") {
    id
    title
    description
    status
    createdAt
    updatedAt
    author {
      id
      name
      email
    }
    trees {
      id
      title
      description
      nodes {
        id
        title
        step
        orderInStep
        prerequisites {
          dependsOn {
            title
          }
        }
        lessons {
          id
          type
          caption
          status
        }
        quiz {
          id
          title
          required
          questions {
            id
            prompt
          }
        }
        progresses {
          id
          status
          user {
            name
          }
        }
      }
    }
  }
}
```

**Purpose**: Gets complete course structure including all trees, nodes, lessons, quizzes, and student progress.

### 7.5 View Specific Node (Detailed)

```graphql
query NodeDetails {
  skillNode(id: "NODE_ID") {
    id
    title
    step
    orderInStep
    posX
    posY
    createdAt
    tree {
      title
      course {
        title
      }
    }
    prerequisites {
      dependsOn {
        id
        title
      }
    }
    requiredFor {
      node {
        id
        title
      }
    }
    lessons {
      id
      type
      caption
      order
      status
      url
      html
    }
    quiz {
      id
      title
      required
      questions {
        id
        prompt
        type
        order
        options {
          id
          text
          isCorrect
        }
      }
    }
  }
}
```

### 7.6 View All Lesson Blocks

```graphql
query AllLessonBlocks {
  lessonBlocks(limit: 100, offset: 0) {
    id
    type
    caption
    status
    order
    url
    html
    createdAt
    node {
      title
      tree {
        course {
          title
        }
      }
    }
  }
}
```

---

## 8. Update Operations

### 8.1 Update Course

```graphql
mutation UpdateCourse {
  updateCourse(
    id: "COURSE_ID"
    input: {
      title: "Full-Stack Web Development Bootcamp 2024"
      description: "Updated comprehensive course covering the latest web technologies and best practices."
      status: PUBLISHED
    }
  ) {
    id
    title
    description
    status
    updatedAt
  }
}
```

**Purpose**: Update course details. Setting status to `PUBLISHED` makes it visible to students.

### 8.2 Update Skill Tree

```graphql
mutation UpdateSkillTree {
  updateSkillTree(
    id: "TREE_ID"
    input: {
      title: "Web Development Fundamentals - Updated"
      description: "Complete learning path from basics to advanced concepts"
    }
  ) {
    id
    title
    description
    updatedAt
  }
}
```

### 8.3 Update Skill Node

```graphql
mutation UpdateNode {
  updateSkillNode(
    id: "NODE_ID"
    input: { title: "Advanced HTML5 & Semantic Elements", posX: 2, posY: 1 }
  ) {
    id
    title
    posX
    posY
    updatedAt
  }
}
```

**Purpose**: Update node title or position. Position updates affect the visual layout in the skill tree.

### 8.4 Update Lesson Block

```graphql
mutation UpdateLessonBlock {
  updateLessonBlock(
    input: {
      id: { set: "LESSON_BLOCK_ID" }
      caption: { set: "Updated: Introduction to HTML5" }
      url: { set: "https://youtube.com/watch?v=updated456" }
      status: { set: PUBLISHED }
    }
  ) {
    id
    caption
    url
    status
    updatedAt
  }
}
```

### 8.5 Update Quiz

```graphql
mutation UpdateQuiz {
  updateQuiz(
    id: "QUIZ_ID"
    title: "HTML5 Fundamentals - Final Assessment"
    required: true
  ) {
    id
    title
    required
    updatedAt
  }
}
```

### 8.6 Update Quiz Question

```graphql
mutation UpdateQuizQuestion {
  updateQuizQuestion(
    id: "QUESTION_ID"
    prompt: "Which HTML5 element is used for the primary heading of a page?"
    order: 1
  ) {
    id
    prompt
    order
    updatedAt
  }
}
```

### 8.7 Update Quiz Option

```graphql
mutation UpdateQuizOption {
  updateQuizOption(id: "OPTION_ID", text: "<h1> (Updated)", isCorrect: true) {
    id
    text
    isCorrect
    updatedAt
  }
}
```

---

## 9. Advanced Features

### 9.1 Delete Skill Node (Simple)

```graphql
mutation DeleteNodeSimple {
  deleteSkillNodeSimple(id: "NODE_ID")
}
```

**Purpose**: Simple deletion without restructuring dependencies. Returns `true` on success.

### 9.2 Delete Skill Node (Advanced)

```graphql
mutation DeleteNodeAdvanced {
  deleteSkillNodeAdvanced(id: "NODE_ID")
}
```

**Purpose**: Deletes node and rebuilds prerequisite gating structure automatically. Returns `true` on success.

### 9.3 Delete Quiz Components

```graphql
# Delete quiz option
mutation DeleteQuizOption {
  deleteQuizOption(id: "OPTION_ID") {
    id
    text
  }
}

# Delete quiz question (also deletes associated options)
mutation DeleteQuizQuestion {
  deleteQuizQuestion(id: "QUESTION_ID") {
    id
    prompt
  }
}

# Delete entire quiz (also deletes questions and options)
mutation DeleteQuiz {
  deleteQuiz(id: "QUIZ_ID") {
    id
    title
  }
}
```

### 9.4 Delete Lesson Block

```graphql
mutation DeleteLessonBlock {
  deleteLessonBlock(id: "LESSON_BLOCK_ID") {
    id
    caption
  }
}
```

### 9.5 Delete Skill Tree

```graphql
mutation DeleteSkillTree {
  deleteSkillTree(id: "TREE_ID") {
    id
    title
  }
}
```

**Warning**: This deletes all nodes, lessons, and quizzes in the tree!

### 9.6 Delete Course

```graphql
mutation DeleteCourse {
  deleteCourse(id: "COURSE_ID") {
    id
    title
  }
}
```

**Warning**: This deletes all skill trees, nodes, lessons, and quizzes in the course!

### 9.7 Delete User (Admin only)

```graphql
mutation DeleteUser {
  deleteUser(id: "USER_ID") {
    id
    email
    name
  }
}
```

**Warning**: This may affect course ownership and user progress records.

### 9.8 Complex Query: Skill Nodes by Tree

```graphql
query SkillNodesByTree {
  skillNodesByTree(treeId: "TREE_ID") {
    id
    title
    step
    orderInStep
    posX
    posY
    prerequisites {
      dependsOn {
        id
        title
      }
    }
    requiredFor {
      node {
        id
        title
      }
    }
    lessons {
      id
      type
      caption
      status
    }
    quiz {
      id
      title
      required
    }
  }
}
```

**Purpose**: Get all nodes in a tree with their complete structure for visualization.

### 9.9 Advanced Filtering: Nodes with Where Clauses

```graphql
query AdminNodesWithFilter {
  adminSkillNodes(limit: 50, treeId: "TREE_ID") {
    id
    title
    step
    orderInStep
    lessons(where: { status: { equals: PUBLISHED } }) {
      id
      type
      caption
      status
    }
    quiz {
      id
      title
      questions(orderBy: { order: asc }) {
        id
        prompt
        order
      }
    }
  }
}
```

---

## Demo Script Summary

This comprehensive demo demonstrates:

✅ **User Management**: Authentication, role management, user listing  
✅ **Course Creation**: Creating courses with multiple skill trees  
✅ **Skill Tree Building**: Creating nodes with proper gating/prerequisites  
✅ **Content Management**: Adding videos, images, HTML, and embeds  
✅ **Assessment Creation**: Quizzes with multiple question types  
✅ **Progress Tracking**: Individual node, course, and user-level progress  
✅ **Admin Operations**: Querying all entities, viewing detailed reports  
✅ **Update Operations**: Modifying all entity types  
✅ **Advanced Features**: Node deletion with dependency management

## Tips for Presenters

1. **Start Simple**: Begin with just a few nodes and one lesson before building complexity
2. **Save IDs**: Keep track of generated IDs in a separate note for easy reference
3. **Show the Flow**: Create → Update → Query → Delete in sequence
4. **Demonstrate Gating**: Show how node prerequisites create learning paths
5. **Progress Tracking**: Switch between admin and student perspectives
6. **Use Realistic Data**: Use actual course topics your audience will recognize

## Next Steps

After this demo, stakeholders should understand:

- How instructors build and manage courses
- How content is structured into skill trees
- How assessments are created and managed
- How student progress is tracked and reported
- The flexibility of the platform for different learning paths

---

**End of Demo Script**
