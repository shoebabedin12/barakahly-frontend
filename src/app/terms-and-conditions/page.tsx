import { getSettings } from "@/lib/queries";

export default async function TermsPage() {
  const settings = await getSettings().catch(() => null);
  const siteName = settings?.site_name ?? "Barakahly";

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="mb-2 text-3xl font-bold text-dark">Terms &amp; Conditions</h1>
      <p className="mb-8 text-sm text-dark/50">Last updated: {new Date().toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}</p>

      <div className="space-y-6 text-dark/70">
        <p>
          Welcome to {siteName}. By accessing or using our website and placing an order, you agree to be bound by the
          following terms and conditions.
        </p>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">1. Orders</h2>
          <p>
            All orders placed through our website are subject to acceptance and availability. Prices and product
            availability are subject to change without prior notice. We reserve the right to cancel any order
            suspected of fraud or abuse.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">2. Pricing &amp; Payment</h2>
          <p>
            All prices are listed in Bangladeshi Taka (&#2547;) and are inclusive of applicable taxes unless stated
            otherwise. We accept Cash on Delivery and online payment via bKash, Nagad, cards, and other methods
            offered through our SSLCommerz payment gateway.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">3. Shipping &amp; Delivery</h2>
          <p>
            Delivery charges and estimated delivery times are shown at checkout based on your delivery location.
            While we aim to deliver within the estimated timeframe, delays may occasionally occur due to courier or
            logistical issues beyond our control.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">4. Product Information</h2>
          <p>
            We make every effort to display product details, images, and pricing accurately. Minor variations in
            colour or appearance may occur due to photography or screen display differences.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">5. Account Responsibility</h2>
          <p>
            If you create an account with us, you are responsible for maintaining the confidentiality of your login
            credentials and for all activity under your account.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">6. Limitation of Liability</h2>
          <p>
            {siteName} shall not be liable for any indirect, incidental, or consequential damages arising from the
            use of our website or products, to the maximum extent permitted by law.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">7. Changes to These Terms</h2>
          <p>
            We may update these Terms &amp; Conditions from time to time. Continued use of the website after changes
            are posted constitutes acceptance of the revised terms.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-dark">8. Contact Us</h2>
          <p>
            For any questions about these Terms &amp; Conditions, please contact us at{" "}
            {settings?.contact_email ? (
              <a href={`mailto:${settings.contact_email}`} className="text-primary underline">
                {settings.contact_email}
              </a>
            ) : (
              "our support email"
            )}
            .
          </p>
        </div>
      </div>
    </div>
  );
}
