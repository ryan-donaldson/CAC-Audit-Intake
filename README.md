This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Audit submissions

When a user finishes the form, the responses are posted to `/api/audit`. The
route sends the intake data to the Railway report service, waits for the
generated PDF, and emails it to the address entered in the form using Resend.
Configure these server-side environment variables before deployment:

- `RAILWAY_URL`: the base URL of the Railway report service.
- `RAILWAY_WEBHOOK_SECRET`: the secret sent in the `x-webhook-secret` header.
- `RESEND_API_KEY`: the API key from the Resend account.
- `RESEND_FROM_EMAIL`: a sender address verified with Resend.
- `RESEND_TEMPLATE_ID`: the ID of the Resend email template to use.

The Railway service must provide `POST /generate-report` and
`GET /reports/{report_id}`. The generation endpoint returns a report ID; the
report endpoint returns `application/pdf` once the PDF is ready. The sender
address must be authorized by the configured Resend account. The Resend
template must define `{{first_name}}` and `{{business_name}}` variables; these
names are case-sensitive and must match the variables sent by the route.
Because the email request is made by this Next.js application, configure
`RESEND_TEMPLATE_ID` in the environment where the Next.js server runs (for
example, its Vercel/Railway project variables), not only in the separate
Railway report service.

The generation request contains `client` and `intake` keys. `intake` is the
complete form submission: answers are grouped under their section names and
keyed by question text, with the pain point, budget, email, timestamp, and
formatted `userMessage` at the top level. The form's internal question IDs are
not sent. Vercel logs section answer counts and payload key names for
diagnostics, but do not log answer values or email addresses.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
