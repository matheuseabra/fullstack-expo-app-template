import { ArrowDown, ArrowRight, ArrowUpRight, Check, Circle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

type Feature = {
  number: string;
  label: string;
  title: string;
  description: string;
  Icon: LucideIcon;
};

const features: Feature[] = [
  {
    number: "01",
    label: "CLARITY",
    title: "See what matters now.",
    description: "A focused home for your tasks, so the next step is always close at hand.",
    Icon: Circle,
  },
  {
    number: "02",
    label: "MOMENTUM",
    title: "Move with less friction.",
    description: "Add, complete, and reshape your day without breaking your attention.",
    Icon: ArrowRight,
  },
  {
    number: "03",
    label: "OWNERSHIP",
    title: "Make the system yours.",
    description: "A calm foundation you can grow around the way you actually work.",
    Icon: Check,
  },
];

const previewTasks = [
  { text: "Write the first draft", done: true },
  { text: "Take a proper break", done: false },
  { text: "Send the project note", done: false },
];

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <main className="marketing-page">
      <header className="marketing-header">
        <a className="brand" href="#top" aria-label="Daymark home">
          <span className="brand-mark" aria-hidden="true"><span /><span /></span>
          <span>daymark</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#principles">Why it works</a>
          <a href="#workflow">How it works</a>
          <a href="#download">Get started</a>
        </nav>
        <a className="header-link" href="#download">
          Open the app <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
        </a>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">A mobile-first task companion</p>
          <h1>Make room for the <em>next right thing.</em></h1>
          <p className="hero-description">
            Daymark gives your day a clear home — simple enough to start,
            thoughtful enough to keep.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#workflow">
              See how it works <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a className="text-link" href="#principles">
              Explore the approach <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-note"><span className="status-dot" aria-hidden="true" />Less noise. More follow-through.</div>
        </div>

        <div className="hero-visual" aria-label="Daymark mobile app preview">
          <div className="visual-label visual-label-top">Today / 09:41</div>
          <div className="phone-shadow" aria-hidden="true" />
          <div className="phone">
            <div className="phone-speaker" aria-hidden="true" />
            <div className="phone-screen">
              <div className="phone-status"><span>9:41</span><span className="phone-signal">•••</span></div>
              <div className="phone-topline"><span className="mini-mark" aria-hidden="true" /><span>Tuesday, 15 October</span></div>
              <p className="phone-greeting">Good morning, Matheus.</p>
              <div className="phone-progress-heading"><span>Today</span><span>1 of 3 done</span></div>
              <div className="phone-progress-track"><span /></div>
              <div className="phone-tasks">
                {previewTasks.map((task) => (
                  <div className="phone-task" key={task.text}>
                    <span className={`task-check${task.done ? " is-done" : ""}`}>
                      {task.done ? <Check size={12} strokeWidth={2.4} /> : null}
                    </span>
                    <span className={task.done ? "task-done" : ""}>{task.text}</span>
                  </div>
                ))}
              </div>
              <div className="phone-add-task">+ Add a task</div>
            </div>
            <div className="phone-home-indicator" aria-hidden="true" />
          </div>
          <div className="visual-label visual-label-bottom">Built for the in-between</div>
        </div>
      </section>

      <section className="proof-strip section-shell" aria-label="Product qualities">
        <span>FOR THE THINGS THAT MOVE YOU FORWARD</span><span className="proof-line" aria-hidden="true" /><span>01 — 03</span>
      </section>

      <section className="feature-section section-shell" id="principles">
        <div className="section-intro">
          <p className="eyebrow">The quiet advantage</p>
          <h2>Small choices add up to a clearer day.</h2>
        </div>
        <div className="feature-grid">
          {features.map(({ number, label, title, description, Icon }) => (
            <article className="feature-card" key={number}>
              <div className="feature-card-top"><span>{number}</span><Icon size={18} strokeWidth={1.5} aria-hidden="true" /></div>
              <p className="feature-label">{label}</p>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section section-shell" id="workflow">
        <div className="workflow-copy">
          <p className="eyebrow">A simple rhythm</p>
          <h2>Capture less. Complete more.</h2>
          <p>Daymark keeps the loop short: put something down, give it a place, and return to the work that deserves your attention.</p>
          <a className="text-link" href="#download">Start with a clearer list <ArrowRight size={15} aria-hidden="true" /></a>
        </div>
        <ol className="workflow-list">
          <li><span className="workflow-number">01</span><div><h3>Notice the next thing</h3><p>Turn the open loop in your head into one clear line.</p></div></li>
          <li><span className="workflow-number">02</span><div><h3>Keep it close</h3><p>Find your list wherever the day takes you.</p></div></li>
          <li><span className="workflow-number">03</span><div><h3>Mark the progress</h3><p>Small completions give the day its shape.</p></div></li>
        </ol>
      </section>

      <section className="download-section section-shell" id="download">
        <div className="download-panel">
          <div><p className="eyebrow eyebrow-inverse">Ready when you are</p><h2>Your next clear day starts here.</h2></div>
          <a className="button button-light" href="#top">Explore Daymark <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </section>

      <footer className="marketing-footer section-shell">
        <a className="brand" href="#top" aria-label="Daymark home"><span className="brand-mark" aria-hidden="true"><span /><span /></span><span>daymark</span></a>
        <span>Made for a little more clarity.</span><span>© 2026</span>
      </footer>
    </main>
  );
}
