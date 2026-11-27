import { db } from "./db";

export const LEGAL_SLUGS = ["privacy", "terms"] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

// Format: "## Heading" lines, "- " bullet lines, blank-line separated paragraphs.
export const DEFAULT_LEGAL: Record<LegalSlug, { title: string; content: string }> = {
  privacy: {
    title: "Privacy Policy",
    content: `This Privacy Policy explains what information Nosploit ("we", "us") collects, how we use it, and the choices you have. It applies to the Nosploit website, our license verification service, and our Discord bot and Roblox integrations (together, the "Service").

## 1. Information we collect
- Staff accounts: when a team member signs in with Discord or Roblox, we receive and store their account ID, username/display name and avatar. Only accounts that have been whitelisted by our Executive Team can sign in.
- Discord bot data: our Discord bot may process Discord user IDs, server (guild) IDs, channel IDs and the content of commands or interactions sent to it, only as needed to provide its features. We do not read or store ordinary messages that are not directed at the bot.
- Roblox data: we store Roblox user, group and game IDs and names that are needed to issue licenses, run blacklists and suspensions, and manage client relationships. Roblox OAuth only gives us your public profile information (ID, username, avatar).
- License and client records: license keys, the products and Roblox groups, users or games they apply to, outreach status, announcements, and internal notes.
- Moderation records: suspension and blacklist cases may include a Roblox/Discord ID, name, reason and supporting evidence.
- Technical data: our servers and our network provider (Cloudflare) process IP addresses and request metadata to deliver the website, prevent abuse and rate-limit the license verification API. We use cookies only to keep staff signed in (a secure session cookie). We do not use advertising or analytics trackers.

## 2. How we use information
- To authenticate staff and control access to internal tools.
- To issue, verify, suspend and revoke licenses.
- To investigate abuse and maintain suspension and blacklist records.
- To operate our Discord bot and website, and to keep them secure.
- To communicate with clients and partners about their services.

## 3. Sharing
We do not sell your personal information. We share it only with service providers that help us run the Service (such as hosting and Cloudflare), with Discord and Roblox as part of their sign-in and platform features, and when required by law or to protect the safety and integrity of our users and platforms.

## 4. Retention
Staff account data is kept while the account is active. License, client and moderation records are kept for as long as needed to operate the Service and enforce suspensions and blacklists. You may ask us to delete or correct your data (see Section 7); we may keep information we need to meet legal obligations or to prevent ban evasion.

## 5. Security
Access to internal tools is limited by role, sessions are encrypted in transit, and our database is not exposed to the public internet. No system is perfectly secure, but we take reasonable measures to protect your information.

## 6. Children
The Service is not directed to children under 13, and we do not knowingly collect personal information from them. Users must also meet the minimum age requirements of Discord and Roblox. If you believe a child has given us personal information, contact us and we will remove it.

## 7. Your choices and rights
You can ask us to access, correct or delete the personal information we hold about you, or object to how we use it. You can also revoke Nosploit's access to your Discord or Roblox account at any time in those platforms' authorized-apps settings. To make a request, contact us through our official Discord server or the contact methods listed on our Contact page.

## 8. Third-party services
Discord and Roblox have their own privacy policies, which apply to your use of their platforms. We are not responsible for their practices.

## 9. Changes
We may update this policy from time to time. The date of the latest update is shown at the bottom of this page. Continued use of the Service after a change means you accept the updated policy.

## 10. Contact
Questions about this policy can be sent through our official Discord server or the Contact page of this website.`,
  },
  terms: {
    title: "Terms of Service",
    content: `These Terms of Service ("Terms") govern your use of the Nosploit website, license verification service, Discord bot and related tools (the "Service"). By using the Service you agree to these Terms. If you do not agree, do not use the Service.

## 1. About the Service
Nosploit provides licensing and protection-related services for Roblox groups, games and communities, together with public directories of staff, clients and affiliates, and internal tools for authorized staff.

## 2. Eligibility
You must be old enough to use Discord and Roblox under their own terms, and able to enter a binding agreement. If you use the Service for a group or organization, you confirm you are authorized to act for it.

## 3. Licenses
- A license is issued by Nosploit for a specific product and a specific Roblox group, user or game. It is personal, non-transferable and non-sublicensable unless we agree otherwise in writing.
- You must keep your license key private. You are responsible for activity that uses your key.
- Licenses may have an expiry date and may be suspended or revoked at any time if we believe these Terms have been broken.
- Our license verification API may be used only for its intended purpose. Abuse, scraping or attempts to guess keys or identifiers are prohibited and may be blocked.

## 4. Acceptable use
You agree not to:
- break the law, or the rules of Discord, Roblox or any other platform;
- attempt to access staff areas or data you are not authorized to access;
- interfere with, overload or attempt to reverse engineer or bypass the Service or its security;
- use the Service to harass, deceive, or harm others, or to evade a suspension or blacklist;
- resell, share or redistribute licenses or keys without permission.

## 5. Staff accounts
Access to the Staff Hub is by invitation only. Staff must keep their accounts secure, use tools only for their assigned role, and keep confidential information private. Access can be removed at any time.

## 6. Suspensions and blacklists
We may suspend or blacklist users, groups or clients, and hide their public pages, when we believe they have violated these Terms or put others at risk. Suspended parties may appeal through the channels we provide. Decisions are made at our discretion.

## 7. Public directories
Clients and affiliates shown in our public directory agree to be listed with the information they provided. Listings may be removed or hidden at any time, including automatically during a suspension.

## 8. Third-party platforms
The Service works with Discord and Roblox. We are not affiliated with, endorsed by or sponsored by Discord Inc. or Roblox Corporation. Your use of those platforms is governed by their own terms.

## 9. Intellectual property
The Nosploit name, logo, software and website content belong to us or our licensors. These Terms give you no ownership of them. You keep ownership of content you provide, and give us permission to use it as needed to operate the Service.

## 10. Disclaimer
The Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee uninterrupted or error-free operation, or that the Service will prevent every form of abuse or exploitation.

## 11. Limitation of liability
To the fullest extent permitted by law, Nosploit and its team are not liable for indirect, incidental, special or consequential damages, or for loss of data, profits, groups, games or in-game assets, arising from use of the Service.

## 12. Termination
You may stop using the Service at any time. We may suspend or end your access at any time, with or without notice, if we believe you have broken these Terms.

## 13. Changes
We may update these Terms. The date of the latest update is shown at the bottom of this page. Continued use of the Service after a change means you accept the updated Terms.

## 14. Contact
Questions about these Terms can be sent through our official Discord server or the Contact page of this website.`,
  },
};

export async function getLegalPage(slug: LegalSlug) {
  const row = await db.legalPage.findUnique({ where: { slug } });
  return row
    ? { title: row.title, content: row.content, updatedAt: row.updatedAt, custom: true }
    : { ...DEFAULT_LEGAL[slug], updatedAt: null as Date | null, custom: false };
}
