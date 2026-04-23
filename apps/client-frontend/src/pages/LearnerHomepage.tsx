// =============================
// LESSON: LearnerHomepage.tsx - Page structure with three sections
// Student-facing course homepage for ticket ST-100.
// Sections are empty placeholders right now. We will fill them in
// step by step: stats dashboard, enrolled courses, available courses.
// =============================

// Export the component as default so app.tsx can import it for the /my-courses route.
// Import React's useState so the page can remember which sort option the student picked
import { useState } from "react";

export default function LearnerHomepage() {
  // =============================
  // MOCK DATA - placeholder only, replace when database has real data (ST-100)
  // Comments below show how to swap in real queries once the DB is populated.
  // =============================

  // Fake stats for the stats dashboard
  // TODO: replace with real data from a user progress query (e.g. useGetUserStatsQuery)
  const mockStats = {
    nodesCompleted: 24,   // total lesson nodes finished across all courses
    quizzesPassed: 7,     // total quizzes successfully completed
    currentStreak: 5,     // days in a row the student studied
  };

  // Fake enrolled courses — the student is actively taking these
  // Each has a progress number (0-100) representing percent complete
  // TODO: replace with a real query for this user's enrollments (e.g. useGetMyEnrolledCoursesQuery)
  const mockEnrolledCourses = [
    { id: "1", title: "Organic Chemistry", description: "Learn the basics of organic chemistry", progress: 45 },
    { id: "2", title: "Basics of Physics", description: "Introduction to physics concepts", progress: 20 },
  ];

  // Fake available courses — the student has NOT enrolled in these yet
  // No progress field because the student hasn't started them
  // TODO: replace with a query like useGetAvailableCoursesForUserQuery
  const mockAvailableCourses = [
    { id: "3", title: "Advanced Geometry", description: "Deep dive into geometric principles" },
    { id: "4", title: "Linear Algebra", description: "Vectors, matrices, and transformations" },
  ];

  // =============================
  // SORT STATE (new concept for ST-100)
  // useState creates a piece of "memory" for the page. It remembers which sort
  // option the student picked from the dropdown. When the student picks a new
  // option, setSortOrder updates the memory and the page re-renders automatically.
  // Starts as "default" which means "don't sort, show them in original order".
  // =============================
  const [sortOrder, setSortOrder] = useState("default");

  // Build the sorted list of enrolled courses based on what the student picked.
  // [...mockEnrolledCourses] makes a copy so we don't mutate the original array.
  // .sort() rearranges based on the compare function we provide.
  const sortedEnrolledCourses = [...mockEnrolledCourses].sort((a, b) => {
    if (sortOrder === "progress-high") return b.progress - a.progress; // highest progress first
    if (sortOrder === "progress-low") return a.progress - b.progress;  // lowest progress first
    return 0; // "default" — leave the array in its original order
  });

  return (
    // Outer wrapper:
    // flex flex-col  = stack children top to bottom
    // gap-8          = vertical space between each section
    // p-8            = padding on all sides so nothing touches the screen edges
    // max-w-6xl      = limit the page width so content is readable on wide screens
    // mx-auto        = horizontally center the page within its parent
    // w-full         = take the full available width up to the max-w limit
    <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto w-full">

      {/* ===== Page heading ===== */}
      <h1 className="text-3xl font-bold text-[#212121]">
        Welcome back!
      </h1>

      {/* ===== SECTION 1: Stats dashboard ===== */}
      {/* Will show: total nodes completed, quizzes passed, current streak. */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-[#212121] mb-4">
          Your Stats
        </h2>
        {/* grid with 3 equal columns so each stat has its own compact box */}
        <div className="grid grid-cols-3 gap-4">
          {/* Placeholder stat box 1 */}
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            {/* Total lesson nodes completed across all courses — from mockStats */}
            <p className="text-3xl font-bold text-[#212121]">{mockStats.nodesCompleted}</p>
            <p className="text-sm text-gray-500">Nodes completed</p>
          </div>
          {/* Placeholder stat box 2 */}
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            {/* Total quizzes the student has passed — from mockStats */}
            <p className="text-3xl font-bold text-[#212121]">{mockStats.quizzesPassed}</p>
            <p className="text-sm text-gray-500">Quizzes passed</p>
          </div>
          {/* Placeholder stat box 3 */}
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            {/* Days in a row the student has studied — from mockStats */}
            <p className="text-3xl font-bold text-[#212121]">{mockStats.currentStreak}</p>
            <p className="text-sm text-gray-500">Current streak</p>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: Enrolled courses ===== */}
      {/* Will show course cards for courses the student is already taking,
          with progress bars and a Continue button. */}
      <section>
        {/* Row with the section heading on the left and a sort dropdown on the right */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#212121]">
            Your Enrolled Courses
          </h2>

          {/* Sort dropdown — student picks an option, state updates, cards re-sort */}
          <label className="text-sm text-gray-500">
            Sort:
            {/* value = what's currently selected. onChange = run setSortOrder when user picks a new option. */}
            <select
              className="ml-2 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-[#212121]"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">Default order</option>
              <option value="progress-high">Most progress first</option>
              <option value="progress-low">Least progress first</option>
            </select>
          </label>
        </div>
        {/* Enrolled course cards — one per course the student is taking */}
        {/* Uses CSS grid: 1 column on mobile, 2 columns on tablets/desktops */}
        {/* Empty state: if the student has no enrolled courses, show a friendly message with a CTA.
            Otherwise show the grid of cards. This is a conditional render using the ? : ternary. */}
        {sortedEnrolledCourses.length === 0 ? (
          // Empty state message — shown when there are zero enrolled courses
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center flex flex-col items-center gap-3">
            <p className="text-lg font-semibold text-[#212121]">
              You haven't enrolled in any courses yet
            </p>
            <p className="text-sm text-gray-500">
              Browse available courses below to get started on your learning journey.
            </p>
            {/* CTA button — for now this is a visual button; wiring it later is easy */}
            <button
              type="button"
              className="mt-2 rounded-lg bg-[#212121] text-white px-4 py-2 text-sm font-medium hover:bg-black"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          // Non-empty state — show the actual grid of cards
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Loop through sortedEnrolledCourses and render one card per course */}
            {sortedEnrolledCourses.map((course) => (
            // key={course.id} helps React track each card efficiently
            <div
              key={course.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-3"
            >
              {/* Course title */}
              <h3 className="text-lg font-semibold text-[#212121]">
                {course.title}
              </h3>

              {/* Short description */}
              <p className="text-sm text-gray-500">
                {course.description}
              </p>

              {/* Progress section: label + bar */}
              {/* mt-2 = small top margin so progress sits a bit below description */}
              <div className="mt-2">
                {/* Row with the word "Progress" on the left and "45%" on the right */}
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>

                {/* Outer rail — always full width, grey background */}
                <div className="h-2 w-full rounded-full bg-gray-200">
                  {/* Inner fill — blue, width set dynamically from course.progress.
                      The style prop uses a JS template string to inject the progress number. */}
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {/* Continue button — takes the student back into the course.
                  For now this is a visual button only. Wiring it to navigate comes in a later step. */}
              <button
                type="button"
                className="mt-2 rounded-lg bg-[#212121] text-white py-2 text-sm font-medium hover:bg-black"
              >
                Continue
              </button>
            </div>
          ))}
          </div>
        )}
      </section>

      {/* ===== SECTION 3: Available courses ===== */}
      {/* Will show course cards for courses the student is NOT yet enrolled in,
          with a Start button. */}
      <section>
        <h2 className="text-lg font-semibold text-[#212121] mb-4">
          Available Courses
        </h2>
        {/* Available course cards — one per course the student has NOT enrolled in */}
        {/* Same grid: 1 column on mobile, 2 columns on tablets/desktops */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Loop through mockAvailableCourses and render one card per course.
              No progress bar because the student hasn't started these yet. */}
          {mockAvailableCourses.map((course) => (
            // key={course.id} helps React track each card efficiently during re-renders
            <div
              key={course.id}
              // Card wrapper: white rounded box with a thin border, padded, stacks children vertically with gaps
              className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-3"
            >
              {/* Course title */}
              <h3 className="text-lg font-semibold text-[#212121]">
                {course.title}
              </h3>

              {/* Short description */}
              <p className="text-sm text-gray-500">
                {course.description}
              </p>

              {/* Start button — initiates enrollment for this course.
                  For now this is a visual button only. Wiring it to real enrollment comes later. */}
              <button
                type="button"
                className="mt-2 rounded-lg bg-[#212121] text-white py-2 text-sm font-medium hover:bg-black"
              >
                Start
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
