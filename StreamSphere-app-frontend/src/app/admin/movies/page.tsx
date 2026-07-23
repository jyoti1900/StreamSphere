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
import AdminHorizontalScroll from "../components/AdminHorizontalScroll";
import { adminToast } from "../components/adminToast";
import {
  ADMIN_API_BASE_URL,
  getAdminAuthHeaders,
  getAdminUploadHeaders,
  normalizeUploadedFile,
  uploadAdminFile,
} from "../lib/adminApi";

const formatDuration = (value: unknown) => {
    if (value === null || value === undefined || value === "") return "00:00:00";

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) return "00:00:00";

    const totalSeconds = Math.round(numericValue);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":")
};

type Movie = {
    id: string;
    title: string;
    poster: string;
    thumbnail: string;
    posterDocumentId?: string;
    thumbnailDocumentId?: string;
    duration: string;
    category: string;
    genre: string;
    director: string;
    cast: string;
    details: string;
    rating: string;

    // NEW VIDEO FIELDS
    videoKey?: string;
    videoDocumentId?: string;
    videoUrl?: string;
    uploadStatus?: "not_uploaded" | "uploading" | "uploaded" | "failed";
};

type PresignedPostResponse = {
    documentId: string;
    uploadUrl: string;
    fields: Record<string, string>;
    key: string;
};

