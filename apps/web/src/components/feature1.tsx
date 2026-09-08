import type { ReactNode } from "react";

import { Button } from "@fullstack-expo-app-template/ui/components/button";
import { cn } from "@fullstack-expo-app-template/ui/lib/utils";

interface Image {
  src: string;
  alt: string;
}

interface FeatureButton {
  text: string;
  url: string;
}

interface Feature1Props {
  heading: string;
  description?: string;
  image?: Image;
  visual?: ReactNode;
  buttons?: {
    secondary?: FeatureButton;
  };
  className?: string;
}

const Feature1 = ({ heading, description, image, visual, buttons, className }: Feature1Props) => (
  <section className={cn("feature-block", className)}>
    <div className="feature-block-inner">
      <div className="feature-block-copy">
        <h2>{heading}</h2>
        {description ? <p>{description}</p> : null}
        {buttons?.secondary ? (
          <Button
            variant="outline"
            render={<a href={buttons.secondary.url} />}
            nativeButton={false}
          >
            {buttons.secondary.text}
          </Button>
        ) : null}
      </div>
      <div className="feature-block-visual">
        {visual ?? (image ? <img src={image.src} alt={image.alt} /> : null)}
      </div>
    </div>
  </section>
);

export { Feature1 };
