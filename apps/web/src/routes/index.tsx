import { ArrowUpRight } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";

import { Feature1 } from "../components/feature1";

type FeatureBlock = {
  title: string;
  description: string;
  crop: "week" | "search";
  image: {
    src: string;
    alt: string;
  };
};

const featureBlocks: FeatureBlock[] = [
  {
    title: "Review your week",
    description:
      "See what is ahead and make room for the work that matters. A simple weekly view keeps the bigger picture close without adding noise.",
    crop: "week",
    image: {
      src: "/daymark-week.png",
      alt: "Daymark Week screen showing the current week and calendar view.",
    },
  },
  {
    title: "Find the next task",
    description:
      "Search every open task in one place. Find the line you need without digging through the day.",
    crop: "search",
    image: {
      src: "/daymark-search.png",
      alt: "Daymark Search screen with an open task search field.",
    },
  },
];

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function StoreBadges({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`store-badges${inverse ? " store-badges-inverse" : ""}`} aria-label="Download Daymark">
      <StoreBadge iconSrc="/apple.svg" prompt="Download on the" label="App Store" platform="iOS" />
      <StoreBadge iconSrc="/google-play.svg" prompt="GET IT ON" label="Google Play" platform="Android" />
    </div>
  );
}

function StoreBadge({ iconSrc, prompt, label, platform }: { iconSrc: string; prompt: string; label: string; platform: string }) {
  return (
    <a className={`store-badge${platform === "iOS" ? " store-badge-apple" : ""}`} href="#download" aria-label={`Download Daymark for ${platform}`}>
      <img className="store-badge-icon" src={iconSrc} alt="" aria-hidden="true" />
      <span className="store-badge-copy">
        <small>{prompt}</small>
        <strong>{label}</strong>
      </span>
    </a>
  );
}

function PhoneFrame({ image }: { image: FeatureBlock["image"] }) {
  return (
    <div className="phone">
      <img className="phone-screen-image" src={image.src} alt={image.alt} />
    </div>
  );
}

function PhonePreview() {
  return (
    <div className="hero-visual" aria-label="Daymark Today screen preview">
      <div className="phone-shadow" aria-hidden="true" />
      <PhoneFrame
        image={{
          src: "/daymark-home.png",
          alt: "Daymark Today screen showing sample tasks and bottom navigation.",
        }}
      />
    </div>
  );
}

function FeatureCrop({ image, crop }: { image: FeatureBlock["image"]; crop: FeatureBlock["crop"] }) {
  return (
    <div className={`feature-crop feature-crop-${crop}`}>
      <img src={image.src} alt={image.alt} />
    </div>
  );
}

function HomeComponent() {
  return (
    <main className="marketing-page">
      <header className="marketing-header">
        <a className="brand" href="#top" aria-label="Daymark home">
          <img className="brand-icon" src="/daymark-icon.png" alt="" aria-hidden="true" />
          <span>daymark</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#how-it-works">How it works</a>
        </nav>
        <a className="header-link" href="#download">
          Get the app <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
        </a>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <h1>Make room for the next right thing.</h1>
          <p className="hero-description">
            Daymark gives your day a clear home. Simple enough to start,
            thoughtful enough to keep.
          </p>
          <StoreBadges />
        </div>
        <PhonePreview />
      </section>

      <section className="features-section section-shell" id="how-it-works">
        <div className="features-stack">
          {featureBlocks.map(({ title, description, image, crop }, index) => (
            <Feature1
              key={title}
              className={index === 0 ? "feature-block-reversed" : undefined}
              heading={title}
              description={description}
              visual={<FeatureCrop crop={crop} image={image} />}
            />
          ))}
        </div>
      </section>

      <section className="download-section section-shell" id="download">
        <div className="download-panel">
          <div>
            <h2>Start your next clear day here.</h2>
          </div>
          <StoreBadges inverse />
        </div>
      </section>

      <footer className="marketing-footer section-shell">
        <a className="brand" href="#top" aria-label="Daymark home"><img className="brand-icon" src="/daymark-icon.png" alt="" aria-hidden="true" /><span>daymark</span></a>
        <span>Made for a little more clarity.</span>
        <nav className="footer-legal" aria-label="Legal">
          <a href="https://daymark.app/terms">Terms of Service</a>
          <a href="https://daymark.app/privacy">Privacy Policy</a>
        </nav>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
