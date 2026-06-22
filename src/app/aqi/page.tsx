import { Dashboard } from "@/components/Dashboard";

export default function AQIPage() {
  return (
    <main className="w-full min-h-screen bg-[#03050a] overflow-x-hidden relative">
      <Dashboard initialMode="predictor" />
    </main>
  );
}
