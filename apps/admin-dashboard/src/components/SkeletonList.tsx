export const SkeletonList = () => (
  <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 animate-pulse">
    <table className="min-w-full text-left text-sm">
      <thead className="bg-gray-50 text-gray-700">
        <tr>
          <th className="px-4 py-3 font-medium">Course</th>
          <th className="px-4 py-3 font-medium">Status</th>
          <th className="px-4 py-3 font-medium">Chapters</th>
          <th className="px-4 py-3 font-medium">Learners</th>
          <th className="px-4 py-3 font-medium">Completion</th>
          <th className="px-4 py-3 font-medium">Edited</th>
          <th className="px-4 py-3 font-medium" />
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3].map((row) => (
          <tr key={row} className="border-t">
            <td className="px-4 py-3">
              <div className="h-4 w-40 rounded bg-gray-200 mb-2" />
              <div className="h-3 w-28 rounded bg-gray-200" />
            </td>
            <td className="px-4 py-3">
              <div className="h-6 w-24 rounded-full bg-gray-200" />
            </td>
            <td className="px-4 py-3"><div className="h-4 w-8 rounded bg-gray-200" /></td>
            <td className="px-4 py-3"><div className="h-4 w-8 rounded bg-gray-200" /></td>
            <td className="px-4 py-3"><div className="h-4 w-8 rounded bg-gray-200" /></td>
            <td className="px-4 py-3"><div className="h-4 w-8 rounded bg-gray-200" /></td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-10 rounded bg-gray-200" />
                <div className="h-4 w-14 rounded bg-gray-200" />
                <div className="h-4 w-10 rounded bg-gray-200" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
