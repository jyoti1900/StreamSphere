"use client";

import { useEffect, useState } from "react";
import {
  adminBtnDanger,
  adminBtnEdit,
  adminBtnPrimary,
  adminBtnSecondary,
  adminFab,
  adminInput,
  adminModal,
  adminModalOverlay,
  adminTableHead,
  adminTableRow,
  adminTableWrap,
} from "../adminStyles";
import { adminToast } from "../components/adminToast";
import {
  ADMIN_API_BASE_URL,
  getAdminAuthHeaders,
  uploadAdminFile,
} from "../lib/adminApi";

type Category = {
  _id: string;
  name: string;
  image?: {
    _id?: string;
    key?: string;
    mime_type?: string;
    status?: string;
    type?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    signedUrl?: string;
    url?: string;
  } | string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function getAuthHeaders(): HeadersInit {
  return getAdminAuthHeaders();
}

function normalizeCategories(data: unknown): Category[] {
  const list = Array.isArray(data)
    ? data
    : (data as any)?.categories || (data as any)?.data || [];

  if (!Array.isArray(list)) return [];

  return list.filter((category) => !category?.isDeleted);
}

function getCategoryImageUrl(image: Category["image"] | string | null | undefined): string {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.signedUrl || (image as any).url || "";
}

function getCategoryImageDocumentId(image: any): string {
  if (!image) return "";
  if (typeof image === "string") return image;
  return String(image.documentId || image._id || image.id || "");
}

// API FUNCTIONS
const getCategories = async () => {
  const res = await fetch(`${ADMIN_API_BASE_URL}/movie-catagory/list`, {
    headers: getAuthHeaders(),
  });

  const result = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = result?.message || result?.error || JSON.stringify(result) || res.statusText;
    throw new Error(`Fetch failed: ${res.status} ${detail}`);
  }

  return normalizeCategories(result);
};

