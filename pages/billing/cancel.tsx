export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-500 mb-4">
        ❌ Payment Cancelled
      </h1>
      <p>You can try again anytime.</p>
    </div>
  );
}