export default function AdminMoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

    // VIDEO UPLOAD MODAL STATES
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgressText, setUploadProgressText] = useState("");
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewVideoUrl, setViewVideoUrl] = useState<string | null>(null);

    const emptyMovie: Movie = {
        id: "",
        title: "",
        poster: "",
        thumbnail: "",
        posterDocumentId: "",
        thumbnailDocumentId: "",
        duration: "",
        category: "",
        genre: "",
        director: "",
        cast: "",
        details: "",
        rating: "",
        videoKey: "",
        videoDocumentId: "",
        videoUrl: "",
        uploadStatus: "not_uploaded",
    };

    const [categoryList, setCategoryList] = useState<any[]>([]);
    const fetchCategories = async () => {
        try {
            //  FIXED: Spelled exactly as it is in your backend Swagger (catagory)
            const res = await fetch(`${ADMIN_API_BASE_URL}/movie-catagory/list`);
            const data = await res.json();

            console.log("RAW CATEGORIES API RESPONSE:", data);

            // Bulletproof extraction: works if it's an array directly, or inside a "categories" object
            const categoriesArray = Array.isArray(data) ? data : (data.categories || data.data || []);

            setCategoryList(categoriesArray);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            setCategoryList([]);
        }
    };

    const [formData, setFormData] = useState<Movie>(emptyMovie);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterUploading, setPosterUploading] = useState(false);
    const [thumbnailUploading, setThumbnailUploading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const isMongoId = (value: unknown) =>
        typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value);

    const extractDocumentId = (value: any) => {
        if (!value) return "";
        if (typeof value === "string") {
            return isMongoId(value) ? value : "";
        }

        const possibleId = value.documentId || value.id || value._id || value.docId || value.fileId;
        if (isMongoId(possibleId)) return possibleId;
        return "";
    };

    const extractImageUrl = (value: any) => {
        if (!value) return "";
        if (typeof value === "string") return value;
        if (typeof value === "object") {
            return value.signedUrl || value.url || value.posterUrl || value.thumbnailUrl || "";
        }
        return "";
    };

    // Demo poster constant - accessible throughout component
    const DEMO_POSTER = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80";

    useEffect(() => {
        fetchMovies();
        fetchCategories();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await fetch(`${ADMIN_API_BASE_URL}/movies/grouped`);
            const data = await res.json();
            const dataArray = Array.isArray(data) ? data : (data.data || data.movies || []);

            //  Added this helper to safely extract Cast, Details, and the Poster
            const processMovie = (movie: any, defaultGenre: string) => {

                // ------------------ POSTER ------------------
                const rawPoster = extractImageUrl(movie.posterimage) || extractImageUrl(movie.poster) || "";
                const posterDocumentId = extractDocumentId(movie.posterimage) || extractDocumentId(movie.poster);
                const isPosterFake = rawPoster.includes("00000000");
                const finalPoster = (rawPoster && !isPosterFake) ? rawPoster : DEMO_POSTER;


                // ------------------ THUMBNAIL (NEW) ------------------
                const rawThumbnail = extractImageUrl(movie.thumnailimage) || extractImageUrl(movie.thumbnail) || "";
                const thumbnailDocumentId = extractDocumentId(movie.thumnailimage) || extractDocumentId(movie.thumbnail);
                const isThumbnailFake = rawThumbnail.includes("00000000");
                const finalThumbnail = (rawThumbnail && !isThumbnailFake) ? rawThumbnail : DEMO_POSTER;


                // ------------------ CAST ------------------
                let finalCast = "N/A";
                if (Array.isArray(movie.cast) && movie.cast.length > 0) {
                    finalCast = movie.cast[0].name || movie.cast[0].character || "Unknown Actor";
                } else if (typeof movie.cast === "string") {
                    finalCast = movie.cast;
                }

                // ------------------ DIRECTOR ------------------
                let finalDirector = "N/A";
                if (Array.isArray(movie.directors) && movie.directors.length > 0) {
                    finalDirector = movie.directors[0];
                } else if (typeof movie.director === "string") {
                    finalDirector = movie.director;
                }

                return {
                    ...movie,
                    id: movie._id,
                    poster: finalPoster,
                    thumbnail: finalThumbnail, // ✅ NEW FIELD
                    posterDocumentId,
                    thumbnailDocumentId,
                    genre: movie.category || defaultGenre,
                    director: finalDirector,
                    cast: finalCast,
                    rating: movie.rating || movie.ageRating || "N/A",
                    details: movie.description || movie.details || "",
                    videoKey:
                        movie.videoKey ||
                        movie.video?.key ||
                        movie.video?.videoKey ||
                        movie.video?.s3Key ||
                        "",
                    uploadStatus: (movie.video || movie.videoKey || movie.video?.key) ? "uploaded" : "not_uploaded",
                };
            };

            let allMovies = [];
            if (dataArray.length > 0 && dataArray[0].title !== undefined) {
                allMovies = dataArray.map((movie: any) => processMovie(movie, "Unknown"));
            } else {
                const categoriesWithMovies = data.categories || dataArray;
                allMovies = categoriesWithMovies.flatMap((cat: any) => {
                    if (!Array.isArray(cat.movies)) return [];
                    return cat.movies.map((movie: any) => processMovie(movie, cat.name || cat.category || "Unknown"));
                });
            }

            setMovies(allMovies);
        } catch (err) {
            console.error("FETCH ERROR:", err);
        }
    };

    const openCreateModal = () => {
        setEditingMovie(null);
        setFormData(emptyMovie);
        setModalOpen(true);
    };

    const openEditModal = (movie: Movie) => {
        setEditingMovie(movie);

        // Ensure category is set to the ID (not name)
        let categoryToSet = movie.category;

        // If category looks like it might be a name instead of ID, try to find the ID
        if (categoryToSet && !isMongoId(categoryToSet) && categoryList.length > 0) {
            const foundCategory = categoryList.find((cat: any) =>
                cat.name === categoryToSet || cat.category === categoryToSet
            );
            if (foundCategory) {
                categoryToSet = foundCategory._id;
            }
        }

        setFormData({ ...movie, category: categoryToSet });
        setModalOpen(true);
    };

    const openUploadModal = (movie: Movie) => {
        setSelectedMovie(movie);
        setSelectedVideo(null);
        setUploadProgressText("");
        setUploadModalOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await fetch(`${ADMIN_API_BASE_URL}/movies/delete?itemId=${deleteId}`, {
                method: "DELETE",
                headers: getAdminAuthHeaders(),
            });

            showToast("Movie deleted successfully");

            fetchMovies();
        } catch (err) {
            console.error("Delete failed", err);
            showToast("Failed to delete movie");
        } finally {
            setDeleteModalOpen(false);
            setDeleteId(null);
        }
    };

    const handleSubmit = async () => {
        if (!formData.category) {
            showToast("Error: Please select a category first!");
            return;
        }

        try {
            const body = {
                title: formData.title || "Untitled",
                category: formData.category,
                description: formData.details || "No description provided",
                type: "movie",
                status: "draft",

                // Backend requires MongoDB document ids for images
                thumnailimage: formData.thumbnailDocumentId || extractDocumentId(formData.thumbnail) || "000000000000000000000000",
                posterimage: formData.posterDocumentId || extractDocumentId(formData.poster) || "000000000000000000000000",

                totalSeasons: 1,
                totalEpisodes: 1,
                releaseDate: "2024-01-01",
                ageRating: formData.rating || "U/A",

                audiolanguage: "English",
                availableLanguages: ["English"],
                subtitles: ["English"],
                country: "India",
                tags: ["test"],

                directors: formData.director ? [formData.director] : ["Unknown"],
                cast: formData.cast ? [{ name: formData.cast, role: "Actor" }] : [],
                relatedMovies: []
            };

            // THE FIX: Decide whether to Create or Update
            let url = `${ADMIN_API_BASE_URL}/movies/create`;
            let method = "POST";

            if (editingMovie && editingMovie.id) {
                url = `${ADMIN_API_BASE_URL}/movies/update?itemId=${editingMovie.id}`;
                method = "PUT";

                //  THE FIX FOR 409 CONFLICT:
                // If the title hasn't changed, don't send it, so the backend doesn't trigger the uniqueness bug.
                if (formData.title === editingMovie.title) {
                    delete body.title;
                }
            }

            const res = await fetch(url, {
                method: method,
                headers: getAdminAuthHeaders(),
                body: JSON.stringify(body),
            });

            const rawText = await res.text();

            if (res.ok) {
                await fetchMovies();
                showToast(editingMovie ? "Movie updated successfully!" : "Movie added successfully!");
                setModalOpen(false);
            } else {
                adminToast.error(`Backend rejected request (${res.status}): ${rawText}`);
                console.error("Backend error:", rawText);
            }
        } catch (err: any) {
            console.error("NETWORK ERROR:", err);
            adminToast.error(err?.message || "Network error");
        }
    };

    const showToast = (message: string) => adminToast.show(message);

    // -----------------------------
    // VIDEO UPLOAD LOGIC
    // -----------------------------
    const fetchStreamingUrl = async (movieId: string) => {
        const res = await fetch(`${ADMIN_API_BASE_URL}/movies/${movieId}/stream`, {
            method: "GET",
            headers: { accept: "application/json" },
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText || `Failed to fetch streaming URL (${res.status})`);
        }

        const data = await res.json();
        const url = data?.streamingUrl || data?.url || data?.data?.streamingUrl;
        if (!url || typeof url !== "string") {
            throw new Error("Streaming URL missing in response");
        }
        return url;
    };

    const getVideoDuration = (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement("video");
            video.preload = "metadata";
            video.onloadedmetadata = () => {
                URL.revokeObjectURL(video.src);
                resolve(Math.round(video.duration));
            };
            video.onerror = () => {
                reject(new Error("Failed to read video duration"));
            };
            video.src = URL.createObjectURL(file);
        });
    };

    const handleVideoUpload = async () => {
        if (!selectedMovie) {
            showToast("No movie selected");
            return;
        }

        if (!selectedVideo) {
            showToast("Please select a video file");
            return;
        }

        const duration = await getVideoDuration(selectedVideo);
        console.log("Video duration:", duration);

        if (selectedVideo.type !== "video/mp4") {
            showToast("Only MP4 video is allowed for now");
            return;
        }

        try {
            setUploading(true);
            setUploadProgressText("Uploading video...");

            // mark movie as uploading
            const uploadingMovies = movies.map((movie) =>
                movie.id === selectedMovie.id
                    ? { ...movie, uploadStatus: "uploading" as const }
                    : movie
            );
            setMovies(uploadingMovies);

            // STEP 1: Upload video via backend (/upload expects multipart + documentType)
            const uploadFormData = new FormData();
            uploadFormData.append("file", selectedVideo);
            uploadFormData.append("documentType", "movies");

            const uploadRes = await fetch(`${ADMIN_API_BASE_URL}/upload`, {
                method: "POST",
                headers: getAdminUploadHeaders(),
                body: uploadFormData,
            });

            const uploadJson = await uploadRes.json().catch(() => null);
            if (!uploadRes.ok) {
                const detail =
                    uploadJson?.message ||
                    uploadJson?.error ||
                    JSON.stringify(uploadJson) ||
                    (await uploadRes.text().catch(() => "")) ||
                    uploadRes.statusText;
                throw new Error(`Upload failed: ${uploadRes.status} ${detail}`);
            }

            // Backend upload response shape can vary; extract common fields
            console.log("Upload response JSON:", uploadJson);

            const normalizedUpload = normalizeUploadedFile(uploadJson);

            const deriveKeyFromUrl = (maybeUrl: unknown) => {
                if (!maybeUrl || typeof maybeUrl !== "string") return "";
                try {
                    const u = new URL(maybeUrl);
                    const path = decodeURIComponent(u.pathname || "");
                    return path.replace(/^\/+/, ""); // remove leading "/"
                } catch {
                    // if it's not a valid URL, last resort: strip query if present
                    const withoutQuery = maybeUrl.split("?")[0] || "";
                    return withoutQuery.replace(/^\/+/, "");
                }
            };

            const uploadedKey: string =
                normalizedUpload.key ||
                deriveKeyFromUrl(normalizedUpload.signedUrl) ||
                deriveKeyFromUrl(normalizedUpload.url) ||
                "";

            const uploadedDocumentId: string = normalizedUpload.documentId;

            if (!uploadedKey) {
                throw new Error(
                    "Upload succeeded but response did not include a file key (check console: 'Upload response JSON')"
                );
            }

            // STEP 2: Save key in movies service (required for /stream)
            setUploadProgressText("Saving video info...");
            const saveKeyRes = await fetch(`${ADMIN_API_BASE_URL}/movies/${selectedMovie.id}/video`, {
                method: "PATCH",
                headers: getAdminAuthHeaders(),
                body: JSON.stringify({
                    videoKey: uploadedKey,
                    duration,
                }),
            });

            if (!saveKeyRes.ok) {
                const errText = await saveKeyRes.text();
                throw new Error(errText || `Failed to save video key (${saveKeyRes.status})`);
            }

            setUploadProgressText("Generating streaming link...");
            const streamingUrl = await fetchStreamingUrl(selectedMovie.id);

            console.log("Uploaded key:", uploadedKey);
            console.log("Document ID:", uploadedDocumentId);

            // STEP 3: Save uploaded info into UI state
            const updatedMovies = movies.map((movie) =>
                movie.id === selectedMovie.id
                    ? {
                        ...movie,
                        videoKey: uploadedKey,
                        videoDocumentId: uploadedDocumentId,
                        videoUrl: streamingUrl,
                        uploadStatus: "uploaded" as const,
                    }
                    : movie
            );

            setMovies(updatedMovies);

            setUploadProgressText("Upload completed successfully");
            showToast("Movie video uploaded successfully");
            setUploadModalOpen(false);
            setSelectedVideo(null);
            setSelectedMovie(null);
        } catch (error) {
            console.error("Upload error:", error);

            if (selectedMovie) {
                const failedMovies = movies.map((movie) =>
                    movie.id === selectedMovie.id
                        ? {
                            ...movie,
                            uploadStatus: "failed" as const,
                        }
                        : movie
                );
                setMovies(failedMovies);
            }

            showToast(
                error instanceof Error
                    ? error.message
                    : "Video upload failed"
            );
        } finally {
            setUploading(false);
            setUploadProgressText("");
        }
    };

    const getUploadStatusBadge = (movie: Movie) => {
        switch (movie.uploadStatus) {
            case "uploaded":
                return (
                    <span className="px-2 py-1 rounded bg-green-600 text-xs">
                        Uploaded
                    </span>
                );
            case "uploading":
                return (
                    <span className="px-2 py-1 rounded bg-yellow-600 text-xs">
                        Uploading
                    </span>
                );
            case "failed":
                return (
                    <span className="px-2 py-1 rounded bg-red-600 text-xs">
                        Failed
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-1 rounded bg-gray-600 text-xs">
                        Not Uploaded
                    </span>
                );
        }
    };
    console.log("FINAL CATEGORY LIST:", JSON.stringify(categoryList, null, 2));

    const openViewModal = (movie: Movie) => {
        setViewVideoUrl(null);
        setViewModalOpen(true);

        fetchStreamingUrl(movie.id)
            .then((url) => setViewVideoUrl(url))
            .catch((err) => {
                console.error("Failed to load streaming URL:", err);
                showToast(err instanceof Error ? err.message : "Failed to load streaming URL");
                setViewModalOpen(false);
            });
    };

    //  HELPER: Takes the ID and finds the real category name
    const getCategoryName = (categoryId: string) => {
        if (!categoryList || categoryList.length === 0) return categoryId;
        const found = categoryList.find((cat: any) => cat._id === categoryId);
        return found ? (found.name || found.category) : categoryId;
    };
    return (
        <div className="space-y-6">
            {movies.length === 0 ? (
                <div className={`${adminTableWrap} py-16 text-center text-zinc-400`}>
                    No movies found. Click &quot;+ Add Movie&quot; to create one.
                </div>
            ) : (
                <div className={adminTableWrap}>
                    <AdminHorizontalScroll>
                        <table className="min-w-full text-sm border-collapse">
                            <thead className={adminTableHead}>
                                <tr>
                                    <th className="p-4 text-center whitespace-nowrap">Poster</th>
                                    <th className="p-4 text-center whitespace-nowrap">Thumbnail</th>
                                    <th className="p-4 text-center whitespace-nowrap">Title</th>
                                    <th className="p-4 text-center whitespace-nowrap">Duration</th>
                                    <th className="p-4 text-center whitespace-nowrap">Genre</th>
                                    <th className="p-4 text-center whitespace-nowrap">Director</th>
                                    <th className="p-4 text-center whitespace-nowrap">Cast</th>
                                    <th className="p-4 text-center whitespace-nowrap">Rating</th>
                                    <th className="p-4 text-center whitespace-nowrap">Video</th>
                                    <th className="p-4 text-center whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {movies.map((movie: any) => (
                                    <tr
                                        key={movie.id}
                                        className={`${adminTableRow} align-middle`}
                                    >
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center">
                                                {movie.poster && movie.poster !== "000000000000000000000000" && (
                                                    <img
                                                        src={movie.poster}
                                                        alt={movie.title}
                                                        className="h-[70px] w-[50px] rounded-md object-cover"
                                                    />
                                                )}
                                            </div>
                                        </td>

                                        <td className="p-4 text-center">
                                            <div className="flex justify-center">
                                                {movie.thumbnail && (
                                                    <img
                                                        src={movie.thumbnail}
                                                        alt="Thumbnail"
                                                        className="h-[70px] w-[50px] rounded-md object-cover"
                                                    />
                                                )}
                                            </div>
                                        </td>

                                        <td className="p-4 text-center whitespace-nowrap">{movie.title}</td>
                                        <td className="p-4 text-center whitespace-nowrap">{formatDuration(movie.duration)}</td>
                                        <td className="p-4 text-center whitespace-nowrap">{getCategoryName(movie.genre)}</td>
                                        <td className="p-4 text-center whitespace-nowrap">{movie.directors?.[0] || movie.director}</td>
                                        <td className="p-4 text-center whitespace-nowrap">{movie.cast}</td>
                                        <td className="p-4 text-center whitespace-nowrap">{movie.rating || "N/A"}</td>

                                        <td className="p-4 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                {getUploadStatusBadge(movie)}
                                                {movie.uploadStatus === "uploaded" && (
                                                    <button
                                                        onClick={() => openViewModal(movie)}
                                                        className="rounded border border-green-500/40 px-4 py-1 text-sm font-medium text-green-400 transition hover:bg-green-500/10"
                                                    >
                                                        View
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openUploadModal(movie)}
                                                    className="rounded border border-purple-500/40 px-4 py-1 text-sm font-medium text-purple-400 transition hover:bg-purple-500/10"
                                                >
                                                    {movie.uploadStatus === "uploaded" ? "Replace" : "Upload"}
                                                </button>
                                            </div>
                                        </td>

                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(movie)}
                                                    className={adminBtnEdit}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeleteId(movie.id);
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
                    </AdminHorizontalScroll>
                </div>
            )}

            {/* Floating Add Button */}
            <button
                onClick={openCreateModal}
                className={adminFab}
            >
                + Add Movie
            </button>

            {/* CREATE / EDIT MODAL */}
            {modalOpen && (
                <div className={`${adminModalOverlay} z-[9999]`}>
                    <div className={`${adminModal} max-w-lg max-h-[90vh] space-y-4 overflow-y-auto`}>
                        <h2 className="text-xl font-bold">
                            {editingMovie ? "Edit Movie" : "Create Movie"}
                        </h2>

                        <input
                            placeholder="Title"
                            value={formData.title || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            className={adminInput}
                        />

                        <select
                            value={formData.category || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                            className={adminInput}
                        >
                            <option value="">Select Category</option>
                            {categoryList.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name || cat.category}
                                </option>
                            ))}
                        </select>

                        <div>
                            <label className="mb-2 block text-sm">Poster</label>
                            <label
                                className={`flex w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/15 p-3 transition ${
                                    posterUploading
                                        ? "bg-zinc-700 text-zinc-300"
                                        : "bg-zinc-800/50 hover:bg-zinc-800"
                                }`}
                            >
                                {posterUploading ? "Uploading Poster..." : "Upload Poster"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={posterUploading}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        setPosterUploading(true);
                                        try {
                                            const data = await uploadAdminFile(file, "movies");
                                            setFormData((prev) => ({
                                                ...prev,
                                                poster: data.signedUrl || data.url,
                                                posterDocumentId: data.documentId,
                                            }));
                                            showToast("Poster uploaded successfully");
                                        } catch (err: any) {
                                            console.error("Poster upload failed:", err);
                                            showToast(err?.message || "Failed to upload poster");
                                        } finally {
                                            setPosterUploading(false);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                            </label>

                            {formData.poster && (
                                <img
                                    src={formData.poster}
                                    className="mt-3 w-24 rounded"
                                    alt="Poster Preview"
                                />
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm">Thumbnail</label>
                            <label
                                className={`flex w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/15 p-3 transition ${
                                    thumbnailUploading
                                        ? "bg-zinc-700 text-zinc-300"
                                        : "bg-zinc-800/50 hover:bg-zinc-800"
                                }`}
                            >
                                {thumbnailUploading ? "Uploading Thumbnail..." : "Upload Thumbnail"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={thumbnailUploading}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        setThumbnailUploading(true);
                                        try {
                                            const data = await uploadAdminFile(file, "movies");
                                            setFormData((prev) => ({
                                                ...prev,
                                                thumbnail: data.signedUrl || data.url,
                                                thumbnailDocumentId: data.documentId,
                                            }));
                                            showToast("Thumbnail uploaded successfully");
                                        } catch (err: any) {
                                            console.error("Thumbnail upload failed:", err);
                                            showToast(err?.message || "Failed to upload thumbnail");
                                        } finally {
                                            setThumbnailUploading(false);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                            </label>

                            {formData.thumbnail && (
                                <img
                                    src={formData.thumbnail}
                                    className="mt-3 w-24 rounded"
                                    alt="Thumbnail Preview"
                                />
                            )}
                        </div>

                        {[
                            ["Director", "director"],
                            ["Cast", "cast"],
                            ["Details", "details"],
                            ["IMDb Rating", "rating"],
                        ].map(([label, key]) => (
                            <input
                                key={key}
                                placeholder={label}
                                value={(formData as any)[key] || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, [key]: e.target.value })
                                }
                                className={adminInput}
                            />
                        ))}

                        <div className="flex gap-3 pt-3">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className={adminBtnPrimary}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className={adminBtnSecondary}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIDEO UPLOAD MODAL */}
            {uploadModalOpen && selectedMovie && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 p-8 rounded w-full max-w-lg space-y-5">
                        <h2 className="text-2xl font-bold">Upload Movie Video</h2>

                        <div className="bg-gray-800 p-4 rounded">
                            <p className="text-sm text-gray-300">Movie</p>
                            <p className="font-semibold text-lg">{selectedMovie.title}</p>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-gray-300">
                                Select MP4 video
                            </label>

                            <input
                                type="file"
                                accept="video/mp4"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setSelectedVideo(file);
                                }}
                                className="w-full p-3 bg-gray-800 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-600 file:text-white cursor-pointer"
                            />
                        </div>

                        {selectedVideo && (
                            <div className="bg-gray-800 p-4 rounded text-sm space-y-1 cursor-pointer">
                                <p>
                                    <span className="text-gray-400">File:</span>{" "}
                                    {selectedVideo.name}
                                </p>
                                <p>
                                    <span className="text-gray-400">Type:</span>{" "}
                                    {selectedVideo.type}
                                </p>
                                <p>
                                    <span className="text-gray-400">Size:</span>{" "}
                                    {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                        )}

                        {uploadProgressText && (
                            <div className="bg-blue-900/30 border border-blue-600 text-blue-300 p-3 rounded text-sm">
                                {uploadProgressText}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleVideoUpload}
                                disabled={uploading}
                                className={`px-5 py-2 rounded cursor-pointer ${uploading
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700"
                                    }`}
                            >
                                {uploading ? "Uploading..." : "Start Upload"}
                            </button>

                            <button
                                onClick={() => {
                                    if (uploading) return;
                                    setUploadModalOpen(false);
                                }}
                                className="bg-gray-600 px-5 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIDEO VIEW MODAL */}
            {viewModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
                    <div className="bg-gray-900 p-5 rounded w-[800px] max-w-[95%] relative">

                        <button
                            onClick={() => setViewModalOpen(false)}
                            className="absolute top-2 right-3 text-white text-xl"
                        >
                            ✖
                        </button>

                        {!viewVideoUrl ? (
                            <div className="text-sm text-gray-300 p-4">Loading player...</div>
                        ) : (
                            <video
                                src={viewVideoUrl}
                                controls
                                autoPlay
                                className="w-full rounded"
                                controlsList="nodownload"
                                disablePictureInPicture
                                disableRemotePlayback
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">

                        {/* Warning Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center">
                                <span className="text-3xl">⚠️</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-center text-white mb-3">
                            Delete Movie
                        </h2>

                        {/* Message */}
                        <p className="text-gray-400 text-center leading-relaxed mb-6">
                            Are you sure you want to delete this movie?
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
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition"
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