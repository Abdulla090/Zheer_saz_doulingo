# TWINO store privacy declarations

Use this as the source of truth when completing Google Play Data safety and Apple App Privacy forms. Re-check against the deployed production build before submission.

## Data collected

| Data type | When | Linked to user | Purpose | Optional |
|---|---|---:|---|---:|
| Email address | Account creation/sign-in | Yes | Authentication and account management | Yes |
| Display name / username | Account creation or profile editing | Yes | App functionality and personalization | Yes |
| Profile photo and public image URL | Signed-in user chooses a photo | Yes | App functionality and personalization | Yes |
| Learning progress and preferences | Signed-in sync | Yes | App functionality and cross-session sync | Yes |
| Typed AI prompts and answers | User opens a cloud AI feature | Yes, through authenticated request | App functionality | Yes |
| Voice audio and transcript | User starts cloud speaking evaluation | Yes, through authenticated request | Pronunciation and learning feedback | Yes |
| Crash diagnostics | Only after production crash reporting is configured | Normally pseudonymous | App stability | No for affected builds |

## Data handling

- Supabase processes optional account and synced learning data.
- A signed-in user's optional profile photo is stored in a public Supabase Storage bucket; anyone with its URL can view it. Replacement overwrites the prior upload, and account deletion removes it.
- Google Gemini processes prompts, typed answers, transcripts, and voice audio only when a user invokes a cloud AI feature.
- Cloud AI requires a signed-in account; provider credentials are stored only in a server-side Edge Function.
- TWINO does not sell personal data, use it for advertising, or enable cross-app tracking.
- Native authentication tokens use protected device credential storage.
- Users can delete their account and synced data from Settings → Your Account → Delete Account.
- Core lessons remain available without creating an account or granting microphone access.

## Store form choices

- Data encrypted in transit: **Yes**
- Account creation available: **Yes, optional**
- In-app account deletion: **Yes**
- Advertising: **No**
- Tracking: **No**
- Sale of data: **No**
- Target audience for v1: **13+**
