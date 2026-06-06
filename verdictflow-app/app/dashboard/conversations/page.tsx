import { prisma } from "@/lib/prisma";

export default async function ConversationsPage() {
  const conversations = await prisma.conversation.findMany({
    where: { tenantId: "default-tenant" },
    include: {
      lead: true,
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-black">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold">Conversations</h2>
      </div>
      
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3">Lead / Session</th>
            <th className="px-6 py-3">Platform</th>
            <th className="px-6 py-3">Messages</th>
            <th className="px-6 py-3">Last Active</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {conversations.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                No conversations found.
              </td>
            </tr>
          ) : (
            conversations.map((conv) => (
              <tr key={conv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium">{conv.lead?.name || "Anonymous"}</p>
                  <p className="text-xs text-gray-500">{conv.externalId}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    conv.platform === 'WEB' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {conv.platform}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{conv._count.messages}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(conv.updatedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-600 hover:underline">View History</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
