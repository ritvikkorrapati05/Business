import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const totalLeads = await prisma.lead.count({
    where: { tenantId: "default-tenant" }
  });
  
  const qualifiedLeads = await prisma.lead.count({
    where: { 
      tenantId: "default-tenant",
      status: "QUALIFIED"
    }
  });

  const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads * 100).toFixed(1) : "0";

  const recentActivity = await prisma.lead.findMany({
    where: { tenantId: "default-tenant" },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  return (
    <div className="space-y-6 text-black">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Leads</p>
          <p className="text-3xl font-bold">{totalLeads}</p>
          <p className="text-xs text-green-600 mt-1">Real-time data</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Qualified Leads</p>
          <p className="text-3xl font-bold">{qualifiedLeads}</p>
          <p className="text-xs text-green-600 mt-1">Real-time data</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
          <p className="text-3xl font-bold">{conversionRate}%</p>
          <p className="text-xs text-blue-600 mt-1">Leads to Qualified</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No recent activity.</p>
          ) : (
            recentActivity.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">
                      {lead.name ? lead.name.split(' ').map(n => n[0]).join('') : "A"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{lead.name || "Anonymous"}</p>
                    <p className="text-xs text-gray-500">{lead.caseType} - {new Date(lead.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  lead.status === 'QUALIFIED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {lead.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
