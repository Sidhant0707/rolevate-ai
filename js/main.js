// Level toggle
document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Scroll to form
function scrollToForm() {
  document.getElementById('form').scrollIntoView({ behavior: 'smooth' });
}

// Generate roadmap
async function generateRoadmap() {
  const company = document.getElementById('company').value.trim();
  const role = document.getElementById('role').value.trim();
  const level = document.querySelector('.level-btn.active').dataset.level;

  if (!company || !role) {
    alert('Please enter both a company name and target role.');
    return;
  }

  const btn = document.getElementById('generate-btn');
  btn.disabled = true;
  btn.textContent = 'Generating...';

  const resultsSection = document.getElementById('results');
  const resultsGrid = document.getElementById('results-grid');
  const subtitle = document.getElementById('results-subtitle');

  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth' });
  subtitle.textContent = `AI-generated roadmap for ${company} — ${role} — ${level}`;

  resultsGrid.innerHTML = `
    <div class="loading" style="grid-column: 1/-1;">
      <p>Analyzing what ${company} looks for in a ${role}...</p>
      <div class="loading-dots" style="margin-top:16px;">
        <span></span><span></span><span></span>
      </div>
    </div>`;

  const prompt = `
You are a career intelligence AI. Generate a highly specific career roadmap for:
Company: ${company}
Role: ${role}
Skill Level: ${level}

Return ONLY a valid JSON object with exactly these 6 keys:
{
  "skills": "list the most important technical and soft skills for this exact role at this company, comma separated",
  "tools": "list specific tools, languages, frameworks, and platforms used in this role, comma separated",
  "projects": "suggest 3 specific practical projects a student should build for this role, each on a new line starting with -",
  "roadmap": "provide a step by step learning path from basics to job ready for this role, use arrow symbols between steps like: Step 1 → Step 2 → Step 3",
  "futureSkills": "list 2-3 emerging technologies relevant to this role that will give a future advantage, comma separated",
  "interview": "provide 3 commonly asked interview questions for this exact role at this type of company, each on a new line starting with Q:"
}

Be highly specific to ${company} and ${role}. Do not give generic answers.
Return only the JSON object, no other text.`;

  try {
    const response = await fetch("http://localhost:5000/generate-roadmap", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    company,
    role,
    level
  })
});

    const data = await response.json();
    const text = data.content[0].text.trim();
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    resultsGrid.innerHTML = `
      <div class="result-card">
        <div class="card-icon">🎯</div>
        <h3>Required Skills</h3>
        <p>${result.skills}</p>
      </div>
      <div class="result-card">
        <div class="card-icon">🛠️</div>
        <h3>Tools & Technologies</h3>
        <p>${result.tools}</p>
      </div>
      <div class="result-card">
        <div class="card-icon">💡</div>
        <h3>Recommended Projects</h3>
        <p>${result.projects}</p>
      </div>
      <div class="result-card">
        <div class="card-icon">🗺️</div>
        <h3>Learning Roadmap</h3>
        <p>${result.roadmap}</p>
      </div>
      <div class="result-card">
        <div class="card-icon">🚀</div>
        <h3>Future Edge Skills <span class="card-badge">Emerging</span></h3>
        <p>${result.futureSkills}</p>
      </div>
      <div class="result-card">
        <div class="card-icon">🎤</div>
        <h3>Interview Prep <span class="card-badge">Snapshot</span></h3>
        <p>${result.interview}</p>
      </div>`;

  } catch (err) {
    resultsGrid.innerHTML = `
      <div class="loading" style="grid-column:1/-1;">
        <p>Something went wrong. Please try again.</p>
      </div>`;
  }

  btn.disabled = false;
  btn.textContent = 'Generate My Roadmap →';
}
