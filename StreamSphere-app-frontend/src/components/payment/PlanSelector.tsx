import { BillingCycle } from '@/types/payment';

type Props = {
  cycle: BillingCycle;
  setCycle: (cycle: BillingCycle) => void;
};

const activePlan =
  'border-[rgb(215,55,45)] bg-[rgb(175,35,30)] text-white';
const inactivePlan =
  'border-white/20 text-zinc-300 hover:bg-white/10';

export default function PlanSelector({ cycle, setCycle }: Props) {
  return (
    <div className="flex gap-4">
      {(['monthly', 'yearly'] as BillingCycle[]).map((type) => (
        <button
          key={type}
          onClick={() => setCycle(type)}
          className={`rounded-full border px-6 py-3 transition ${
            cycle === type ? activePlan : inactivePlan
          }`}
        >
          {type === 'monthly' ? 'Monthly' : 'Yearly'}
        </button>
      ))}
    </div>
  );
}
