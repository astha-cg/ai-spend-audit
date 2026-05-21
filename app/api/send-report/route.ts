import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const {
      email,
      reportUrl,
      changes,
    } = body;

    await resend.emails.send({
      from: "onboarding@resend.dev",

      to: email,

      subject:
        "AI Pricing Changes Detected",

      html: `
        <h1>
          Pricing Updates Detected
        </h1>

        <p>
          Your previous audit may now
          produce different savings
          recommendations.
        </p>

        ${
          changes
            ? `
          <h3>Detected Changes:</h3>

          <ul>
            ${changes
              .map(
                (change: string) =>
                  `<li>${change}</li>`
              )
              .join("")}
          </ul>
        `
            : ""
        }

        <br />

        <a
          href="${reportUrl}"
          style="
            background:black;
            color:white;
            padding:12px 20px;
            text-decoration:none;
            border-radius:8px;
          "
        >
          Re-run Audit
        </a>
      `,
    });

    return Response.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return Response.json({
      success: false,
      error,
    });
  }
}