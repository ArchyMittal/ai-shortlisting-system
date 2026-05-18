import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserTie, FaRobot, FaSearch } from "react-icons/fa";

export default function App() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    bio: ""
  });

  const [jobData, setJobData] = useState({
    requiredSkills: "",
    minExperience: ""
  });

  const [candidates, setCandidates] = useState([]);
  const [matches, setMatches] = useState([]);
  const [aiResult, setAiResult] = useState("");

  const API = "https://ai-shortlisting-backend-7k9d.onrender.com";

  const fetchCandidates = async () => {
    const res = await axios.get(`${API}/candidates`);
    setCandidates(res.data);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleCandidateSubmit = async (e) => {
    e.preventDefault();

    await axios.post(`${API}/candidates`, {
      ...formData,
      skills: formData.skills.split(",").map(s => s.trim())
    });

    alert("Candidate Added");

    setFormData({
      name: "",
      email: "",
      skills: "",
      experience: "",
      bio: ""
    });

    fetchCandidates();
  };

  const handleMatch = async () => {

    const payload = {
      requiredSkills: jobData.requiredSkills
        .split(",")
        .map(s => s.trim()),
      minExperience: Number(jobData.minExperience)
    };

    const res = await axios.post(`${API}/match`, payload);

    setMatches(res.data);
  };

  const handleAIShortlist = async () => {

    const payload = {
      requiredSkills: jobData.requiredSkills
        .split(",")
        .map(s => s.trim()),
      minExperience: Number(jobData.minExperience)
    };

    const res = await axios.post(`${API}/match/ai`, payload);

    setAiResult(
      res.data.choices[0].message.content
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-5xl font-bold text-center mb-3">
        AI Candidate Shortlisting
      </h1>

      <p className="text-center text-slate-400 mb-10">
        Smart Recruitment System using OpenRouter AI
      </p>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Candidate Form */}

        <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800">

          <h2 className="text-2xl font-semibold mb-5 flex items-center gap-2">
            <FaUserTie />
            Add Candidate
          </h2>

          <form
            onSubmit={handleCandidateSubmit}
            className="space-y-4"
          >

            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 rounded-xl bg-slate-800 outline-none"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-xl bg-slate-800 outline-none"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Skills (React, Node.js)"
              className="w-full p-3 rounded-xl bg-slate-800 outline-none"
              value={formData.skills}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  skills: e.target.value
                })
              }
            />

            <input
              type="number"
              placeholder="Experience"
              className="w-full p-3 rounded-xl bg-slate-800 outline-none"
              value={formData.experience}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experience: e.target.value
                })
              }
            />

            <textarea
              placeholder="Bio / Projects"
              className="w-full p-3 rounded-xl bg-slate-800 outline-none"
              value={formData.bio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bio: e.target.value
                })
              }
            />

            <button
              className="w-full bg-cyan-500 hover:bg-cyan-400 transition-all p-3 rounded-xl font-semibold"
            >
              Add Candidate
            </button>

          </form>
        </div>

        {/* Job Form */}

        <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800">

          <h2 className="text-2xl font-semibold mb-5 flex items-center gap-2">
            <FaSearch />
            Job Requirements
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Required Skills"
              className="w-full p-3 rounded-xl bg-slate-800 outline-none"
              value={jobData.requiredSkills}
              onChange={(e) =>
                setJobData({
                  ...jobData,
                  requiredSkills: e.target.value
                })
              }
            />

            <input
              type="number"
              placeholder="Minimum Experience"
              className="w-full p-3 rounded-xl bg-slate-800 outline-none"
              value={jobData.minExperience}
              onChange={(e) =>
                setJobData({
                  ...jobData,
                  minExperience: e.target.value
                })
              }
            />

            <button
              onClick={handleMatch}
              className="w-full bg-green-500 hover:bg-green-400 transition-all p-3 rounded-xl font-semibold"
            >
              Basic Match
            </button>

            <button
              onClick={handleAIShortlist}
              className="w-full bg-purple-500 hover:bg-purple-400 transition-all p-3 rounded-xl font-semibold flex justify-center items-center gap-2"
            >
              <FaRobot />
              AI Shortlist
            </button>

          </div>
        </div>
      </div>

      {/* Candidate Cards */}

      <div className="mt-12">

        <h2 className="text-3xl font-bold mb-6">
          Candidates
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {candidates.map((candidate, index) => (

            <div
              key={index}
              className="bg-slate-900 p-5 rounded-2xl border border-slate-800"
            >

              <h3 className="text-xl font-bold">
                {candidate.name}
              </h3>

              <p className="text-slate-400 text-sm">
                {candidate.email}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">

                {candidate.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="mt-4">
                Experience: {candidate.experience} years
              </p>

              <p className="text-slate-300 mt-3 text-sm">
                {candidate.bio}
              </p>

            </div>
          ))}
        </div>
      </div>

      {/* Match Results */}

      <div className="mt-14">

        <h2 className="text-3xl font-bold mb-6">
          Match Results
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {matches.map((candidate, index) => (

            <div
              key={index}
              className="bg-slate-900 p-5 rounded-2xl border border-slate-800"
            >

              <h3 className="text-xl font-bold">
                {candidate.name}
              </h3>

              <p className="mt-2">
                Match Score:
                <span className="text-green-400 font-bold">
                  {" "} {candidate.matchScore}%
                </span>
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {candidate.matchedSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* AI Output */}

      {aiResult && (

        <div className="mt-14 bg-slate-900 p-8 rounded-3xl border border-slate-800">

          <h2 className="text-3xl font-bold mb-5 flex items-center gap-2">
            <FaRobot />
            AI Recommendation
          </h2>

          <pre className="whitespace-pre-wrap text-slate-300">
            {aiResult}
          </pre>

        </div>
      )}

    </div>
  );
}