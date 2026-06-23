import { useRecommendedNextQuery } from "@synth-tree/api-types";
import { Card, CardContent, CardDescription, CardTitle } from "@synth-tree/ui";
import { useNavigate } from "react-router-dom";

export default function RecommendedNextCarousel() {
  const navigate = useNavigate();
  const { data, loading, error } = useRecommendedNextQuery({
    variables: { limit: 6 },
  });

  if (loading) return <p className="text-sm text-gray-500">Loading recommendations...</p>;

  if (error) {
  return (
    <section className="w-full max-w-5xl text-left">
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">Recommended next</h2>
      <div className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <p className="text-gray-500">You're all caught up — keep exploring</p>
      </div>
    </section>
  );
}

  const recommendedNodes = data?.currentUser?.recommendedNext ?? [];

  return (
    <section className="w-full max-w-5xl text-left">
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">Recommended next</h2>

      {recommendedNodes.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-gray-500">You're all caught up — keep exploring</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {recommendedNodes.map((node) => (
            <Card
              key={node.id}
              className="min-w-[240px] cursor-pointer rounded-3xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
              onClick={() => navigate(`/courses/${node.tree.course.id}`)}
            >
              <CardContent className="p-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                  {node.tree.course.title}
                </p>
                <CardTitle className="mb-2 text-lg font-semibold text-gray-900">
                  {node.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Step {node.step}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
