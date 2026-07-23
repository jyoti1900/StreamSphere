"use client";

import { useEffect, useState } from "react";
import {
  adminBtnDanger,
  adminBtnSecondary,
  adminInput,
  adminModal,
  adminModalOverlay,
  adminTableHead,
  adminTableRow,
  adminTableWrap,
} from "../adminStyles";
import { adminToast } from "../components/adminToast";
import { ADMIN_API_BASE_URL, getAdminAuthHeaders } from "../lib/adminApi";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  status: string;
  lastLoginAt: string;
};

function getAuthHeaders(): HeadersInit {
  return getAdminAuthHeaders();
}

function normalizeUsers(data: unknown): User[] {
  let list: any[] = [];

  if (Array.isArray(data)) {
    list = data;
  } else if (data && typeof data === "object") {
    const obj = data as Record<string, any>;
    if (Array.isArray(obj.data)) list = obj.data;
    else if (Array.isArray(obj.users)) list = obj.users;
    else if (Array.isArray(obj.data?.users)) list = obj.data.users;
    else if (Array.isArray(obj.data?.data)) list = obj.data.data;
  }

  if (!Array.isArray(list)) return [];

  return list
    .filter((u) => !u?.isDeleted)
    .map((u) => ({
      id: String(u.id || u._id || ""),
      firstName: u.firstName ?? "",
      lastName: u.lastName ?? "",
      email: u.email ?? "",
      phone: u.phone != null ? String(u.phone) : "",
      password: u.password ?? "",
      status: u.status ?? u.userStatus ?? "",
      lastLoginAt: u.lastLoginAt ?? u.last_login_at ?? "",
    }))
    .filter((u) => u.id);
}

// API FUNCTIONS
const getUsers = async () => {
  const res = await fetch(`${ADMIN_API_BASE_URL}/users/list`, {
    headers: getAuthHeaders(),
  });

  const result = await res.json().catch(() => null);
  if (!res.ok) {
    const detail =
      result?.message ||
      result?.error ||
      (typeof result === "string" ? result : JSON.stringify(result)) ||
      res.statusText;
    throw new Error(`getUsers failed: ${res.status} ${detail}`);
  }

  return normalizeUsers(result);
};
const parseErrorResponse = (errorText: string): string => {
    try {
        const json = JSON.parse(errorText);
        const msg = json.message || json.error;
        if (Array.isArray(msg)) return msg.join(", ");
        return msg || errorText;
    } catch {
        return errorText || "Unknown error";
    }
};

const deleteUser = async (id: string) => {
    if (!id) throw new Error("User ID is required for deletion");

    const performDelete = async (url: string, routeType: string = 'path') => {
        try {
            const res = await fetch(url, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });

            if (res.ok) {
                const result = res.headers.get('content-length') && res.headers.get('content-length') !== '0'
                    ? await res.json()
                    : { success: true };
                console.log(`deleteUser ${routeType} route succeeded`);
                return result;
            }

            const errorText = await res.text();
            const parsedError = parseErrorResponse(errorText);
            console.error(`deleteUser ${routeType} route failed:`, { status: res.status, error: parsedError });
            throw { status: res.status, statusText: res.statusText, errorText: parsedError };
        } catch (err: any) {
            if (err?.status) throw err;
            console.error(`deleteUser ${routeType} network error:`, err);
            throw { status: 0, statusText: 'Network Error', errorText: err.message };
        }
    };

    try {
        return await performDelete(`${ADMIN_API_BASE_URL}/users/delete/${id}`, 'path');
    } catch (err: any) {
        console.warn('deleteUser path route failed, trying query param route', err);
        if (err?.status === 404) {
            try {
                return await performDelete(`${ADMIN_API_BASE_URL}/users/delete?id=${encodeURIComponent(id)}`, 'query');
            } catch (innerErr: any) {
                const message = innerErr?.errorText || 'Failed to delete user';
                console.error('deleteUser query route failed:', message);
                throw new Error(message);
            }
        }
        throw new Error(err?.errorText || 'Failed to delete user');
    }
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // FETCH USERS FROM API
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const normalizedUsers = await getUsers();
            console.log('Setting users array:', normalizedUsers);
            setUsers(normalizedUsers);
        } catch (error: any) {
            const errorMsg = error?.message || 'Failed to load users';
            console.error('fetchUsers error:', errorMsg);
            setUsers([]);
            showToast(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) {
            console.error('handleDelete: invalid user id', deleteId);
            showToast("Cannot delete: invalid user ID");
            return;
        }

        try {
            console.log('Deleting user:', deleteId);

            await deleteUser(deleteId);

            console.log('User deleted successfully:', deleteId);

            showToast("User deleted successfully");

            await fetchUsers();
        } catch (error: any) {
            const errorMsg = error?.message || "Failed to delete user";
            console.error('handleDelete error:', errorMsg);
            showToast(errorMsg);
        } finally {
            setDeleteModalOpen(false);
            setDeleteId(null);
        }
    };

    const showToast = (message: string) => adminToast.show(message);

    // Filter Logic for Search Bar
    const filteredUsers = users.filter(user =>
        `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Search name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={adminInput}
                    />
                </div>
            </div>

            <div className={adminTableWrap}>
                <table className="w-full border-collapse text-left text-sm">
                    <thead className={adminTableHead}>
                        <tr>
                            <th className="p-4 font-semibold">First Name</th>
                            <th className="p-4 font-semibold">Last Name</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Phone</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Last Login</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-zinc-400">
                                    Loading users...
                                </td>
                            </tr>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <tr key={user.id ? user.id : `user-${index}`} className={adminTableRow}>
                                    <td className="p-4 whitespace-nowrap">{user.firstName}</td>
                                    <td className="p-4 whitespace-nowrap">{user.lastName}</td>
                                    <td className="p-4 whitespace-nowrap text-zinc-300">{user.email}</td>
                                    <td className="p-4 whitespace-nowrap text-zinc-300">{user.phone}</td>
                                    <td className="p-4 whitespace-nowrap text-zinc-300">{user.status || 'N/A'}</td>
                                    <td className="p-4 whitespace-nowrap text-zinc-300">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setDeleteId(user.id);
                                                    setDeleteModalOpen(true);
                                                }}
                                                className={adminBtnDanger}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-zinc-500 italic">
                                    {searchTerm ? "No users found matching your search." : "No users available."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {deleteModalOpen && (
                <div className={adminModalOverlay}>
                    <div className={`${adminModal} max-w-md`}>

                        {/* Warning Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center">
                                <span className="text-3xl">⚠️</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-center text-white mb-3">
                            Delete User
                        </h2>

                        {/* Message */}
                        <p className="text-gray-400 text-center leading-relaxed mb-6">
                            Are you sure you want to delete this user?
                            <br />
                            This action cannot be undone.
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setDeleteId(null);
                                }}
                                className={`${adminBtnSecondary} flex-1 py-3`}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className={`${adminBtnDanger} flex-1 py-3`}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}