import { Plan } from "@/types/payment";
import { formatPlanAmount } from "@/lib/payment";
import { visitorSurface, visitorTextAccent } from "@/styles/brandColors";

type Props = {
  plan: Plan;
};

export default function PlanCard({ plan }: Props) {
  return (
    <div
      className={`relative overflow-hidden p-6 ${visitorSurface}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(65,15,15,0.2) 0%, rgba(24,24,27,0.55) 100%)",
      }}
    >
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{
          background: "linear-gradient(to bottom, rgb(215,55,45), rgb(65,15,15))",
        }}
      />

      <p className="text-xs uppercase tracking-[0.15em] text-[rgb(215,55,45)]">Selected plan</p>
      <h2 className="mt-1 text-2xl font-bold text-white">{plan.name}</h2>
      <p className={`mt-2 text-4xl font-extrabold ${visitorTextAccent}`}>
        {formatPlanAmount(plan.price, plan.currency)}
      </p>
      <p className="mt-1 text-sm text-zinc-400">
        {plan.durationDays} day{plan.durationDays === 1 ? "" : "s"} access
      </p>

      <p className="mt-6 text-sm leading-relaxed text-zinc-300">{plan.description}</p>
    </div>
  );
}
