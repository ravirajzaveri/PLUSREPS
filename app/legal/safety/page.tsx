// pages/legal/security.tsx

export default function SecurityPage() {
  return (
    <main className="prose mx-auto px-4 py-8">
      <h1>Fitverse Security Policy</h1>
      <p><strong>Effective Date:</strong> May 20, 2025</p>

      <p>
        At Fitverse, we take the protection of our users’ data and content seriously. This Security Policy outlines the measures we use to secure your information and prevent unauthorized access.
      </p>

      <h2>1. Account Security</h2>
      <ul>
        <li>We require email verification during account creation.</li>
        <li>Two-Factor Authentication (2FA) is available and encouraged.</li>
        <li>Passwords are stored using industry-standard encryption.</li>
      </ul>

      <h2>2. Data Protection</h2>
      <ul>
        <li>All sensitive data (payment info, credentials) is encrypted in transit and at rest.</li>
        <li>We use SSL/TLS to secure communications between your device and our servers.</li>
        <li>Personal information is only accessible to authorized personnel.</li>
      </ul>

      <h2>3. Infrastructure</h2>
      <ul>
        <li>Our platform is hosted on secure, redundant cloud infrastructure.</li>
        <li>Regular updates and security patches are applied to all services.</li>
        <li>We run automated and manual scans to detect vulnerabilities.</li>
      </ul>

      <h2>4. Payment Security</h2>
      <ul>
        <li>Payments are processed through Razorpay (India) and other PCI-DSS compliant providers.</li>
        <li>Fitverse does not store full credit/debit card details on our servers.</li>
      </ul>

      <h2>5. Content Integrity</h2>
      <ul>
        <li>We monitor uploads and streams using AI tools and human moderation to detect spam, malware, and prohibited content.</li>
        <li>Abusive accounts are promptly suspended and investigated.</li>
      </ul>

      <h2>6. Breach Notification</h2>
      <p>If we detect a data breach involving your information, we will:</p>
      <ul>
        <li>Notify affected users within 72 hours</li>
        <li>Describe the nature and scope of the breach</li>
        <li>Provide guidance on steps to secure your account</li>
      </ul>

      <h2>7. Reporting Vulnerabilities</h2>
      <p>
        If you discover a security issue on Fitverse, please report it to:<br />
        <strong>Email:</strong> <a href="mailto:security@fitverse.com">security@fitverse.com</a>
      </p>
      <p>We reward responsible disclosure and may offer acknowledgment or other incentives.</p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this policy as our systems evolve. Material changes will be announced on our platform or via email.
      </p>
    </main>
  );
}
