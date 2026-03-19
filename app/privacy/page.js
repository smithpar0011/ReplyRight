export const metadata = {
  title: "Privacy Policy — ReplyRight",
  description: "Privacy Policy for ReplyRight, operated by Outwest Management LLC.",
};

export default function PrivacyPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #0f1f38; --blue: #1e4d8c; --accent: #2e7df7;
          --cream: #f8f5ef; --cream-dark: #ede8de; --white: #ffffff;
          --text-dark: #0f1f38; --text-mid: #4a5568; --text-light: #8896a7;
        }
        body { font-family: 'DM Sans', sans-serif; background: var(--cream); }
        nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 3rem;
          background: rgba(248,245,239,0.97); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(200,169,110,0.2);
        }
        .logo { font-family: 'Instrument Serif', serif; font-size: 1.5rem; color: var(--navy); text-decoration: none; }
        .logo span { color: var(--accent); }
        .back-btn { font-size: .85rem; color: var(--text-mid); text-decoration: none; font-weight: 500; }
        .back-btn:hover { color: var(--navy); }
        .wrap { max-width: 780px; margin: 0 auto; padding: 4rem 2rem 6rem; }
        .page-label { font-size: .72rem; font-weight: 700; letter-spacing: .12em; color: var(--accent); text-transform: uppercase; margin-bottom: .6rem; }
        h1 { font-family: 'Instrument Serif', serif; font-size: clamp(2rem,4vw,3rem); color: var(--navy); letter-spacing: -.02em; line-height: 1.15; margin-bottom: .5rem; }
        .updated { font-size: .82rem; color: var(--text-light); margin-bottom: 3rem; }
        .intro { font-size: 1rem; color: var(--text-mid); line-height: 1.75; margin-bottom: 2.5rem; padding: 1.4rem 1.6rem; background: var(--white); border-radius: 12px; border-left: 4px solid var(--accent); }
        h2 { font-family: 'Instrument Serif', serif; font-size: 1.35rem; color: var(--navy); margin: 2.5rem 0 .7rem; letter-spacing: -.01em; }
        p { font-size: .93rem; color: var(--text-mid); line-height: 1.8; margin-bottom: 1rem; }
        ul { padding-left: 1.4rem; margin-bottom: 1rem; }
        li { font-size: .93rem; color: var(--text-mid); line-height: 1.8; margin-bottom: .3rem; }
        .highlight { background: var(--white); border-radius: 10px; padding: 1.2rem 1.4rem; border: 1px solid var(--cream-dark); margin-bottom: 1rem; }
        .table-wrap { overflow-x: auto; margin-bottom: 1.5rem; }
        table { width: 100%; border-collapse: collapse; font-size: .88rem; }
        th { background: var(--navy); color: white; padding: .7rem 1rem; text-align: left; font-weight: 600; font-size: .8rem; }
        td { padding: .65rem 1rem; border-bottom: 1px solid var(--cream-dark); color: var(--text-mid); vertical-align: top; }
        tr:nth-child(even) td { background: var(--white); }
        footer { background: #0a1628; padding: 2rem 3rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .footer-logo { font-family: 'Instrument Serif', serif; font-size: 1.3rem; color: white; }
        .footer-logo span { color: var(--accent); }
        footer p { color: rgba(255,255,255,.3); font-size: .78rem; }
        footer a { color: rgba(255,255,255,.35); font-size: .78rem; text-decoration: none; }
        footer a:hover { color: white; }
        .footer-links { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        @media(max-width:640px) { nav { padding: 1rem 1.2rem; } .wrap { padding: 2.5rem 1.2rem 4rem; } footer { flex-direction: column; text-align: center; } }
      `}</style>

      <nav>
        <a href="/" className="logo">Reply<span>Right</span></a>
        <a href="/" className="back-btn">← Back to Home</a>
      </nav>

      <div className="wrap">
        <div className="page-label">Legal</div>
        <h1>Privacy Policy</h1>
        <p className="updated">Last updated: March 18, 2026</p>

        <div className="intro">
          This Privacy Policy explains how Outwest Management LLC ("we," "us," or "our"), operating ReplyRight, collects, uses, stores, and protects information when you use our service. By using ReplyRight, you agree to the practices described in this Policy.
        </div>

        <h2>1. Who We Are</h2>
        <p>ReplyRight is operated by <strong>Outwest Management LLC</strong>, a Utah limited liability company located in American Fork, Utah 84003. You can reach us at <a href="mailto:hello@replyright.ai" style={{color:"var(--accent)"}}>hello@replyright.ai</a>.</p>

        <h2>2. Information We Collect</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Category</th><th>What We Collect</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr><td>Account Info</td><td>Name, email address (via Google OAuth)</td><td>To create and manage your account</td></tr>
              <tr><td>Google Business Data</td><td>Business name, location, and review content from your Google Business Profile</td><td>To generate and post AI responses on your behalf</td></tr>
              <tr><td>Payment Info</td><td>Billing details processed by Stripe (we do not store card numbers)</td><td>To process subscription payments</td></tr>
              <tr><td>Usage Data</td><td>Pages visited, features used, timestamps, IP address, browser type</td><td>To operate, improve, and secure the service</td></tr>
              <tr><td>Communications</td><td>Emails you send us</td><td>To respond to support requests</td></tr>
            </tbody>
          </table>
        </div>

        <h2>3. What We Do NOT Collect</h2>
        <ul>
          <li>We do not access your personal Gmail inbox, contacts, calendar, or any Google data beyond your Business Profile reviews</li>
          <li>We do not store your full credit card number, CVV, or banking credentials</li>
          <li>We do not sell your personal data to third parties for marketing purposes</li>
          <li>We do not collect data from minors under age 18</li>
        </ul>

        <h2>4. How We Use Your Information</h2>
        <p>We use collected information solely to:</p>
        <ul>
          <li>Provide, operate, and maintain the ReplyRight service</li>
          <li>Generate AI responses to your Google Business Profile reviews</li>
          <li>Process subscription payments and manage billing</li>
          <li>Send transactional emails (account notices, billing receipts, trial reminders)</li>
          <li>Monitor for fraud, abuse, or security threats</li>
          <li>Improve our AI models and service quality in aggregate, anonymized form</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>5. Google OAuth & API Data</h2>
        <p>When you connect your Google Business Profile, you grant ReplyRight access to read your business reviews and post responses on your behalf. This access is governed by Google's OAuth 2.0 protocol. We request only the minimum permissions required to operate the service.</p>
        <p>We do not share your Google account credentials with any third party. Google's use of information received from the ReplyRight application is governed by <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{color:"var(--accent)"}}>Google's Privacy Policy</a>.</p>
        <p>You can revoke ReplyRight's access to your Google account at any time by visiting your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{color:"var(--accent)"}}>Google account permissions page</a>. Revoking access will prevent the service from functioning but does not automatically cancel your subscription.</p>

        <h2>6. Third-Party Service Providers</h2>
        <p>We share data only with trusted third-party providers who help us operate the service:</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Provider</th><th>Purpose</th><th>Data Shared</th></tr>
            </thead>
            <tbody>
              <tr><td>Google LLC</td><td>OAuth authentication & Business Profile API</td><td>OAuth tokens, review data</td></tr>
              <tr><td>Stripe Inc.</td><td>Payment processing</td><td>Billing info, subscription status</td></tr>
              <tr><td>Anthropic PBC</td><td>AI response generation</td><td>Business name, type, review text (no personal identifiers)</td></tr>
              <tr><td>Vercel Inc.</td><td>Website hosting & infrastructure</td><td>Standard web traffic data</td></tr>
            </tbody>
          </table>
        </div>
        <p>We do not sell, rent, or trade your personal information to any other third party.</p>

        <h2>7. Data Retention</h2>
        <p>We retain your account information for as long as your account is active. If you cancel your account, we will delete or anonymize your personal data within 90 days, except where retention is required by law (e.g., billing records, which we retain for 7 years per standard accounting requirements). Review content processed through our AI system is not retained beyond the immediate session required to generate a response.</p>

        <h2>8. Data Security</h2>
        <p>We implement industry-standard security measures including encrypted data transmission (HTTPS/TLS), secure credential storage, and access controls. However, no internet transmission or electronic storage is 100% secure. We cannot guarantee absolute security and are not liable for unauthorized access resulting from circumstances beyond our reasonable control.</p>

        <h2>9. Cookies & Tracking</h2>
        <p>ReplyRight uses cookies and similar technologies for:</p>
        <ul>
          <li><strong>Authentication:</strong> Storing your session token securely (HttpOnly cookies)</li>
          <li><strong>Preferences:</strong> Remembering your business type and tone settings</li>
          <li><strong>Analytics:</strong> Understanding how visitors use the site in aggregate</li>
        </ul>
        <p>We do not use advertising trackers or sell cookie data. You can disable cookies in your browser settings, though doing so may impair service functionality.</p>

        <h2>10. Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your personal data</li>
          <li>Revoke your Google OAuth authorization at any time</li>
          <li>Opt out of non-essential communications</li>
        </ul>
        <p>To exercise any of these rights, email us at <a href="mailto:hello@replyright.ai" style={{color:"var(--accent)"}}>hello@replyright.ai</a>. We will respond within 30 days.</p>

        <h2>11. Children's Privacy</h2>
        <p>The Service is intended for business owners and adults aged 18 and older. We do not knowingly collect personal information from anyone under 18. If we become aware that we have collected data from a minor, we will delete it immediately.</p>

        <h2>12. California Privacy Rights (CCPA)</h2>
        <p>If you are a California resident, you have the right to know what personal information we collect, request deletion of your personal information, and opt out of the sale of personal information. We do not sell personal information. To exercise your California rights, contact us at hello@replyright.ai.</p>

        <h2>13. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page with a new effective date, and by email if you have an active subscription. Continued use of the Service after changes are posted constitutes your acceptance of the updated Policy.</p>

        <h2>14. Contact Us</h2>
        <div className="highlight">
          <p><strong>Outwest Management LLC</strong><br />
          d/b/a ReplyRight<br />
          American Fork, Utah 84003<br />
          Email: <a href="mailto:hello@replyright.ai" style={{color:"var(--accent)"}}>hello@replyright.ai</a></p>
        </div>
      </div>

      <footer>
        <div className="footer-logo">Reply<span>Right</span></div>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="mailto:hello@replyright.ai">Contact</a>
        </div>
        <p>© 2026 ReplyRight · Outwest Management LLC</p>
      </footer>
    </>
  );
}
