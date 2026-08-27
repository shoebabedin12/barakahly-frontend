import { getSettings } from "@/lib/queries";

export default async function RefundPolicyPage() {
  const settings = await getSettings().catch(() => null);
  const siteName = settings?.site_name ?? "Barakahly";

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="mb-2 text-3xl font-bold text-dark">Refund &amp; Return Policy</h1>
      <p className="mb-8 text-sm text-dark/50">Last updated: {new Date().toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}</p>

      <div className="space-y-6 text-dark/70">
        <p>At {siteName}, customer satisfaction is our priority. Please read our return and refund policy below.</p>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">1. Eligibility for Return</h2>
          <p>
            You may request a return within <strong>3 days</strong> of receiving your order if:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>The product received is damaged, defective, or not as described.</li>
            <li>You received the wrong product.</li>
            <li>The product is unused, in its original packaging, with all tags and accessories intact.</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">2. Non-Returnable Items</h2>
          <p>
            For hygiene and safety reasons, certain items (such as intimate wear, cosmetics, or perishable goods) may
            not be eligible for return unless received damaged or defective.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">3. How to Request a Return</h2>
          <p>
            Contact our support team with your order number and reason for return, along with photos of the product
            if it is damaged or defective. Our team will guide you through the pickup or drop-off process.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">4. Refunds</h2>
          <p>
            Once we receive and inspect the returned product, we will notify you of the approval or rejection of
            your refund. Approved refunds for online payments (bKash, Nagad, card) will be processed back to the
            original payment method within 5-7 business days. For Cash on Delivery orders, refunds will be made via
            bKash/Nagad to a number you provide.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">5. Exchanges</h2>
          <p>
            If you&apos;d prefer an exchange instead of a refund (e.g. wrong size or variant), please mention this
            when contacting support and we will arrange it subject to stock availability.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">6. Contact Us</h2>
          <p>
            To start a return or ask about our refund policy, contact us at{" "}
            {settings?.contact_email ? (
              <a href={`mailto:${settings.contact_email}`} className="text-primary underline">
                {settings.contact_email}
              </a>
            ) : (
              "our support email"
            )}
            {settings?.contact_phone ? ` or call ${settings.contact_phone}` : ""}.
          </p>
        </div>
      </div>
    </div>
  );
}
