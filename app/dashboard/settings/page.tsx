import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: "default-tenant" },
  });

  if (!tenant) return <div>Tenant not found</div>;

  const config = JSON.parse(tenant.config);

  return (
    <div className="space-y-6 text-black">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Firm Configuration</h2>
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700">Firm Name</label>
            <input 
              type="text" 
              defaultValue={tenant.name}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input 
              type="text" 
              readOnly
              value={tenant.slug}
              className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Screening Criteria</label>
            <textarea 
              rows={4}
              defaultValue={config.screeningCriteria}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g. Must have occurred in California, must have insurance..."
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-100 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">C</div>
              <div>
                <p className="font-semibold">Clio</p>
                <p className="text-xs text-gray-500">Legal CRM</p>
              </div>
            </div>
            <span className="text-xs text-green-600 font-bold">CONNECTED</span>
          </div>
          <div className="p-4 border border-gray-100 rounded-lg flex items-center justify-between opacity-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">T</div>
              <div>
                <p className="font-semibold">Twilio</p>
                <p className="text-xs text-gray-500">SMS & Voice</p>
              </div>
            </div>
            <span className="text-xs text-gray-400 font-bold">NOT CONFIGURED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
