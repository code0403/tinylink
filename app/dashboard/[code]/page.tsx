
import { prisma } from "@/lib/prisma";
import Link from "next/dist/client/link";
import { notFound } from "next/navigation";

export default async function LinkAnalyticsPage({params,}: { params: { code: string }; }) {
  const { code } = await params;

  const link = await prisma.link.findUnique({
    where: { code },
    include: {
      clicks: {
        orderBy: { timestamp: "desc" },
      },
    },
  });

  if (!link) return notFound();

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">
        Analytics for <span className="font-mono">{link.code}</span>
      </h1>

      <p className="text-gray-400 mb-6">
        Target URL:{" "}
        <a
          href={link.targetUrl}
          className="text-blue-500 underline"
          target="_blank"
        >
          {link.targetUrl}
        </a>
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-500">Total Clicks</p>
          <p className="text-3xl font-bold">{link.totalClicks}</p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-500">Last Clicked</p>
          <p className="text-lg">
            {link.lastClicked
              ? new Date(link.lastClicked).toLocaleString()
              : "Never"}
          </p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-500">Created At</p>
          <p className="text-lg">
            {new Date(link.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Click History</h2>

      {link.clicks.length === 0 ? (
        <p className="text-gray-500">No clicks yet.</p>
      ) : (
        <table className="w-full border rounded-lg">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left">Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {link.clicks.map((clk: any) => (
              <tr key={clk.id} className="border-t">
                <td className="p-3">
                  {new Date(clk.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link
        href="/"
        className="inline-block mt-6 text-blue-400 underline"
      >
        ← Back
      </Link>
    </main>
  );
}
