// Load builder first
import "./builder";

// Load all GraphQL types
import "./types/user";
import "./types/achievement";
import "./types/UserNodeProgress"; // ⭐ REQUIRED for SYN‑42
import "./types/UserAchievement";
// (add any other types you have)

// Load models
import "./models/Leaderboard";
import "./models/SkillTree";
// (whatever is inside models/)

// Load inputs
import "./inputs/course.inputs";
import "./inputs/quiz.inputs";
// (whatever is inside inputs/)

// Load queries
import "./queries/course.admin.queries";
import "./queries/skillNode.admin.queries";
import "./queries/user.queries";
import "./queries/achievement.queries";
// (whatever is inside queries/)

// Load mutations
import "./mutations/course.mutations";
import "./mutations/quiz.mutations";
import "./mutations/skillTree.mutations";
import "./mutations/progress.mutations"; // ⭐ REQUIRED for SYN‑42
// (whatever is inside mutations/)
