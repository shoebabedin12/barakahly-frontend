import { getSettings } from "@/lib/queries";

export default async function PrivacyPolicyPage() {
  const settings = await getSettings().catch(() => null);
  const siteName = settings?.site_name ?? "Barakahly";

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="mb-2 text-3xl font-bold text-dark">Privacy Policy</h1>
      <p className="mb-8 text-sm text-dark/50">Last updated: {new Date().toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}</p>

      <div className="space-y-6 text-dark/70">
        <p>
          {siteName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates this website ({siteName}). This Privacy
          Policy explains how we collect, use, and protect your personal information when you visit our website or
          place an order.
        </p>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">1. Information We Collect</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Name, phone number, email address, and delivery address provided during checkout or account registration.</li>
            <li>Order history, cart contents, and wishlist items associated with your account.</li>
            <li>Payment information is processed securely by our payment partners (bKash, Nagad, SSLCommerz); we do not store your card or mobile banking PIN/password.</li>
            <li>Basic technical data such as IP address and browser type, for security and fraud prevention.</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">2. How We Use Your Information</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>To process and deliver your orders.</li>
            <li>To send order confirmations and delivery updates.</li>
            <li>To respond to customer support requests.</li>
            <li>To improve our products, website, and customer experience.</li>
            <li>To prevent fraud and protect the security of our platform.</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">3. Information Sharing</h2>
          <p>
            We do not sell your personal information. We share information only with trusted third parties required
            to fulfil your order — payment gateways, courier/delivery partners, and our sourcing/shipping partners —
            solely for that purpose.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">4. Data Security</h2>
          <p>
            We take reasonable technical and organisational measures to protect your personal data against
            unauthorised access, alteration, or disclosure. Passwords are stored in encrypted (hashed) form.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">5. Your Rights</h2>
          <p>
            You may access, update, or request deletion of your account information at any time by logging into your
            account or contacting us using the details below.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
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
