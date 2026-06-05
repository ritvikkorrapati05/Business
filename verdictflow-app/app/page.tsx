import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-black">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">VerdictFlow AI</h1>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-xl text-center max-w-2xl text-gray-600">
          The intake infrastructure for growth-minded personal injury law firms.
        </p>
        
        <div className="flex gap-4 mt-8">
          <Link 
            href="/login" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <button 
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>

      <ChatWidget tenantId="default-tenant" />
    </main>
  );
}
