export default function WatchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black min-h-screen m-0 overflow-hidden z-[100] relative">
      {children}
    </div>
  );
}