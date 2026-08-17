import { createFileRoute } from "@tanstack/react-router";
import {
  usePackages,
  useUpdatePackage,
  useCreatePackage,
  type Package,
} from "@/hooks/use-packages";
import { useState } from "react";
import { showToast } from "@/components/nna/Toast";

export const Route = createFileRoute("/admin/packages")({
  component: PackagesAdminPage,
});

function PackagesAdminPage() {
  const { data: packages, isLoading } = usePackages(true);
  const [editingPkg, setEditingPkg] = useState<Partial<Package> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [disablePkgId, setDisablePkgId] = useState<string | null>(null);
  const updatePackage = useUpdatePackage();
  const createPackage = useCreatePackage();

  const handleEdit = (pkg: Package) => {
    setEditingPkg({ ...pkg });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingPkg({
      title: "",
      location: "",
      photo: "",
      emoji: "🏔️",
      price_pln: 0,
      price_eur: 0,
      included: "Equipment included",
      duration: "1 Day",
      desc_text: "",
      itinerary: "",
      activity: "Hiking",
      price_range: "Under 400",
      duration_tag: "Weekend (2-3 days)",
      difficulty: "Beginner",
      show_price: true,
      coming_soon: false,
      priority: 0,
      is_disabled: false,
      is_hidden: false,
      badges: [],
      tags: [],
      features: [],
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPkg?.id) {
        await updatePackage.mutateAsync(editingPkg as Package);
        showToast("✅ Package updated!");
      } else {
        await createPackage.mutateAsync(editingPkg as Omit<Package, "id">);
        showToast("✅ Package created!");
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast("❌ Failed to save package");
    }
  };

  const handleToggleStatus = async (pkg: Package) => {
    if (pkg.is_disabled) {
      // Re-enable
      await updatePackage.mutateAsync({ id: pkg.id, is_disabled: false, is_hidden: false });
      showToast("✅ Package enabled!");
    } else {
      // Prompt for how to disable
      setDisablePkgId(pkg.id);
      setIsDisableModalOpen(true);
    }
  };

  const confirmDisable = async (hide: boolean) => {
    if (!disablePkgId) return;
    try {
      await updatePackage.mutateAsync({ id: disablePkgId, is_disabled: true, is_hidden: hide });
      showToast("✅ Package disabled!");
    } catch (err) {
      showToast("❌ Failed to update package");
    }
    setIsDisableModalOpen(false);
    setDisablePkgId(null);
  };

  if (isLoading) {
    return <div className="p-8">Loading packages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 font-['Montserrat']">Manage Packages</h2>
        <button
          onClick={handleCreate}
          className="bg-[#0f2266] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a3699] transition-colors"
        >
          + Create New Package
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages?.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-lg object-cover" src={pkg.photo} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <span>{pkg.emoji}</span>
                        {pkg.title}
                      </div>
                      <div className="text-sm text-gray-500">{pkg.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-semibold">{pkg.price_pln} PLN</div>
                  {pkg.price_eur && (
                    <div className="text-xs text-gray-500">{pkg.price_eur} EUR</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pkg.priority}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pkg.is_disabled ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {pkg.is_disabled
                      ? pkg.is_hidden
                        ? "Disabled & Hidden"
                        : "Disabled"
                      : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleToggleStatus(pkg)}
                    className={`mr-4 ${pkg.is_disabled ? "text-green-600 hover:text-green-900" : "text-red-600 hover:text-red-900"}`}
                  >
                    {pkg.is_disabled ? "Enable" : "Disable"}
                  </button>
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="text-[#0f2266] hover:text-[#1a3699]"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold font-['Montserrat']">
                {editingPkg?.id ? "Edit Package" : "Create Package"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="package-form" onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        value={editingPkg?.title || ""}
                        onChange={(e) => setEditingPkg({ ...editingPkg, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        value={editingPkg?.location || ""}
                        onChange={(e) => setEditingPkg({ ...editingPkg, location: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="w-24">
                        <label className="block text-sm font-medium text-gray-700">Emoji</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          value={editingPkg?.emoji || ""}
                          onChange={(e) => setEditingPkg({ ...editingPkg, emoji: e.target.value })}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Activity Type
                        </label>
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          value={editingPkg?.activity || ""}
                          onChange={(e) =>
                            setEditingPkg({ ...editingPkg, activity: e.target.value })
                          }
                        >
                          <option>Kayaking</option>
                          <option>Surfing</option>
                          <option>Skiing</option>
                          <option>Hiking</option>
                          <option>Camping</option>
                          <option>City Tours</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Main Photo URL
                      </label>
                      <input
                        type="url"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        value={editingPkg?.photo || ""}
                        onChange={(e) => setEditingPkg({ ...editingPkg, photo: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Price (PLN)
                        </label>
                        <input
                          type="number"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          value={editingPkg?.price_pln || 0}
                          onChange={(e) =>
                            setEditingPkg({ ...editingPkg, price_pln: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Price (EUR)
                        </label>
                        <input
                          type="number"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          value={editingPkg?.price_eur || 0}
                          onChange={(e) =>
                            setEditingPkg({ ...editingPkg, price_eur: Number(e.target.value) })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Duration</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          value={editingPkg?.duration || ""}
                          onChange={(e) =>
                            setEditingPkg({ ...editingPkg, duration: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Priority (Higher=First)
                        </label>
                        <input
                          type="number"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          value={editingPkg?.priority || 0}
                          onChange={(e) =>
                            setEditingPkg({ ...editingPkg, priority: Number(e.target.value) })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Travel Date (String)
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        placeholder="e.g. 26 April 2026"
                        value={editingPkg?.trip_date || ""}
                        onChange={(e) =>
                          setEditingPkg({ ...editingPkg, trip_date: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Short Description
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        value={editingPkg?.desc_text || ""}
                        onChange={(e) =>
                          setEditingPkg({ ...editingPkg, desc_text: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Itinerary (Rich Text / HTML)
                      </label>
                      <textarea
                        rows={8}
                        placeholder="<h2>Day 1</h2><p>...</p>"
                        className="font-mono text-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-gray-50"
                        value={editingPkg?.itinerary || ""}
                        onChange={(e) =>
                          setEditingPkg({ ...editingPkg, itinerary: e.target.value })
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use HTML tags for formatting (h2, h3, p, ul, li).
                      </p>
                    </div>

                    <div className="flex gap-6 mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                          checked={editingPkg?.show_price || false}
                          onChange={(e) =>
                            setEditingPkg({ ...editingPkg, show_price: e.target.checked })
                          }
                        />
                        <span className="ml-2 text-sm text-gray-700">Show Price</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                          checked={editingPkg?.coming_soon || false}
                          onChange={(e) =>
                            setEditingPkg({ ...editingPkg, coming_soon: e.target.checked })
                          }
                        />
                        <span className="ml-2 text-sm text-gray-700">Coming Soon</span>
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="package-form"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0f2266] hover:bg-[#1a3699]"
              >
                Save Package
              </button>
            </div>
          </div>
        </div>
      )}

      {isDisableModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Disable Package</h3>
            <p className="text-sm text-gray-600 mb-6">
              You are about to disable this package. How should it appear on the public site?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => confirmDisable(false)}
                className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 flex items-start gap-3"
              >
                <div className="mt-1 text-gray-400">👁️</div>
                <div>
                  <div className="font-medium text-gray-900">Keep visible (Disabled state)</div>
                  <div className="text-xs text-gray-500">
                    Shows on homepage, but "Book Now" buttons are grayed out and unclickable.
                  </div>
                </div>
              </button>
              <button
                onClick={() => confirmDisable(true)}
                className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 flex items-start gap-3"
              >
                <div className="mt-1 text-gray-400">👻</div>
                <div>
                  <div className="font-medium text-gray-900">Hide from public list</div>
                  <div className="text-xs text-gray-500">
                    Completely hidden from the homepage and trips list.
                  </div>
                </div>
              </button>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setIsDisableModalOpen(false);
                  setDisablePkgId(null);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
