import type { Metadata } from "next";
import LegalPage from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — Oakvale Learning",
  description:
    "The terms and conditions governing your use of the Oakvale Learning educational platform.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="Welcome to the Oakvale Learning Educational Platform! By accessing or using our services, you agree to comply with these terms and conditions. Please read them carefully. If you do not agree with any part of these terms, you must refrain from using our platform."
    >
      <h2>1. User Accounts</h2>
      <p>
        <strong>1.1 Account Creation:</strong> Users must provide accurate,
        complete, and up-to-date information when registering on the platform.
        Oakvale Learning reserves the right to suspend or terminate accounts with
        false or incomplete information.
      </p>
      <p>
        <strong>1.2 Account Security:</strong> Users are responsible for
        maintaining the confidentiality of their login credentials and for all
        activities that occur under their account. Notify us immediately of any
        unauthorized use.
      </p>
      <p>
        <strong>1.3 Age Restrictions:</strong> Users must be at least 13 years
        old to register. Those under 18 must have parental or guardian consent to
        use the platform.
      </p>

      <h2>2. Platform Usage</h2>
      <p>
        <strong>2.1 Acceptable Use Policy:</strong> Users agree to use the
        platform solely for lawful and educational purposes. Prohibited
        activities include, but are not limited to:
      </p>
      <ul>
        <li>Sharing or distributing copyrighted material without permission.</li>
        <li>Uploading harmful software or engaging in cyberattacks.</li>
        <li>
          Harassing, threatening, or discriminating against others on the
          platform.
        </li>
      </ul>
      <p>
        <strong>2.2 License to Use:</strong> Oakvale Learning grants users a
        limited, non-exclusive, non-transferable license to access and use the
        content for personal, non-commercial educational purposes.
      </p>
      <p>
        <strong>2.3 Restrictions:</strong> Users may not resell, reproduce,
        distribute, or modify platform content without prior written consent from
        Oakvale Learning.
      </p>

      <h2>3. Content Ownership and Intellectual Property</h2>
      <p>
        <strong>3.1 Platform Content:</strong> All content on the platform,
        including courses, videos, articles, and trademarks, is owned by or
        licensed to Oakvale Learning and is protected under applicable
        intellectual property laws.
      </p>
      <p>
        <strong>3.2 User-Generated Content:</strong> Users retain ownership of
        any content they upload (e.g., discussion forum posts), but grant Oakvale
        Learning a worldwide, royalty-free license to use, reproduce, and
        distribute this content for educational purposes.
      </p>
      <p>
        <strong>3.3 Copyright Infringement:</strong> Users must not upload
        content they do not have rights to. Oakvale Learning will respond to
        copyright violation claims per applicable laws.
      </p>

      <h2>4. Payments and Subscriptions</h2>
      <p>
        <strong>4.1 Pricing:</strong> Details of course fees or subscription
        charges, including applicable taxes, are provided at the time of
        purchase.
      </p>
      <p>
        <strong>4.2 Payment Terms:</strong> Users must use valid payment methods.
        By subscribing to a recurring plan, users authorize Oakvale Learning to
        charge the subscription fee automatically.
      </p>
      <p>
        <strong>4.3 Refund Policy:</strong> Refunds are available within 14 days
        of purchase for courses that have not been accessed or completed. No
        refunds will be granted for completed courses.
      </p>

      <h2>5. Certificates and Credentials</h2>
      <p>
        <strong>5.1 Issuance:</strong> Certificates are awarded upon successful
        completion of courses that meet predefined requirements.
      </p>
      <p>
        <strong>5.2 Non-Academic Nature:</strong> Unless explicitly stated,
        certificates issued by Oakvale Learning do not equate to academic degrees
        or professional qualifications.
      </p>

      <h2>6. Privacy and Data Protection</h2>
      <p>
        <strong>6.1 User Data:</strong> Oakvale Learning collects and processes
        user data in compliance with its Privacy Policy.
      </p>
      <p>
        <strong>6.2 Third-Party Sharing:</strong> User data may be shared with
        third parties only with explicit consent or as required by law.
      </p>
      <p>
        <strong>6.3 Data Security:</strong> Oakvale Learning implements
        reasonable measures to protect user data from unauthorized access or
        breaches.
      </p>

      <h2>7. Termination of Accounts</h2>
      <p>
        <strong>7.1 User-Initiated Termination:</strong> Users may terminate
        their accounts at any time through their account settings.
      </p>
      <p>
        <strong>7.2 Platform-Initiated Termination:</strong> Oakvale Learning
        reserves the right to suspend or terminate accounts for violations of
        these terms or for other legitimate reasons, with or without prior
        notice.
      </p>

      <h2>8. Disclaimers and Limitations of Liability</h2>
      <p>
        <strong>8.1 No Guarantee of Results:</strong> Oakvale Learning does not
        guarantee specific learning outcomes, certifications, or job placements.
      </p>
      <p>
        <strong>8.2 Service Availability:</strong> While we strive to maintain
        uninterrupted access, Oakvale Learning is not liable for downtime or
        technical issues.
      </p>
      <p>
        <strong>8.3 Liability Limits:</strong> Oakvale Learning&apos;s liability
        for damages is limited to the amount paid by the user for the services.
      </p>

      <h2>9. Modifications to Terms and Services</h2>
      <p>
        <strong>9.1</strong> Oakvale Learning reserves the right to modify these
        terms or services at any time. Users will be notified of significant
        changes, and continued use of the platform constitutes acceptance of the
        updated terms.
      </p>

      <h2>10. Governing Law and Dispute Resolution</h2>
      <p>
        <strong>10.1 Applicable Law:</strong> These terms are governed by the
        laws of England and Wales.
      </p>
      <p>
        <strong>10.2 Dispute Resolution:</strong> Disputes will be resolved
        through mediation or arbitration in accordance with applicable laws.
        Users agree to resolve disputes in the jurisdiction of England and Wales.
      </p>

      <h2>11. Contact Information</h2>
      <p>For any questions or concerns regarding these terms, please contact us at:</p>
      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:support@oakvaleltd.com">support@oakvaleltd.com</a>
        <br />
        <strong>Address:</strong> Oakvale Learning, Biddenham, England
      </p>
      <p>Thank you for choosing Oakvale Learning as your learning platform!</p>
    </LegalPage>
  );
}
