import { prisma } from "@/lib/prisma";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    where: { tenantId: "default-tenant" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-black">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold">Leads</h2>
      </div>
      
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Case Type</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Score</th>
            <th className="px-6 py-3">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                No leads found yet.
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium">{lead.name || "Anonymous"}</p>
                  <p className="text-xs text-gray-500">{lead.phone || lead.email}</p>
                </td>
                <td className="px-6 py-4 text-sm">{lead.caseType}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{lead.score}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
