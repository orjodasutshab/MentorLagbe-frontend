import PricingSection from "@/components/PricingSection";

const FAQ = [
  { q: "Is the Pro plan a subscription?", a: "No. Pro is a one-time Stripe payment that unlocks the Pro features on your account for good." },
  { q: "What happens after I pay?", a: "Your plan changes to Pro right away and the payment is saved in your transaction history." },
  { q: "Can admins buy a plan?", a: "No. Pro plans are for Student and Tutor accounts. Admins already have full access." },
];

export default function PricingPage() {
  return (
    <div className="container-x py-14">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="eyebrow">Pricing</span>
        <h1 className="h-section">Simple, honest pricing</h1>
        <p className="sub-section mx-auto">Pick the plan that fits your role. Upgrade securely with Stripe Checkout.</p>
      </div>
      <PricingSection />

      <div className="mx-auto mt-16 max-w-3xl space-y-4">
        <h2 className="mb-2 text-center text-xl font-extrabold">Frequently asked questions</h2>
        {FAQ.map((f) => (
          <div key={f.q} className="card p-5">
            <h3 className="font-bold">{f.q}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
