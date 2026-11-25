import Link from "next/link";
import { Icon } from "@/components/icons";

export default function PaymentCancelPage() {
  return (
    <div className="container-x flex justify-center py-16">
      <div className="card w-full max-w-lg p-8 text-center">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#fef3c7] text-[#b45309]">
          <Icon name="alert" size={30} />
        </span>
        <h1 className="text-2xl font-extrabold">Payment cancelled</h1>
        <p className="mt-2 text-sm text-muted">No charge was made. You can upgrade to Pro whenever you are ready.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/pricing" className="btn btn-primary">Try again</Link>
          <Link href="/dashboard" className="btn btn-outline">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
