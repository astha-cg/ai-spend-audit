import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(req: Request) {

  const body = await req.json();

  const { email, reportUrl } = body;

  try {

    await resend.emails.send({
      from: "onboarding@resend.dev",

      to: email,

      subject: "Your AI Audit Report",

      html: `
        <h1>Your Report is Ready</h1>

        <a href="${reportUrl}">
          Download Report
        </a>
      `,
    });

    return Response.json({
      success: true,
    });

  } catch (error) {

    return Response.json({
      success: false,
    });
  }
}