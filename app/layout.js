export const metadata = {
  title: "ReplyRight — Automated Google Review Responses",
  description: "AI-powered responses to every Google review. Fully automated. Professional. Instant.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#f8f5ef" }}>
        {children}
      </body>
    </html>
  );
}
