import { useRef, useState, useEffect } from "react";
import type { Restroom, RestroomFormData } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { useRestrooms } from "../../hooks/useRestrooms";
import { useLeafletMap } from "../../hooks/useLeafletMap";
import RestroomModal from "./components/RestroomModal";
import RestroomCard from "./components/RestroomCard";
import AuthModal from "./components/AuthModal";
import { LegendRow } from "../../components/LegendRow";
import { logoutApi } from "../../api/user";

export default function MapView() {
  const mapContainerRef = useRef<HTMLDivElement>(null!);
  const { user, accessToken, refreshToken, login, updateTokens, logout } = useAuth();

  const authCallbacks = accessToken
    ? { token: accessToken, onRefresh: updateTokens, onLogout: logout }
    : null;
  const { restrooms, loading, error, setError, fetch, add, edit, remove } = useRestrooms();

  const [selectedRestroom, setSelectedRestroom] = useState<Restroom | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [editTarget, setEditTarget] = useState<Restroom | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pendingLatLng, setPendingLatLng] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { syncMarkers, setPendingPin, flyTo } = useLeafletMap(mapContainerRef, {
    onMoveEnd: fetch,
    onMapClick: (lat, lng) => {
      setPendingLatLng({ latitude: lat, longitude: lng });
      setSelectedRestroom(null);
      setEditTarget(null);
    },
    onMarkerClick: (r, x, y) => {
      setPopupPos({ x, y });
      setSelectedRestroom(r);
      setPendingLatLng(null);
    },
    getOwnerOf: (r) => r.createdBy === user?.userId,
  });

  // Sync markers when restrooms or user changes
  useEffect(() => {
    const bounds = syncMarkers(restrooms);
    if (bounds) {
      const count = restrooms.filter(
        (r) =>
          isFinite(Number(r.latitude)) &&
          isFinite(Number(r.longitude)) &&
          bounds.contains([Number(r.latitude), Number(r.longitude)]),
      ).length;
      setVisibleCount(count);
    }
  }, [restrooms, syncMarkers, user]);

  // Sync pending pin
  useEffect(() => {
    setPendingPin(pendingLatLng);
  }, [pendingLatLng, setPendingPin]);

  const [visibleCount, setVisibleCount] = useState(0);

  const requireAuth = (action: () => void) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    action();
  };

  const handleAdd = async (data: RestroomFormData) => {
    if (!authCallbacks) return;
    await add(data, authCallbacks);
    setPendingLatLng(null);
  };

  const handleEdit = async (data: RestroomFormData) => {
    if (!authCallbacks || !editTarget) return;
    await edit(editTarget.restroomId, data, authCallbacks);
    setEditTarget(null);
    setSelectedRestroom(null);
  };

  const handleDelete = async (id: string) => {
    if (!authCallbacks || !confirm("Delete this restroom?")) return;
    await remove(id, authCallbacks);
    setSelectedRestroom(null);
  };

  const handleLogout = async () => {
    if (accessToken && refreshToken) {
      await logoutApi(accessToken, refreshToken).catch(() => {});
    }
    logout();
  };

  const filteredRestrooms = restrooms.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.address?.toLowerCase().includes(search.toLowerCase()),
  );

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setPendingLatLng(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 pointer-events-none">
        {/* Logo */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white dark:bg-gray-900 shadow-md rounded-2xl px-4 py-2.5 border border-gray-100 dark:border-gray-800">
          <span className="text-xl">🚻</span>
          <button onClick={() => window.location.href = '/'} className="font-bold text-teal-700 dark:text-teal-400 text-sm hidden sm:block cursor-pointer">
            RestroomFinder
          </button>
        </div>

        {/* Search */}
        <div className="pointer-events-auto flex-1 max-w-md relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search restrooms…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-md text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {search && filteredRestrooms.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              {filteredRestrooms.slice(0, 5).map((r) => (
                <button
                  key={r.restroomId}
                  onClick={() => {
                    flyTo(Number(r.latitude), Number(r.longitude));
                    setSearch("");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-50 dark:border-gray-800 last:border-0 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {r.name}
                  </p>
                  {r.address && (
                    <p className="text-xs text-gray-400 truncate">
                      {r.address}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User */}
        {user ? (
          <div className="pointer-events-auto flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-md rounded-2xl px-3 py-2">
            <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {user.username[0].toUpperCase()}
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-200 hidden sm:block max-w-[80px] truncate">
              {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition-colors ml-1"
              title="Sign out"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAuthOpen(true)}
            className="pointer-events-auto absolute top-4 right-4 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-2xl shadow-md transition-colors"
          >
            Sign in
          </button>
        )}
      </div>

      {/* Summary Badge */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 rounded-full px-5 py-2 flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${loading ? "bg-gray-300" : "bg-teal-500"}`}
          />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {loading
              ? "Loading…"
              : `${visibleCount} restroom${visibleCount !== 1 ? "s" : ""} in view`}
          </span>
        </div>
      </div>

      {/* Error toast */}
      {error && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-sm px-4 py-2 rounded-xl shadow-md flex items-center gap-2">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-1 text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Map */}
      <div ref={mapContainerRef} className="flex-1 w-full z-10" />

      {/* Popup Card */}
      {selectedRestroom && (
        <div
          className="absolute z-40 pointer-events-auto"
          style={{
            left: Math.min(popupPos.x, window.innerWidth - 300),
            top: Math.max(popupPos.y - 220, 80),
          }}
        >
          <RestroomCard
            restroom={selectedRestroom}
            currentUserId={user?.userId ?? ""}
            onEdit={(r) => {
              setEditTarget(r);
              setModalOpen(true);
              setSelectedRestroom(null);
            }}
            onDelete={handleDelete}
            onClose={() => setSelectedRestroom(null)}
          />
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-12 left-4 z-30 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 px-3 py-2.5 text-xs space-y-1.5">
        <p className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-[10px]">
          Legend
        </p>
        <LegendRow color="#0d9488" label="Free" />
        <LegendRow color="#6366f1" label="Paid" />
        <LegendRow color="#f59e0b" label="Your listing" border />
      </div>

      {/* FAB */}
      {pendingLatLng && (
        <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-2">
          <button
            onClick={() => requireAuth(() => setModalOpen(true))}
            className="flex items-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold rounded-2xl shadow-lg shadow-teal-300 dark:shadow-teal-900 transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add restroom here
          </button>
          <button
            onClick={() => setPendingLatLng(null)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium rounded-xl shadow hover:bg-gray-50 dark:hover:bg-gray700 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Modals */}
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onLogin={(session) => {
            login(session);
            setAuthOpen(false);
          }}
        />
      )}
      {modalOpen && (
        <RestroomModal
          onClose={closeModal}
          onSubmit={editTarget ? handleEdit : handleAdd}
          initialData={editTarget}
          defaultCoords={editTarget ? null : pendingLatLng}
        />
      )}
    </div>
  );
}
