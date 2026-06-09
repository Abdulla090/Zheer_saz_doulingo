import type { PropsWithChildren } from "react";

/**
 * Custom HTML root for Expo web.
 * Prevents pinch-zoom, overscroll bounce, and sets proper viewport.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en" style={{ height: "100%", overflow: "hidden" }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root {
                height: 100%;
                overflow: hidden;
                overscroll-behavior: none;
                -webkit-overflow-scrolling: touch;
                touch-action: pan-x pan-y;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
              }
              body {
                margin: 0;
                padding: 0;
                overflow: hidden;
              }
              #root {
                display: flex;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