const createCategory = async (data: any) => {
    const res = await fetch(`${ADMIN_API_BASE_URL}/movie-catagory/create`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    const result = await res.json().catch(() => null);
    if (!res.ok) {
        const detail = result?.message || result?.error || JSON.stringify(result) || res.statusText;
        throw new Error(`Create failed: ${res.status} ${detail}`);
    }

    return result;
};

const updateCategory = async (id: string, data: any) => {
    const res = await fetch(`${ADMIN_API_BASE_URL}/movie-catagory/update/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    const result = await res.json().catch(() => null);
    if (!res.ok) {
        const detail = result?.message || result?.error || JSON.stringify(result) || res.statusText;
        throw new Error(`Update failed: ${res.status} ${detail}`);
    }

    return result;
};

const deleteCategory = async (id: string) => {
    const res = await fetch(`${ADMIN_API_BASE_URL}/movie-catagory/delete/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    const result = await res.json().catch(() => null);
    if (!res.ok) {
        const detail = result?.message || result?.error || JSON.stringify(result) || res.statusText;
        throw new Error(`Delete failed: ${res.status} ${detail}`);
    }

    return result;
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [mounted, setMounted] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    const emptyFormData = {
        name: "",
        image: null as any,
        imageDocumentId: "",
        imagePreviewUrl: "",
    };

    const [formData, setFormData] = useState(emptyFormData);

    const [loading, setLoading] = useState(true);

    // FETCH CATEGORIES
    useEffect(() => {
        fetchCategories();
        setMounted(true);
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
            showToast("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        setFormData(emptyFormData);
        setModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            image: category.image,
            imageDocumentId: getCategoryImageDocumentId(category.image),
            imagePreviewUrl: getCategoryImageUrl(category.image),
        });
        setModalOpen(true);
    };

    // DELETE
    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteCategory(deleteId);

            showToast("Category deleted successfully");

            fetchCategories();
        } catch (error) {
            console.error(error);
            showToast("Failed to delete category");
        } finally {
            setDeleteModalOpen(false);
            setDeleteId(null);
        }
    };

    // CREATE + UPDATE
    const handleSubmit = async () => {
        if (!formData.name) {
            showToast("Category name is required");
            return;
        }
        const imageId =
            formData.imageDocumentId || getCategoryImageDocumentId(formData.image);

        if (!imageId) {
            showToast("Please upload an image");
            return;
        }

        const payload = {
            name: formData.name,
            image: imageId,
        };

        try {
            if (editingCategory) {
                await updateCategory(editingCategory._id, payload);
                showToast("Category updated successfully");
            } else {
                await createCategory(payload);
                showToast("Category created successfully");
            }

            fetchCategories();
            setModalOpen(false);

        } catch (error) {
            console.error(error);
            showToast("Failed to save category");
        }
    };

    const showToast = (message: string) => adminToast.show(message);

    return (
        <div className="space-y-6">
            {loading ? (
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 py-12 text-center text-zinc-400">
                    Loading categories...
                </div>
            ) : categories.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 py-12 text-center text-zinc-400">
                    No categories found.
                </div>
            ) : (
                <div className={adminTableWrap}>
                    <table className="w-full text-sm table-fixed">
                        <colgroup>
                            <col className="w-32" />
                            <col className="w-1/2" />
                            <col className="w-1/4" />
                        </colgroup>
                        <thead className={adminTableHead}>
                            <tr>
                                <th className="p-3 text-center">Categories Poster</th>
                                <th className="p-3 text-center">Title</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.map((category, index) => (
                                <tr
                                    key={category._id || `${category.name}-${index}`}
                                    className={adminTableRow}
                                >
                                    <td className="p-3 flex items-center justify-center">
                                        {getCategoryImageUrl(category.image) ? (
                                            <div className="w-20 h-20 rounded-xl bg-zinc-800 overflow-hidden ring-1 ring-white/10">
                                                <img
                                                    src={getCategoryImageUrl(category.image)}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                                                No image
                                            </div>
                                        )}
                                    </td>

                                    <td className="p-3 text-center">{category.name}</td>

                                    <td className="p-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className={adminBtnEdit}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setDeleteId(category._id);
                                                    setDeleteModalOpen(true);
                                                }}
                                                className={adminBtnDanger}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <button
                onClick={openCreateModal}
                className={adminFab}
            >
                + Add Categories
            </button>

            {modalOpen && (
                <div className={adminModalOverlay}>
                    <div className={`${adminModal} max-w-lg max-h-[90vh] overflow-y-auto space-y-4`}>
                        <h2 className="text-xl font-bold">
                            {editingCategory ? "Edit Categories" : "Create Categories"}
                        </h2>

                        <input
                            placeholder="Title"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className={adminInput}
                        />

                        {/* Poster Upload */}
                        <div>
                            <label className="block text-sm mb-2">Poster</label>

                            <label
                              className={`flex items-center justify-center w-full p-3 rounded-xl border border-dashed border-white/15 cursor-pointer transition ${
                                imageUploading
                                  ? "bg-zinc-700 text-zinc-300"
                                  : "bg-zinc-800/50 hover:bg-zinc-800"
                              }`}
                            >
                                {imageUploading ? "Uploading Poster..." : "Upload Poster"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={imageUploading}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        setImageUploading(true);
                                        try {
                                            const uploadRes = await uploadAdminFile(
                                              file,
                                              "categories"
                                            );

                                            if (!uploadRes.documentId) {
                                              throw new Error(
                                                "Upload succeeded but document id is missing"
                                              );
                                            }

                                            setFormData({
                                              ...formData,
                                              image: uploadRes,
                                              imageDocumentId: uploadRes.documentId,
                                              imagePreviewUrl:
                                                uploadRes.signedUrl || uploadRes.url,
                                            });
                                            showToast("Image uploaded successfully");
                                        } catch (error: any) {
                                            console.error("Image upload failed", error);
                                            showToast(error?.message || "Image upload failed");
                                        } finally {
                                            setImageUploading(false);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                            </label>

                            {formData.imagePreviewUrl && (
                                <img
                                    src={formData.imagePreviewUrl}
                                    className="w-24 mt-3 rounded"
                                    alt="Preview"
                                />
                            )}
                        </div>

                        <div className="flex gap-3 pt-3">
                            <button
                                onClick={handleSubmit}
                                className={adminBtnPrimary}
                            >
                                Save
                            </button>

                            <button
                                onClick={() => setModalOpen(false)}
                                className={adminBtnSecondary}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                            Delete Category
                        </h2>

                        {/* Message */}
                        <p className="text-gray-400 text-center leading-relaxed mb-6">
                            Are you sure you want to delete this category?
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
                                className={`${adminBtnPrimary} flex-1 py-3`}
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