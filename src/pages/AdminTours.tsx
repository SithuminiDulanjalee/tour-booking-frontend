import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createTour, deleteTour, getAdminTours, updateTour } from "../service/tour"

const CATEGORIES = ["Adventure", "Cultural", "Beach", "Wildlife", "General"]

const emptyForm = {
  title: "",
  description: "",
  price: "",
  duration: "",
  location: "",
  image: "",
  maxGroupSize: "",
  availableSlots: "",
  itinerary: "",
  category: "General",
  isActive: true
}

const AdminTours = () => {
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTour, setEditingTour] = useState<any | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const fetchTours = () => {
    setLoading(true)
    getAdminTours()
      .then((res) => setTours(res.data))
      .catch(() => setTours([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTours()
  }, [])

  const openCreate = () => {
    setEditingTour(null)
    setForm(emptyForm)
    setError("")
    setShowModal(true)
  }

  const openEdit = (tour: any) => {
    setEditingTour(tour)
    setForm({
      title: tour.title,
      description: tour.description,
      price: String(tour.price),
      duration: String(tour.duration),
      location: tour.location,
      image: tour.image || "",
      maxGroupSize: String(tour.maxGroupSize),
      availableSlots: String(tour.availableSlots),
      itinerary: tour.itinerary?.join(", ") || "",
      category: tour.category,
      isActive: tour.isActive
    })
    setError("")
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.description || !form.price || !form.duration || !form.location || !form.maxGroupSize || !form.availableSlots) {
      setError("Please fill all required fields.")
      return
    }

    setSaving(true)
    setError("")

    const payload = {
      ...form,
      price: Number(form.price),
      duration: Number(form.duration),
      maxGroupSize: Number(form.maxGroupSize),
      availableSlots: Number(form.availableSlots),
      itinerary: form.itinerary
        ? form.itinerary.split(",").map((s) => s.trim()).filter(Boolean)
        : []
    }

    try {
      if (editingTour) {
        await updateTour(editingTour._id, payload)
      } else {
        await createTour(payload)
      }
      setShowModal(false)
      fetchTours()
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save tour.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tour?")) return
    try {
      await deleteTour(id)
      fetchTours()
    } catch {
      alert("Failed to delete tour.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/admin")}
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
                <span className="text-slate-950 text-xs font-black">VL</span>
              </div>
              <span className="font-bold text-lg tracking-tight">VoyaLink</span>
            </div>
            <span className="rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs px-3 py-1">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin")}
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => navigate("/admin/bookings")}
              className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition"
            >
              Bookings
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs font-semibold">
              Admin
            </p>
            <h1 className="mt-1 text-3xl font-bold">Manage Tours</h1>
          </div>
          <button
            onClick={openCreate}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:opacity-90 transition"
          >
            + Add Tour
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Tour</th>
                  <th className="px-6 py-4 text-left">Location</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Slots</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tours.map((tour) => (
                  <tr key={tour._id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium">{tour.title}</p>
                      <p className="text-slate-400 text-xs">{tour.category}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{tour.location}</td>
                    <td className="px-6 py-4 text-cyan-400 font-semibold">LKR {tour.price}</td>
                    <td className="px-6 py-4 text-slate-400">{tour.availableSlots}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          tour.isActive
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {tour.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(tour)}
                          className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-500/20 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tour._id)}
                          className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tours.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                No tours yet. Click "+ Add Tour" to get started.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-5">
              {editingTour ? "Edit Tour" : "Add New Tour"}
            </h2>

            <div className="space-y-3">
              {[
                { label: "Title *", key: "title", type: "text" },
                { label: "Location *", key: "location", type: "text" },
                { label: "Price (LKR) *", key: "price", type: "float" },
                { label: "Duration (days) *", key: "duration", type: "number" },
                { label: "Max Group Size *", key: "maxGroupSize", type: "number" },
                { label: "Available Slots *", key: "availableSlots", type: "number" },
                { label: "Image URL", key: "image", type: "text" }
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs text-slate-400 mb-1 block">{field.label}</label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 transition"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 transition"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 transition resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Itinerary (comma separated)
                </label>
                <textarea
                  value={form.itinerary}
                  onChange={(e) => setForm((prev) => ({ ...prev, itinerary: e.target.value }))}
                  rows={2}
                  placeholder="Day 1: Arrive, Day 2: City tour, ..."
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 transition resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 accent-emerald-400"
                />
                <label htmlFor="isActive" className="text-sm text-slate-300">
                  Active (visible to users)
                </label>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-white/10 bg-slate-800 py-2.5 text-sm hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-2.5 text-sm font-semibold text-slate-950 hover:opacity-90 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : editingTour ? "Update Tour" : "Create Tour"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTours