import { visitorTextAccent } from "@/styles/brandColors";

export default function PaymentHeader() {
  return (
    <div className="relative mx-auto max-w-2xl text-center">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[rgb(215,55,45)]">
        Premium
      </p>
      <h1 className="text-4xl font-extrabold text-white md:text-5xl">
        Choose Your <span className={visitorTextAccent}>Plan</span>
      </h1>
      <p className="mt-3 text-zinc-400">
        Upgrade to Premium and enjoy movies in Ultra HD
      </p>

      <div className="mt-4 flex justify-center gap-2 text-sm text-zinc-500">
        <span className="text-[rgb(215,55,45)]">🔒</span>
        Secure Razorpay checkout • UPI, cards & Net Banking
      </div>
    </div>
  );
}
