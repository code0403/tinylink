'use client';

import Link from "next/dist/client/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useMediaQuery from "./components/useMediaQuery";
import AddShortUrlModal from "./components/AddShortUrlModal";



export default function Dashnboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [modalOpen, setModalOpen] = useState(false);

  // form states
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // Search State 
  const [searchQuery, setSearchQuery] = useState("");

  // const BASE_URL = window.location.origin;

  // Fetch all links
  async function fetchLinks() {
    setLoading(true);
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
    setLoading(false);
  }

  useEffect(() => {
    const BASE_URL = window.location.origin;
    fetchLinks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");

    if (!url.trim()) {
      setError("URL is required");
      return;
    }

    // basic URL validation
    try {
      new URL(url);
    } catch (err) {
      setError("Please enter a valid URL");
      return;
    }

    // code validation (optional)
    if (code.trim() && !/^[A-Za-z0-9]{6,8}$/.test(code)) {
      setError("Code must be 6-8 alphanumeric characters");
      return;
    }

    setFormLoading(true);

    const res = await fetch("/api/links", {
      method: "POST",
      body: JSON.stringify({
        targetUrl: url.trim(),
        code: code.trim() || undefined,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 409) {
      setError("This short code already exists. Try another.");
      setFormLoading(false);
      return;
    }

    if (!res.ok) {
      setError("Failed to create link");
      setFormLoading(false);
      return;
    }

    setSuccess("Link created!");
    toast.success("Short URL created!");
    setModalOpen(false);

    setUrl("");
    setCode("");
    setSuccess("");

    setFormLoading(false);

    fetchLinks();
  }

  const handleCopy = async (code: string) => {
    const url = `${window.location.origin}/${code}`;

    try {
      await navigator.clipboard.writeText(url);
      // alert("Copied!");
      toast.success("Url Copied!");
    } catch (err) {
      console.error("Failed to copy:", err);
      // alert("Copy failed.");
      toast.error("Copy failed.");
    }
  };


  const filteredLinks = links.filter((link: any) => {
    const q = searchQuery.toLowerCase();

    return (
      link.code.toLowerCase().includes(q) ||
      link.targetUrl.toLowerCase().includes(q) ||
      `${BASE_URL}/${link.code}`.toLowerCase().includes(q)
    );
  });

  const FormComponent = (
      <form
          onSubmit={handleCreate}
          className="mb-8 p-6 rounded-2xl shadow-lg bg-gray-800 border border-gray-700"
        >
          <h2 className="font-semibold text-lg mb-3">Create Link</h2>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter long URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border border-gray-600 focus:border-blue-500 bg-gray-900 text-white p-3 rounded-lg w-full outline-none transition"
            />

            <input
              type="text"
              placeholder="Custom code (optional)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-600 focus:border-blue-500 bg-gray-900 text-white p-3 rounded-lg w-full outline-none transition"
            />

            {/* States */}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={formLoading}
              className={`px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold shadow ${formLoading ? "opacity-50 cursor-not-allowed" : ""} cursor-pointer`}
            >
              {formLoading ? "Creating..." : "Create Link"}
            </button>
          </div>
        </form>
    )

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <div className="md:flex md:justify-between">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        {/* <div className="hidden md:block">
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
          >
            + Create Link
          </button>
        </div> */}

        {/* Desktop → Button opens modal */}
        {!isMobile && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setModalOpen(true)}
          >
            + Add New
          </button>
        )}
      </div>

      {/* Create Link Form */}
      {/* <div className="block md:hidden">
        <form
          onSubmit={handleCreate}
          className="mb-8 p-6 rounded-2xl shadow-lg bg-gray-800 border border-gray-700"
        >
          <h2 className="font-semibold text-lg mb-3">Create Link</h2>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter long URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border border-gray-600 focus:border-blue-500 bg-gray-900 text-white p-3 rounded-lg w-full outline-none transition"
            />

            <input
              type="text"
              placeholder="Custom code (optional)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-600 focus:border-blue-500 bg-gray-900 text-white p-3 rounded-lg w-full outline-none transition"
            />

            
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={formLoading}
              className={`px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold shadow ${formLoading ? "opacity-50 cursor-not-allowed" : ""} cursor-pointer`}
            >
              {formLoading ? "Creating..." : "Create Link"}
            </button>
          </div>
        </form>
      </div> */}

      {/* Mobile → Inline Form */}
      {isMobile && (
        <div className="mb-5 border p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
          <h2 className="font-semibold mb-2">Create a new Short URL</h2>
          {FormComponent}
        </div>
      )}

      {/* Loading STATE */}
      {loading && <p className="text-gray-500">Loading links…</p>}

      {/* Empty STATE */}
      {!loading && links.length === 0 && (
        <p className="text-gray-500">No links created yet.</p>
      )}

      <div className="mb-4">
        <h3 className="text-2xl font-semibold py-2">Search</h3>
        <label htmlFor="search" className="sr-only">Search Links</label>
        <input
          type="text"
          placeholder="Search by code or URL..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* DATA TABLE */}
      {!loading && links.length > 0 && (
        <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-700">
          <table className="w-full bg-gray-900">
            <thead className="bg-gray-800/80 text-gray backdrop-blur">
              <tr>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Target</th>
                <th className="p-3 text-left">Clicks</th>
                <th className="p-3 text-left">Last Clicked</th>
                <th className="p-3 text-left">Short URL</th>
                <th className="p-3 text-left">Copy</th>
                <th className="p-3 text-left">Actions</th>
                <th className="p-3 text-left">View Analytics</th>
              </tr>
            </thead>

            <tbody>
              {filteredLinks.map((link: any) => (
                <tr key={link.code} className="border-t border-gray-700 hover:bg-gray-800/50 transition">
                  <td className="p-3 font-mono">{link.code}</td>
                  <td className="p-3 truncate max-w-xs">
                    <a
                      href={link.targetUrl}
                      className="text-blue-600 hover:underline cursor-pointer truncate max-w-xs block"
                      target="_blank"
                    >
                      {link.targetUrl}
                    </a>
                  </td>
                  <td className="p-3">{link.totalClicks}</td>
                  <td className="p-3">{link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "Never"}</td>
                  <td className="p-3 text-blue-400 hover:underline cursor-pointer select-all truncate max-w-xs">{BASE_URL}/{link.code}</td>
                  <td className="p-3"><button
                    onClick={() => handleCopy(link.code)}
                    className="px-2 py-1 text-md bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition cursor-pointer"
                  >
                    Copy
                  </button></td>
                  <td className="p-3">
                    <button
                      className="px-2 py-1 text-md bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition cursor-pointer"
                      onClick={async () => {
                        await fetch(`/api/links/${link.code}`, {
                          method: "DELETE",
                        });
                        fetchLinks();
                      }}
                    >
                      Delete
                    </button>
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/dashboard/${link.code}`}
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-800 text-white rounded-lg text-md shadow transition cursor-pointer"
                    >
                      Analytics
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Desktop Modal */}
      <AddShortUrlModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Create New Short URL</h2>
        {FormComponent}
      </AddShortUrlModal>
    </main>
  );
}
