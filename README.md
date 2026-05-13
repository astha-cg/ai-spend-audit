<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>AI Spend Audit Platform</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f6f4ef;
      color: #111;
      line-height: 1.7;
      padding: 40px;
      max-width: 1100px;
      margin: auto;
    }

    h1, h2, h3 {
      color: #111;
    }

    h1 {
      font-size: 52px;
      margin-bottom: 10px;
    }

    h2 {
      margin-top: 50px;
      border-bottom: 2px solid #d1d5db;
      padding-bottom: 10px;
    }

    .badge {
      display: inline-block;
      background: #a3e635;
      color: black;
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 14px;
      margin-right: 10px;
      margin-top: 10px;
    }

    .card {
      background: white;
      padding: 25px;
      border-radius: 24px;
      margin-top: 25px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    }

    code {
      background: #111;
      color: #a3e635;
      padding: 3px 6px;
      border-radius: 6px;
    }

    pre {
      background: #111;
      color: #a3e635;
      padding: 20px;
      border-radius: 18px;
      overflow-x: auto;
    }

    ul li {
      margin-bottom: 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    table th,
    table td {
      border: 1px solid #ddd;
      padding: 14px;
      text-align: left;
    }

    table th {
      background: #ecfccb;
    }

    a {
      color: #16a34a;
      text-decoration: none;
    }

    .footer {
      margin-top: 60px;
      text-align: center;
      color: #555;
    }
  </style>
</head>

<body>

  <h1>AI Spend Audit Platform</h1>

  <p>
    Smart AI cost optimization platform that analyzes AI tool spending,
    detects overspending, recommends better plans/tools,
    and calculates monthly + annual savings instantly.
  </p>

  <div>
    <span class="badge">Next.js</span>
    <span class="badge">Supabase</span>
    <span class="badge">OpenAI</span>
    <span class="badge">Tailwind CSS</span>
    <span class="badge">Vercel</span>
  </div>

  <h2>🚀 Live Demo</h2>

  <div class="card">
    <a href="https://your-project.vercel.app" target="_blank">
      https://your-project.vercel.app
    </a>
  </div>

  <h2>📌 Problem Statement</h2>

  <div class="card">
    <p>
      Companies and individuals often overspend on AI subscriptions
      without realizing:
    </p>

    <ul>
      <li>Wrong plans</li>
      <li>Expensive enterprise tiers</li>
      <li>Unused seats</li>
      <li>Duplicate AI tools</li>
      <li>Poor optimization</li>
    </ul>

    <p>
      This platform helps users analyze AI spending and optimize costs.
    </p>
  </div>

  <h2>✨ Features</h2>

  <div class="card">
    <ul>
      <li>AI Spend Audit Engine</li>
      <li>Dynamic Pricing System</li>
      <li>AI Recommendation Engine</li>
      <li>Monthly + Annual Savings Calculator</li>
      <li>Optimization Score</li>
      <li>AI Generated Summary</li>
      <li>PDF Report Download</li>
      <li>Email Report Sharing</li>
      <li>Supabase Authentication</li>
      <li>Responsive UI</li>
    </ul>
  </div>

  <h2>📊 Dynamic Pricing Formula</h2>

  <div class="card">

    <p>
      Pricing is dynamically calculated using:
    </p>

<pre>
newCost = teamSize * planCost

estimatedSavings =
currentCost - newCost
</pre>

  </div>

  <h2>🤖 AI Recommendation Engine</h2>

  <div class="card">

    <table>
      <thead>
        <tr>
          <th>Current Tool</th>
          <th>Recommended Tool</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>ChatGPT Team</td>
          <td>Claude Pro</td>
        </tr>

        <tr>
          <td>Copilot Business</td>
          <td>Cursor Pro</td>
        </tr>

        <tr>
          <td>Gemini Enterprise</td>
          <td>ChatGPT Team</td>
        </tr>
      </tbody>
    </table>

  </div>

  <h2>🧠 Future AI Learning System</h2>

  <div class="card">

    <p>
      The platform is being upgraded into a self-learning recommendation engine.
    </p>

<pre>
IF 80% coding teams
save money with Cursor

THEN recommend Cursor more often
</pre>

    <h3>Planned Features</h3>

    <ul>
      <li>Most overspent AI tools</li>
      <li>Most recommended downgrades</li>
      <li>Average savings per AI tool</li>
      <li>Best plans for startups</li>
      <li>Enterprise optimization analytics</li>
    </ul>

  </div>

  <h2>🛠️ Tech Stack</h2>

  <div class="card">

    <ul>
      <li><strong>Frontend:</strong> Next.js, React, Tailwind CSS</li>
      <li><strong>Backend:</strong> Next.js API Routes</li>
      <li><strong>Database:</strong> Supabase</li>
      <li><strong>AI:</strong> OpenAI API</li>
      <li><strong>Deployment:</strong> Vercel</li>
    </ul>

  </div>

  <h2>📂 Project Structure</h2>

  <div class="card">

<pre>
app/
 ├── audit/
 ├── results/
 ├── api/

lib/
 ├── auditEngine.ts
 ├── pricingData.ts
 ├── supabase.ts

data/
 ├── tools.ts
 ├── pricing.csv
</pre>

  </div>

  <h2>⚙️ Installation</h2>

  <div class="card">

    <h3>Clone Repository</h3>

<pre>
git clone https://github.com/yourusername/ai-spend-audit.git
</pre>

    <h3>Install Dependencies</h3>

<pre>
npm install
</pre>

    <h3>Run Development Server</h3>

<pre>
npm run dev
</pre>

  </div>

  <h2>🔑 Environment Variables</h2>

  <div class="card">

<pre>
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
</pre>

  </div>

  <h2>🧪 Example Test Cases</h2>

  <div class="card">

    <table>
      <thead>
        <tr>
          <th>Input</th>
          <th>Output</th>
        </tr>
      </thead>

      <tbody>

        <tr>
          <td>
            Tool: ChatGPT Team <br>
            Team Size: 10 <br>
            Spend: $400
          </td>

          <td>
            Recommended: Claude Pro <br>
            Savings: $200/month
          </td>
        </tr>

        <tr>
          <td>
            Tool: Copilot Business <br>
            Team Size: 20 <br>
            Spend: $500
          </td>

          <td>
            Recommended: Cursor Pro <br>
            Savings: $120/month
          </td>
        </tr>

      </tbody>
    </table>

  </div>

  <h2>🚀 Deployment</h2>

  <div class="card">

    <p>
      Deploy easily using:
    </p>

    <a href="https://vercel.com" target="_blank">
      https://vercel.com
    </a>

  </div>

  <h2>👩‍💻 Developer</h2>

  <div class="card">

    <h3>Astha Chouhan</h3>

    <p>
      B.Tech CSE • Full Stack Developer • AI Product Builder
    </p>

    <p>
      GitHub:
      <a href="https://github.com/astha-cg" target="_blank">
        https://github.com/astha-cg
      </a>
    </p>

  </div>

  <div class="footer">
    © 2026 AI Spend Audit Platform
  </div>

</body>
</html>