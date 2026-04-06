const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate-roadmap", (req, res) => {
  const { company, role, level } = req.body;

  res.json({
    skills: "JavaScript, REST APIs, Linux basics",
    tools: "Git, Docker, AWS",
    projects: "- Build a REST API\n- Deploy a web app\n- Create a developer portfolio",
    roadmap: "Fundamentals → Web Dev → Backend → Cloud → Job Ready",
    futureSkills: "AI tools, Cloud-native architecture",
    interview: "Q: Explain REST APIs\nQ: What is Docker?\nQ: What is cloud deployment?"
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
