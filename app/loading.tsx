export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-heading text-text mb-2">Loading PayChat</h2>
        <p className="text-body text-text-secondary">
          Preparing your payment experience...
        </p>
      </div>
    </div>
  );
}
