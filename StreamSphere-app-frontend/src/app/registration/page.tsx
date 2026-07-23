"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { API_BASE_URL } from "@/context/AuthContext";
import AuthPageShell from "@/components/auth/AuthPageShell";
import AuthAlert from "@/components/auth/AuthAlert";
import { authToast } from "@/components/auth/authToast";
import { visitorBtnPrimary, visitorInput } from "@/styles/brandColors";

export default function RegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (alert) setAlert(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!formData.firstName.trim()) {
      return setAlert({ type: "error", message: "First name is required" });
    }
    if (!formData.lastName.trim()) {
      return setAlert({ type: "error", message: "Last name is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setAlert({ type: "error", message: "Please enter a valid email address" });
    }

    const phoneRegex = /^\d{10,13}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      return setAlert({ type: "error", message: "Please enter a valid phone number (10-13 digits)" });
    }

    if (formData.password.length < 6) {
      return setAlert({ type: "error", message: "Password must be at least 6 characters long" });
    }
    if (formData.password !== formData.confirmPassword) {
      return setAlert({ type: "error", message: "Passwords do not match" });
    }

    setLoading(true);

    try {
      const numericPhone = parseInt(formData.phone.replace(/\D/g, ""), 10);

      const res = await fetch(`${API_BASE_URL}/users/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: numericPhone,
          password: formData.password,
          status: "ACTIVE",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          Array.isArray(data.message) ? data.message.join(", ") : data.message || "Registration failed"
        );
      }

      authToast.success("Account created successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Server error. Please try again later.";
      setAlert({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "firstName", type: "text", placeholder: "First Name", label: "First Name" },
    { name: "lastName", type: "text", placeholder: "Last Name", label: "Last Name" },
    { name: "email", type: "email", placeholder: "you@example.com", label: "Email" },
    { name: "phone", type: "tel", placeholder: "Phone Number", label: "Phone" },
    { name: "password", type: "password", placeholder: "Password", label: "Password" },
    { name: "confirmPassword", type: "password", placeholder: "Confirm Password", label: "Confirm Password" },
  ] as const;

  return (
    <AuthPageShell
      title="Create Account"
      subtitle="Join StreamSphere and start watching today."
      heroTitle="Start your streaming journey."
      heroDescription="Create a free account to save your watchlist, resume playback, and explore our full catalog."
    >
      {alert && (
        <div className="mb-4">
          <AuthAlert
            type={alert.type}
            message={alert.message}
            onDismiss={() => setAlert(null)}
          />
        </div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        {fields.map(({ name, type, placeholder, label }) => (
          <div key={name}>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className={visitorInput}
              placeholder={placeholder}
              required
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`${visitorBtnPrimary} mt-2 w-full ${loading ? "cursor-not-allowed opacity-70" : ""}`}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-400">
        <span className="mr-2">Already have an account?</span>
        <Link href="/login" className="font-medium text-white hover:text-[rgb(215,55,45)]">
          Sign in here
        </Link>
      </div>
    </AuthPageShell>
  );
}
