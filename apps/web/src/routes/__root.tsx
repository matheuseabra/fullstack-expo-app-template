import {
  HeadContent,
  Outlet,
  createRootRoute,
} from "@tanstack/react-router";
import "../index.css";

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "Daymark: Make room for the next right thing",
      },
      {
        name: "description",
        content:
          "Daymark is a calm, mobile-first task companion for keeping your day clear and moving.",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/daymark-favicon-black.svg?v=1",
        type: "image/svg+xml",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  );
}
