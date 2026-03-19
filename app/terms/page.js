export const metadata = {
  title: "Terms of Service — ReplyRight",
  description: "Terms of Service for ReplyRight, operated by Outwest Management LLC.",
};

export default function TermsPage() {
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
        .caps { text-transform: uppercase; font-weight: 700; font-size: .82rem; letter-spacing: .04em; color: var(--navy); }
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
        <h1>Terms of Service</h1>
        <p className="updated">Last updated: March 18, 2026</p>

        <div className="intro">
          <strong>Please read these Terms carefully before using ReplyRight.</strong> By accessing or using the ReplyRight service in any way — including starting a free trial, connecting your Google account, or visiting the website — you agree to be legally bound by these Terms in their entirety. If you do not agree, do not use the service.
        </div>

        <h2>1. Parties & Agreement</h2>
        <p>These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "Subscriber," or "you") and <strong>Outwest Management LLC</strong>, a Utah limited liability company ("Company," "we," "us," or "our"), the operator of the ReplyRight platform and website located at replyright.ai ("Service"). By using the Service, you represent that you are at least 18 years of age, have the legal authority to enter into this agreement, and accept these Terms on behalf of yourself and any business entity you represent.</p>

        <h2>2. Description of Service</h2>
        <p>ReplyRight is a software-as-a-service (SaaS) platform that uses artificial intelligence to automatically generate and post responses to Google Business Profile reviews on behalf of subscribers. The Service requires connection to your Google Business Profile account via OAuth authorization. ReplyRight does not guarantee any specific business outcome, rating improvement, or review volume increase.</p>

        <h2>3. AI-Generated Content — Your Sole Responsibility</h2>
        <div className="highlight">
          <p className="caps">This section is critically important. Please read it carefully.</p>
          <p>All responses generated by ReplyRight are produced by artificial intelligence and posted publicly to your Google Business Profile under your account credentials. <strong>You are solely and entirely responsible for all content posted to your Google Business Profile through the Service.</strong></p>
          <p>Outwest Management LLC makes no representations, warranties, or guarantees that AI-generated responses will be accurate, appropriate, legally compliant, factually correct, free from offensive content, or suitable for your specific business context. You assume all risk associated with AI-generated content appearing on your public business listing.</p>
          <p>We are not liable for any business loss, reputational harm, customer complaints, regulatory action, or legal claims arising from any response posted by our Service to your account — whether or not such content was reviewed by you prior to posting.</p>
        </div>

        <h2>4. Google Account Access & Third-Party Services</h2>
        <p>To use ReplyRight, you must authorize access to your Google Business Profile via Google's OAuth 2.0 authentication. By granting this authorization, you represent that you have the legal right and authority to do so for all connected business locations.</p>
        <p>Outwest Management LLC is not affiliated with, endorsed by, or in partnership with Google LLC. We are not responsible for:</p>
        <ul>
          <li>Google revoking, limiting, or modifying API access to your account or to our platform</li>
          <li>Changes to Google's Business Profile policies or review systems</li>
          <li>Suspension or termination of your Google account for any reason</li>
          <li>Outages, errors, or data loss caused by Google's systems</li>
          <li>Google's failure to accept, publish, or retain any posted response</li>
          <li>Any changes to Google's API that render the Service partially or fully non-functional</li>
        </ul>
        <p>If Google restricts or revokes our API access for any reason, we will make reasonable efforts to notify you, but we are under no obligation to provide refunds or service credits for any resulting downtime.</p>

        <h2>5. Free Trial</h2>
        <p>We may offer a 14-day free trial to new subscribers. No payment is required to begin the trial. <strong>By starting a free trial, you expressly authorize Outwest Management LLC to automatically enroll you in the Starter plan ($29/month) at the conclusion of the 14-day trial period unless you cancel before the trial ends.</strong> You will be notified by email prior to being charged. It is your sole responsibility to cancel before the trial expires if you do not wish to be charged.</p>

        <h2>6. Subscription, Billing & Auto-Renewal</h2>
        <p>Paid subscriptions are billed on a recurring basis (monthly or annually) via Stripe, our third-party payment processor. By providing payment information, you authorize us to charge your payment method on a recurring basis for the applicable subscription fee until you cancel.</p>
        <ul>
          <li><strong>Monthly plans</strong> renew automatically every 30 days</li>
          <li><strong>Annual plans</strong> renew automatically every 12 months</li>
          <li>Subscription fees are charged in advance at the start of each billing period</li>
          <li>Price changes will be communicated at least 30 days in advance</li>
        </ul>
        <p>You are responsible for maintaining valid payment information. Failed payments may result in immediate suspension or termination of your account. Outwest Management LLC is not responsible for any overdraft fees, bank charges, or other costs incurred as a result of subscription billing.</p>

        <h2>7. Refund Policy</h2>
        <div className="highlight">
          <p><strong>ALL FEES ARE NON-REFUNDABLE.</strong> We do not provide refunds, credits, or prorated amounts for any unused portion of a subscription period, including but not limited to: early cancellation, dissatisfaction with AI-generated content, Google API limitations, service downtime, or any other reason. Your decision to subscribe constitutes acceptance of this no-refund policy.</p>
        </div>

        <h2>8. Cancellation</h2>
        <p>You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period — you retain access to the Service through the end of the period you have paid for. Cancellation does not entitle you to a refund of any fees already charged. To cancel, contact us at Support@replyrightapp.com or use the cancellation option in your account settings when available.</p>

        <h2>9. Termination by Company</h2>
        <p>Outwest Management LLC reserves the right, in its sole and absolute discretion, to suspend, restrict, or permanently terminate your access to the Service at any time, with or without notice, and for any reason or no reason, including but not limited to:</p>
        <ul>
          <li>Violation of these Terms</li>
          <li>Fraudulent, abusive, or illegal use of the Service</li>
          <li>Chargebacks or payment disputes</li>
          <li>Actions that harm the reputation or operation of the Service</li>
          <li>Business decisions including discontinuation of the Service</li>
        </ul>
        <p>Upon termination, your right to use the Service immediately ceases. We are not liable to you or any third party for any termination of your account or access to the Service. No refunds will be issued upon termination.</p>

        <h2>10. Disclaimer of Warranties</h2>
        <div className="highlight">
          <p className="caps">The service is provided "as is" and "as available" without warranties of any kind.</p>
          <p>To the fullest extent permitted by applicable law, Outwest Management LLC expressly disclaims all warranties, whether express, implied, statutory, or otherwise, including but not limited to: implied warranties of merchantability, fitness for a particular purpose, title, non-infringement, accuracy, reliability, or continuous availability. We do not warrant that the Service will be uninterrupted, error-free, secure, or free of viruses or other harmful components. We make no warranty that the Service will meet your business requirements or produce any particular result.</p>
        </div>

        <h2>11. Limitation of Liability</h2>
        <div className="highlight">
          <p className="caps">Read this section carefully. It limits our legal responsibility to you.</p>
          <p>To the maximum extent permitted by applicable law, Outwest Management LLC, its officers, members, employees, agents, licensors, and successors shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages of any kind, including but not limited to: lost profits, lost revenue, lost business, loss of goodwill, reputational damage, loss of data, business interruption, or cost of substitute services — even if we have been advised of the possibility of such damages.</p>
          <p><strong>In no event shall our total aggregate liability to you for all claims arising out of or related to the Service exceed the lesser of: (a) the total fees you paid to us in the thirty (30) days immediately preceding the event giving rise to the claim, or (b) fifty dollars ($50.00 USD).</strong></p>
          <p>This limitation applies regardless of the legal theory under which the claim is brought, including contract, tort, negligence, strict liability, statute, or otherwise.</p>
        </div>

        <h2>12. Indemnification</h2>
        <p>You agree to defend, indemnify, and hold harmless Outwest Management LLC and its officers, members, employees, agents, and successors from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to:</p>
        <ul>
          <li>Your use of or access to the Service</li>
          <li>Any content posted to your Google Business Profile through the Service</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any applicable law, regulation, or third-party rights</li>
          <li>Your Google account, business listings, or business operations</li>
          <li>Any dispute between you and your customers, employees, or any third party</li>
          <li>Claims arising from AI-generated responses posted under your account</li>
        </ul>

        <h2>13. Prohibited Uses</h2>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Post responses that are defamatory, harassing, threatening, or illegal</li>
          <li>Violate Google's Terms of Service, Review Policies, or any applicable law</li>
          <li>Impersonate any person or entity</li>
          <li>Interfere with, disrupt, or attempt to gain unauthorized access to any system</li>
          <li>Resell, sublicense, or commercially exploit the Service without written authorization</li>
          <li>Use the Service for any business or purpose other than managing your own Google Business Profile reviews</li>
        </ul>

        <h2>14. Intellectual Property</h2>
        <p>The ReplyRight platform, including its software, design, branding, and content, is owned by Outwest Management LLC and protected by applicable intellectual property laws. You are granted a limited, non-exclusive, non-transferable, revocable license to use the Service solely for its intended purpose during your subscription. You may not copy, modify, distribute, sell, or create derivative works of any part of the Service.</p>

        <h2>15. Privacy</h2>
        <p>Your use of the Service is also governed by our Privacy Policy, available at <a href="/privacy" style={{color:"var(--accent)"}}>replyright.ai/privacy</a>, which is incorporated into these Terms by reference. By using the Service, you consent to the data practices described in the Privacy Policy.</p>

        <h2>16. Mandatory Arbitration & Class Action Waiver</h2>
        <div className="highlight">
          <p className="caps">This section affects your legal rights. Please read carefully.</p>
          <p><strong>Binding Arbitration.</strong> Any dispute, controversy, or claim arising out of or relating to these Terms or the Service — including questions of validity, interpretation, or enforcement — shall be resolved exclusively by binding individual arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, rather than in court. The arbitration shall take place in Utah County, Utah. The arbitrator's decision shall be final and binding and may be entered as a judgment in any court of competent jurisdiction.</p>
          <p><strong>Class Action Waiver.</strong> YOU AND OUTWEST MANAGEMENT LLC EACH WAIVE THE RIGHT TO PARTICIPATE IN ANY CLASS ACTION, CLASS ARBITRATION, OR REPRESENTATIVE PROCEEDING. All disputes must be brought individually. You may not consolidate your claims with those of any other person or entity.</p>
          <p><strong>Small Claims Exception.</strong> Either party may bring an individual claim in small claims court in Utah County, Utah, provided the claim qualifies under applicable small claims rules and does not seek relief on a class or representative basis.</p>
          <p><strong>Opt-Out.</strong> You may opt out of this arbitration agreement by sending written notice to Support@replyrightapp.com within 30 days of first using the Service. Opting out does not affect any other provision of these Terms.</p>
        </div>

        <h2>17. Governing Law & Jurisdiction</h2>
        <p>These Terms are governed by and construed in accordance with the laws of the State of Utah, without regard to its conflict of law provisions. To the extent any dispute is not subject to arbitration, you consent to the exclusive personal jurisdiction and venue of the state and federal courts located in Utah County, Utah. Outwest Management LLC is located at American Fork, Utah 84003.</p>

        <h2>18. Modifications to Terms</h2>
        <p>Outwest Management LLC reserves the right to modify these Terms at any time. We will notify you of material changes by email or by posting a notice on the website. Your continued use of the Service after the effective date of any modification constitutes your acceptance of the updated Terms. If you do not agree to the modified Terms, you must cancel your subscription and stop using the Service.</p>

        <h2>19. Entire Agreement & Severability</h2>
        <p>These Terms, together with the Privacy Policy, constitute the entire agreement between you and Outwest Management LLC regarding the Service and supersede all prior agreements, representations, or understandings. If any provision of these Terms is found to be unenforceable or invalid, that provision will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions will remain in full force and effect.</p>

        <h2>20. No Waiver</h2>
        <p>Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. Any waiver must be in writing and signed by an authorized representative of Outwest Management LLC.</p>

        <h2>21. Contact</h2>
        <p>For questions about these Terms, contact us at:</p>
        <div className="highlight">
          <p><strong>Outwest Management LLC</strong><br />
          d/b/a ReplyRight<br />
          American Fork, Utah 84003<br />
          Email: <a href="mailto:Support@replyrightapp.com" style={{color:"var(--accent)"}}>Support@replyrightapp.com</a></p>
        </div>
      </div>

      <footer>
        <div className="footer-logo">Reply<span>Right</span></div>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="mailto:Support@replyrightapp.com">Contact</a>
        </div>
        <p>© 2026 ReplyRight · Outwest Management LLC</p>
      </footer>
    </>
  );
}
