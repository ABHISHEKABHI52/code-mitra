import { useEffect, useState } from "react";
import { EXAMPLE_ERRORS, LANGUAGES } from "./utils/constants";
import { explainCode } from "./services/api";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background: #F4F1EA;
    color: #1A1916;
    font-family: 'Plus Jakarta Sans', sans-serif;
    overflow-x: hidden;
  }
  a { color: inherit; }
  button, input, textarea { font: inherit; }
  :root {
    --or: #E84B0F;
    --or2: #FF6B35;
    --cream: #F4F1EA;
    --cream2: #EAE6DC;
    --cream3: #E0DBCE;
    --white: #FFFFFF;
    --ink: #1A1916;
    --ink2: #4B4844;
    --ink3: #8C8984;
    --ink4: #C5C2BC;
    --border: rgba(26,25,22,0.08);
    --border2: rgba(26,25,22,0.13);
    --r: 14px;
    --r-sm: 9px;
    --shadow: 0 1px 16px rgba(26,25,22,0.06), 0 1px 3px rgba(26,25,22,0.04);
    --shadow-md: 0 4px 32px rgba(26,25,22,0.09), 0 1px 8px rgba(26,25,22,0.05);
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--cream); }
  ::-webkit-scrollbar-thumb { background: var(--ink4); border-radius: 999px; }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 999;
    padding: 18px 0;
    transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
  }
  .nav.solid {
    padding: 12px 0;
    background: rgba(244,241,234,0.93);
    backdrop-filter: blur(20px) saturate(1.6);
    border-bottom: 1px solid var(--border);
  }
  .nav-inner {
    max-width: 1100px; margin: 0 auto; padding: 0 28px;
    display: flex; align-items: center; justify-content: space-between; gap: 18px;
  }
  .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .nav-logo-mark {
    width: 32px; height: 32px; background: var(--or); border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 15px; color: #fff; font-weight: 800;
  }
  .nav-logo-text {
    font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: var(--ink);
  }
  .nav-logo-text span { color: var(--or); }
  .nav-links { display: flex; gap: 2px; flex-wrap: wrap; }
  .nav-links a {
    color: var(--ink3); font-size: 13.5px; font-weight: 500; text-decoration: none;
    padding: 7px 13px; border-radius: 8px; transition: background 0.18s, color 0.18s;
  }
  .nav-links a:hover { background: var(--cream2); color: var(--ink); }
  .nav-cta {
    background: var(--ink); color: #fff; padding: 9px 20px; border-radius: 9px;
    font-size: 13px; font-weight: 600; text-decoration: none;
    transition: background 0.18s; display: inline-block;
  }
  .nav-cta:hover { background: var(--or); }

  .hero {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--cream); position: relative; overflow: hidden; text-align: center;
    padding: 100px 28px 60px;
  }
  .hero-bg-pattern {
    position: absolute; inset: 0; pointer-events: none; opacity: 1;
    background-image:
      radial-gradient(circle at 20% 20%, rgba(232,75,15,0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(232,75,15,0.04) 0%, transparent 50%);
  }
  .hero-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(26,25,22,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,25,22,0.04) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%);
  }
  .hero-content { position: relative; z-index: 1; max-width: 700px; }
  .hero-layout {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1160px;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 34px;
    align-items: center;
  }
  .hero-copy { text-align: left; }
  .hero-visual {
    background: rgba(255,255,255,0.72);
    border: 1px solid rgba(26,25,22,0.08);
    border-radius: 24px;
    padding: 14px;
    box-shadow: var(--shadow-md);
    backdrop-filter: blur(12px);
  }
  .hero-visual img {
    width: 100%;
    display: block;
    border-radius: 18px;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(232,75,15,0.08); border: 1px solid rgba(232,75,15,0.2);
    color: #C43800; padding: 6px 16px; border-radius: 100px;
    font-size: 12px; font-weight: 600; margin-bottom: 28px; letter-spacing: 0.02em;
  }
  .hero-badge-dot {
    width: 6px; height: 6px; background: var(--or); border-radius: 50%;
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  .hero-h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(42px, 7vw, 76px);
    font-weight: 800; line-height: 1.02; letter-spacing: -0.035em;
    color: var(--ink); margin-bottom: 24px;
  }
  .hero-h1 em { font-style: normal; color: var(--or); }
  .hero-p {
    font-size: clamp(15px, 2.2vw, 17px); font-weight: 300;
    color: var(--ink2); line-height: 1.75; max-width: 500px;
    margin: 0 auto 36px;
  }
  .hero-p strong { font-weight: 500; color: var(--ink); }
  .hero-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 64px; }
  .btn-primary {
    background: var(--or); color: #fff; padding: 14px 28px; border-radius: 11px;
    font-size: 14px; font-weight: 600; text-decoration: none;
    display: inline-flex; align-items: center; gap: 7px; transition: background 0.18s, transform 0.18s;
  }
  .btn-primary:hover { background: #C43800; transform: translateY(-1px); }
  .btn-secondary {
    background: transparent; color: var(--ink2); padding: 14px 28px; border-radius: 11px;
    font-size: 14px; font-weight: 500; text-decoration: none; border: 1px solid var(--border2);
    display: inline-flex; align-items: center; gap: 7px; transition: border-color 0.18s, color 0.18s;
  }
  .btn-secondary:hover { border-color: var(--ink3); color: var(--ink); }

  .hero-stats {
    display: flex; justify-content: center; gap: 0;
    border: 1px solid var(--border2); border-radius: var(--r);
    background: var(--white); overflow: hidden;
    box-shadow: var(--shadow); max-width: 420px; margin: 0 auto;
  }
  .hero-stat {
    flex: 1; padding: 20px 16px; text-align: center;
    border-right: 1px solid var(--border);
  }
  .hero-stat:last-child { border-right: none; }
  .hero-stat-n {
    font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800;
    color: var(--ink); display: block; margin-bottom: 3px;
  }
  .hero-stat-l { font-size: 11px; color: var(--ink3); font-weight: 500; letter-spacing: 0.04em; }

  .section { padding: 96px 0; }
  .section-inner { max-width: 1100px; margin: 0 auto; padding: 0 28px; }
  .section-head { text-align: center; margin-bottom: 56px; }
  .eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--or); margin-bottom: 14px;
  }
  .eyebrow::before, .eyebrow::after {
    content: ''; display: block; width: 18px; height: 1px;
    background: var(--or); opacity: 0.45;
  }
  .section-h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 4.2vw, 46px);
    font-weight: 800; line-height: 1.1; color: var(--ink);
    letter-spacing: -0.025em; margin-bottom: 16px;
  }
  .section-h2 span { color: var(--or); }
  .section-sub { font-size: 15px; color: var(--ink2); max-width: 460px; margin: 0 auto; line-height: 1.8; font-weight: 300; }

  .prob-section { background: var(--white); }
  .prob-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
  .prob-card {
    background: var(--cream); border: 1px solid var(--border); border-radius: var(--r);
    padding: 30px 26px; transition: border-color 0.2s, transform 0.2s;
  }
  .prob-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .prob-emoji { font-size: 30px; margin-bottom: 14px; display: block; }
  .prob-card h3 {
    font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800;
    color: var(--ink); margin-bottom: 8px;
  }
  .prob-card p { font-size: 13.5px; color: var(--ink2); line-height: 1.75; font-weight: 300; }

  .how-section { background: var(--cream2); }
  .steps { display: flex; flex-direction: column; gap: 0; }
  .step {
    display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center;
    padding: 56px 0; border-bottom: 1px solid var(--border);
  }
  .step:last-child { border-bottom: none; }
  .step.flip { direction: rtl; }
  .step.flip > * { direction: ltr; }
  .step-num {
    font-family: 'Syne', sans-serif; font-size: 80px; font-weight: 800;
    color: rgba(232,75,15,0.07); line-height: 1; margin-bottom: -18px; letter-spacing: -0.05em;
  }
  .step-icon {
    width: 46px; height: 46px; background: rgba(232,75,15,0.09);
    border-radius: 13px; display: flex; align-items: center;
    justify-content: center; font-size: 22px; margin-bottom: 16px;
    border: 1px solid rgba(232,75,15,0.18);
  }
  .step h3 {
    font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800;
    color: var(--ink); margin-bottom: 10px; letter-spacing: -0.02em;
  }
  .step p { font-size: 14px; color: var(--ink2); line-height: 1.8; font-weight: 300; }
  .step-visual {
    background: var(--white); border: 1px solid var(--border); border-radius: var(--r);
    overflow: hidden; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center;
    box-shadow: var(--shadow);
  }
  .step-visual img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .step-visual-fallback {
    width: 100%; height: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 14px; padding: 28px;
  }
  .mock-code {
    width: 100%; background: var(--cream); border-radius: 9px; padding: 16px;
    font-size: 11.5px; font-family: 'Courier New', monospace; color: #C43800;
    line-height: 1.65; border: 1px solid var(--border2);
  }
  .mock-label { font-size: 11px; color: var(--ink3); text-align: center; }

  .feat-section { background: var(--cream); }
  .feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
  .feat-card {
    background: var(--white); border: 1px solid var(--border); border-radius: var(--r);
    padding: 26px 22px; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .feat-card:hover { border-color: var(--border2); box-shadow: var(--shadow); }
  .feat-card.featured { background: #FFF7F4; border-color: rgba(232,75,15,0.25); }
  .feat-icon {
    width: 40px; height: 40px; background: var(--cream); border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; margin-bottom: 14px; border: 1px solid var(--border);
  }
  .feat-card h3 {
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800;
    color: var(--ink); margin-bottom: 7px;
  }
  .feat-card p { font-size: 13px; color: var(--ink2); line-height: 1.7; font-weight: 300; }
  .feat-badge {
    display: inline-flex; margin-top: 12px;
    background: rgba(232,75,15,0.1); color: #C43800;
    font-size: 10px; font-weight: 700; padding: 4px 10px;
    border-radius: 100px; letter-spacing: 0.08em;
    border: 1px solid rgba(232,75,15,0.2);
  }

  .demo-section { background: var(--white); }
  .demo-container {
    background: var(--cream); border: 1px solid var(--border2); border-radius: 18px;
    overflow: hidden; box-shadow: var(--shadow-md);
  }
  .demo-topbar {
    background: var(--white); border-bottom: 1px solid var(--border);
    padding: 14px 22px; display: flex; align-items: center; gap: 12px;
  }
  .demo-topbar-dots { display: flex; gap: 6px; }
  .demo-dot { width: 10px; height: 10px; border-radius: 50%; }
  .demo-topbar-title {
    font-size: 12px; color: var(--ink3); font-weight: 500; letter-spacing: 0.02em;
  }
  .demo-body { display: grid; grid-template-columns: 1fr 1fr; min-height: 440px; }
  .demo-left {
    padding: 28px; border-right: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 14px;
  }
  .demo-right { padding: 28px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; max-height: 480px; }
  .demo-field-label {
    font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.12em; color: var(--ink3); margin-bottom: 6px; display: block;
  }
  .demo-ta {
    width: 100%; background: var(--white); border: 1px solid var(--border2);
    border-radius: 10px; color: var(--ink); font-family: 'Courier New', monospace;
    font-size: 12px; padding: 14px 16px; resize: vertical; outline: none; min-height: 130px;
    line-height: 1.65; transition: border-color 0.18s;
  }
  .demo-ta:focus { border-color: var(--or); }
  .demo-ta::placeholder { color: var(--ink4); }
  .demo-actions { display: flex; gap: 8px; }
  .demo-submit-btn {
    flex: 1; background: var(--or); color: #fff; padding: 13px 22px;
    border-radius: 10px; font-size: 14px; font-weight: 600;
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.18s; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .demo-submit-btn:hover:not(:disabled) { background: #C43800; }
  .demo-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .demo-example-btn {
    background: var(--white); color: var(--ink2); border: 1px solid var(--border2);
    padding: 13px 16px; border-radius: 10px; font-size: 12px; font-weight: 500;
    cursor: pointer; transition: border-color 0.18s; white-space: nowrap;
  }
  .demo-example-btn:hover { border-color: var(--ink3); color: var(--ink); }
  .demo-hint { font-size: 11px; color: var(--ink4); line-height: 1.6; }
  .demo-empty {
    height: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 10px;
    color: var(--ink3); text-align: center;
  }
  .demo-empty-icon { font-size: 32px; opacity: 0.3; }
  .demo-empty-t { font-size: 13px; font-weight: 400; }
  .demo-empty-sub { font-size: 11px; color: var(--ink4); }
  .demo-result-header {
    font-size: 10.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.12em; color: var(--or); margin-bottom: 10px;
    display: flex; align-items: center; gap: 6px;
  }
  .demo-result-box {
    background: var(--white); border: 1px solid var(--border); border-radius: 10px;
    padding: 18px; font-size: 13.5px; color: var(--ink2);
    line-height: 1.8; font-weight: 300;
  }
  .loading-dots { display: flex; gap: 5px; align-items: center; justify-content: center; padding: 32px; }
  .loading-dot {
    width: 7px; height: 7px; border-radius: 50%; background: var(--or);
    animation: ldot 1.1s ease-in-out infinite;
  }
  .loading-dot:nth-child(2) { animation-delay: 0.18s; }
  .loading-dot:nth-child(3) { animation-delay: 0.36s; }
  @keyframes ldot { 0%,100% { opacity: 0.25; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }

  .footer {
    background: var(--cream); border-top: 1px solid var(--border);
    padding: 36px 28px; text-align: center;
  }
  .footer p { font-size: 13px; color: var(--ink3); font-weight: 400; }

  @media (max-width: 768px) {
    .prob-grid, .feat-grid { grid-template-columns: 1fr; }
    .step, .step.flip { grid-template-columns: 1fr; direction: ltr; gap: 24px; }
    .demo-body { grid-template-columns: 1fr; }
    .demo-left { border-right: none; border-bottom: 1px solid var(--border); }
    .nav-links { display: none; }
    .hero-stats { max-width: 100%; }
    .hero-layout { grid-template-columns: 1fr; }
    .hero-copy { text-align: center; }
  }

  @media (max-width: 560px) {
    .nav-inner { padding: 0 18px; }
    .hero { padding-top: 112px; }
    .hero-btns { flex-direction: column; }
    .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
    .demo-actions { flex-direction: column; }
    .demo-submit-btn, .demo-example-btn { width: 100%; }
    .hero-stats { flex-direction: column; }
    .hero-stat { border-right: none; border-bottom: 1px solid var(--border); }
    .hero-stat:last-child { border-bottom: none; }
  }
`;

const EXAMPLE_ERROR = EXAMPLE_ERRORS?.[0]?.error || "TypeError: Cannot read properties of undefined (reading 'map')";

function normalizeResponse(data) {
  if (!data) return null;

  return {
    response_mode: data.response_mode || "fallback",
    meaning: data.meaning || "",
    analogy: data.analogy || "",
    cause: data.cause || data.reason || "",
    fix_steps: data.fix_steps || "",
    example_code: data.example_code || "",
    summary: data.summary || "",
    pro_tip: data.pro_tip || ""
  };
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [errorInput, setErrorInput] = useState("");
  const [language, setLanguage] = useState("Hinglish");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleDemo = async () => {
    if (!errorInput.trim() || loading) return;

    setLoading(true);
    setResult(null);
    setErrorMessage("");

    try {
      const response = await explainCode(errorInput.trim(), language);
      setResult(normalizeResponse(response.data));
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "Backend se live explanation aati hai. Agar OpenAI quota/permission issue ho, app safe fallback JSON dikhata hai taaki demo kabhi break na ho."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{style}</style>

      <nav className={`nav${scrolled ? " solid" : ""}`}>
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <div className="nav-logo-mark">C</div>
            <span className="nav-logo-text">Code<span>Mitra</span></span>
          </a>
          <div className="nav-links">
            <a href="#problem">Problem</a>
            <a href="#how">Kaise</a>
            <a href="#features">Features</a>
            <a href="#demo">Demo</a>
          </div>
          <a href="#demo" className="nav-cta">Try Now →</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg-pattern" />
        <div className="hero-grid" />
        <div className="hero-layout">
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              India ka pehla Hinglish coding companion
            </div>
            <h1 className="hero-h1">
              Error samjho,<br />
              <em>code banao.</em>
            </h1>
            <p className="hero-p">
              <strong>CodeMitra</strong> har error ko beginner-friendly Hindi, Hinglish, ya English mein explain karta hai —
              jaise koi dost samjhaye, koi teacher nahi.
            </p>
            <div className="hero-btns">
              <a href="#demo" className="btn-primary">Abhi try karo ⚡</a>
              <a href="#how" className="btn-secondary">Kaise kaam karta hai →</a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-n">10k+</span>
                <span className="hero-stat-l">Errors Solved</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-n">Hindi</span>
                <span className="hero-stat-l">First Language</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-n">Free</span>
                <span className="hero-stat-l">Try Karo</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <img src="/hero-illustration.svg" alt="CodeMitra demo illustration" />
          </div>
        </div>
      </section>

      <section id="problem" className="section prob-section">
        <div className="section-inner">
          <div className="section-head">
            <div className="eyebrow">The Problem</div>
            <h2 className="section-h2">Errors samajhna <span>kyun mushkil hai?</span></h2>
            <p className="section-sub">English documentation padh ke thak gaye? Hum samajhte hain tumhari problem.</p>
          </div>
          <div className="prob-grid">
            <div className="prob-card">
              <span className="prob-emoji">😰</span>
              <h3>Error dekha, samjha nahi</h3>
              <p>Technical terms beginners ke liye confusing hote hain. Stack Overflow bhi help nahi karta.</p>
            </div>
            <div className="prob-card">
              <span className="prob-emoji">📋</span>
              <h3>Blind copy-paste culture</h3>
              <p>Sirf kaam chal jata hai, logic samajh nahi aata. Agla baar wahi galti dobara hoti hai.</p>
            </div>
            <div className="prob-card">
              <span className="prob-emoji">🧠</span>
              <h3>Cognitive mismatch</h3>
              <p>Sochte ho Hindi mein, padhte ho English mein. Yahi gap confusion create karta hai.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="section how-section">
        <div className="section-inner">
          <div className="section-head">
            <h2 className="section-h2">Teen steps mein <span>error solve</span></h2>
          </div>
          <div className="steps">
            {[
              {
                n: "01",
                icon: "📋",
                title: "Error copy karo",
                desc: "Jab bhi terminal ya browser console mein error aaye, bas woh message copy karo aur yahan paste karo.",
                imgSrc: "/img1.svg",
                imgAlt: "Error copy step",
                mockCode: "TypeError: Cannot read\nproperties of undefined\n(reading 'map')\n\n    at App.js:47:23",
                mockLabel: "Terminal error → paste karo",
                flip: false
              },
              {
                n: "02",
                icon: "🤖",
                title: "AI analyze karta hai",
                desc: "CodeMitra error ka context samajhta hai — line number, file name, aur exact root cause detect karta hai.",
                imgSrc: "/img2.svg",
                imgAlt: "AI analysis step",
                mockCode: "Analyzing...\n> File: App.js:47\n> Type: TypeError\n> Cause: undefined.map()\n> Severity: High",
                mockLabel: "Real-time analysis",
                flip: true
              },
              {
                n: "03",
                icon: "💡",
                title: "Hinglish mein jawab",
                desc: "Ek dost ki tarah simple Hinglish mein explanation milegi — kya hua, kyun hua, aur step-by-step kaise fix karein.",
                imgSrc: "/img3.svg",
                imgAlt: "Hinglish explanation step",
                mockCode: "Yaar, problem simple hai!\nTumhara array abhi bhi\nload ho raha hai. Pehle\ncheck karo:\nif (data) data.map(...)",
                mockLabel: "Dost ki tarah explain",
                flip: false
              }
            ].map((s, i) => (
              <div key={s.n} className={`step${s.flip ? " flip" : ""}`}>
                <div>
                  <div className="step-num">{s.n}</div>
                  <div className="step-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                <div className="step-visual">
                  <img
                    src={s.imgSrc}
                    alt={s.imgAlt}
                    onError={() => {
                      /* let CSS fallback handle broken assets */
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="section feat-section">
        <div className="section-inner">
          <div className="section-head">
            <div className="eyebrow">Features</div>
            <h2 className="section-h2">Jo aur koi <span>nahi deta</span></h2>
          </div>
          <div className="feat-grid">
            {[
              { icon: "🌐", title: "Hinglish Explanation", desc: "Sochte ho Hindi mein, milta hai Hinglish mein. Koi cognitive gap nahi.", hot: true },
              { icon: "🔍", title: "Root Cause Analysis", desc: "Sirf symptom nahi, asli cause bhi batata hai. Dobara same mistake nahi.", hot: false },
              { icon: "🛠️", title: "Fix Suggestions", desc: "Step-by-step code fix, copy-paste ready format mein milti hai.", hot: false },
              { icon: "📚", title: "Concept Explain", desc: "Error se related concept bhi samjhata hai — teacher ki tarah.", hot: false },
              { icon: "⚡", title: "Instant Response", desc: "Seconds mein jawab. Coding flow kabhi break nahi hoti.", hot: false },
              { icon: "🆓", title: "Bilkul Free", desc: "Koi signup, koi credit card. Bas paste karo aur samjho.", hot: false }
            ].map((f, i) => (
              <div key={i} className={`feat-card${f.hot ? " featured" : ""}`}>
                <div className="feat-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                {f.hot && <span className="feat-badge">CORE FEATURE</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="section demo-section">
        <div className="section-inner">
          <div className="section-head">
            <div className="eyebrow">Live Demo</div>
            <h2 className="section-h2">Apna error <span>abhi samjho</span></h2>
            <p className="section-sub">Koi bhi error paste karo — JavaScript, Python, Java, kuch bhi chalega.</p>
          </div>

          <div className="demo-container">
            <div className="demo-topbar">
              <div className="demo-topbar-dots">
                <div className="demo-dot" style={{ background: "#FF5F57" }} />
                <div className="demo-dot" style={{ background: "#FEBC2E" }} />
                <div className="demo-dot" style={{ background: "#28C840" }} />
              </div>
              <span className="demo-topbar-title">CodeMitra — Error Explainer</span>
            </div>
            <div className="demo-body">
              <div className="demo-left">
                <div>
                  <span className="demo-field-label">Apna error yahan paste karo</span>
                  <textarea
                    className="demo-ta"
                    value={errorInput}
                    onChange={(e) => {
                      setErrorInput(e.target.value);
                      setErrorMessage("");
                    }}
                    placeholder={`Example:\n${EXAMPLE_ERROR}`}
                    rows={7}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleDemo();
                    }}
                  />
                </div>

                <div>
                  <span className="demo-field-label">Language select karo</span>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {LANGUAGES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="demo-example-btn"
                        onClick={() => setLanguage(item)}
                        style={{
                          borderColor: language === item ? "var(--or)" : "var(--border2)",
                          color: language === item ? "var(--ink)" : "var(--ink2)",
                          background: language === item ? "#FFF7F4" : "var(--white)"
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="demo-actions">
                    <button className="demo-submit-btn" onClick={handleDemo} disabled={loading || !errorInput.trim()} type="button">
                      {loading ? <><span>Samajh raha hoon</span><span>...</span></> : "⚡ Samjhao!"}
                    </button>
                    <button className="demo-example-btn" onClick={() => setErrorInput(EXAMPLE_ERROR)} type="button">
                      Example
                    </button>
                  </div>
                  <p className="demo-hint">Ctrl+Enter se submit karo. Backend live hai, fallback bhi ready hai.</p>
                </div>
              </div>

              <div className="demo-right">
                {loading && (
                  <div className="demo-empty">
                    <div className="loading-dots">
                      <div className="loading-dot" />
                      <div className="loading-dot" />
                      <div className="loading-dot" />
                    </div>
                    <div className="demo-empty-t">Samajh raha hoon tumhara error...</div>
                    <div className="demo-empty-sub">Root cause aur fix steps nikal raha hoon</div>
                  </div>
                )}

                {!loading && result && (
                  <>
                    <div className="demo-result-header">
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--or)", display: "inline-block" }} />
                      {result.response_mode === "live" ? "CodeMitra ka live jawab" : "CodeMitra ka fallback jawab"}
                    </div>
                    <div className="demo-result-box">
                      <div style={{ marginBottom: 14 }}>
                        <strong style={{ color: "var(--ink)", display: "block", marginBottom: 4 }}>Kya hua</strong>
                        <div>{result.meaning}</div>
                      </div>
                      <div style={{ marginBottom: 14 }}>
                        <strong style={{ color: "var(--ink)", display: "block", marginBottom: 4 }}>Kyun hua</strong>
                        <div>{result.cause}</div>
                      </div>
                      <div style={{ marginBottom: 14 }}>
                        <strong style={{ color: "var(--ink)", display: "block", marginBottom: 4 }}>Kaise fix karein</strong>
                        <div style={{ whiteSpace: "pre-wrap" }}>{result.fix_steps}</div>
                      </div>
                      <div style={{ marginBottom: 14 }}>
                        <strong style={{ color: "var(--ink)", display: "block", marginBottom: 4 }}>Example code</strong>
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "Courier New, monospace", fontSize: 12.5, color: "#C43800" }}>{result.example_code}</pre>
                      </div>
                      <div>
                        <strong style={{ color: "var(--ink)", display: "block", marginBottom: 4 }}>Pro Tip</strong>
                        <div>{result.pro_tip || result.summary}</div>
                      </div>
                    </div>
                  </>
                )}

                {!loading && !result && (
                  <div className="demo-empty">
                    <div className="demo-empty-icon">🤖</div>
                    <div className="demo-empty-t">Error paste karo,<br />main Hinglish mein explain karunga</div>
                    <div className="demo-empty-sub">Type something and hit Samjhao!</div>
                  </div>
                )}

                {errorMessage && (
                  <div className="demo-result-box" style={{ borderColor: "rgba(194,48,10,0.2)", background: "#FFF7F5", color: "#A33B1B" }}>
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>©️ 2026 CodeMitra — Made with ❤️ in India</p>
      </footer>
    </>
  );
}

export default App;
