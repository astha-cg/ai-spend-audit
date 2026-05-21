import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, reportUrl, changes } = body;

    // Quick structural fallback check
    if (!email) {
      return Response.json({ success: false, error: "Missing recipient email" }, { status: 400 });
    }

    const { data, error: emailError } = await resend.emails.send({
      // ⚠️ Use your verified domain once out of testing (e.g., alerts@yourdomain.com)
      from: "onboarding@resend.dev", 
      to: email,
      subject: "AI Pricing Changes Detected",
      html: `
        <h1>Pricing Updates Detected</h1>
        <p>Your saved tech stack evaluation is affected by market rate updates. Your previous setup might now produce alternative optimization recommendations.</p>

        ${
          changes && changes.length > 0
            ? `
          <h3>Detected Highlights:</h3>
          <ul>
            ${changes
              .map((change: string) => `<li>${change}</li>`)
              .join("")}
          </ul>
        `
            : ""
        }
        <br />
        <a
          href="${reportUrl}"
          style="
            background: black;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
          "
        >
          View & Re-run Profile
        </a>
      `,
    });

    // Capture delivery failure responses from Resend infrastructure
    if (emailError) {
      console.error("Resend delivery failure:", emailError);
      return Response.json({ success: false, error: emailError }, { status: 400 });
    }

    return Response.json({ success: true, id: data?.id });

  } catch (error: any) {
    console.error("Server API exception:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}