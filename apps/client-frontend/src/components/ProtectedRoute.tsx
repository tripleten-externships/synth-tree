export default function ProtectedRoute({ children }: { children: any }) {
  const isLoggedIn = true; // Change to false to test the protection
  
  if (!isLoggedIn) {
    return (
      <div className="p-8">
        <h1>Please Log In</h1>
        <p>You need to be logged in to see this page.</p>
      </div>
    );
  }

  return children;
}