// pages/legal/accessibility.tsx

export default function AccessibilityPage() {
  return (
    <main className="prose mx-auto px-4 py-8">
      <h1>Accessibility Statement</h1>
      <p><strong>Effective Date:</strong> May 20, 2025</p>

      <p>
        Fitverse is committed to making our platform accessible to all individuals, including those with disabilities. We believe fitness should be inclusive, and we are continuously working to improve the usability of our site and apps for everyone.
      </p>

      <h2>1. Our Commitment</h2>
      <p>We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards wherever possible.</p>
      <p>This includes:</p>
      <ul>
        <li>Providing text alternatives for non-text content</li>
        <li>Making all functionality available from a keyboard</li>
        <li>Ensuring adequate contrast between text and backgrounds</li>
        <li>Making content readable and understandable</li>
      </ul>

      <h2>2. Supported Features</h2>
      <p>Fitverse currently supports:</p>
      <ul>
        <li>Screen reader compatibility</li>
        <li>Keyboard navigation</li>
        <li>Closed captions on live and recorded streams (when enabled)</li>
        <li>Adjustable font sizes and scalable layout on mobile</li>
      </ul>

      <h2>3. Ongoing Improvements</h2>
      <p>We are actively:</p>
      <ul>
        <li>Testing new features with accessibility in mind</li>
        <li>Gathering feedback from users with disabilities</li>
        <li>Training our developers and designers on accessibility best practices</li>
      </ul>

      <h2>4. Feedback</h2>
      <p>
        If you experience any accessibility barriers or have suggestions for improvement, please contact:<br />
        <strong>Email:</strong> <a href="mailto:accessibility@fitverse.com">accessibility@fitverse.com</a>
      </p>
      <p>Your feedback helps us make Fitverse better for everyone.</p>

      <h2>5. Third-Party Content</h2>
      <p>
        While we encourage streamers and advertisers to make their content accessible, we cannot guarantee full compliance for user-generated content.
      </p>

      <hr />

      <p>Together, we can create a more inclusive fitness experience for all.</p>
    </main>
  );
}
