"use client";

import * as React from "react";

export default function NewInstitutionsPage() {
  const [isSubmitting, useIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    useIsSubmitting(true);

    const institutionName = (e.target as HTMLFormElement).institution.value;
    const email = (e.target as HTMLFormElement).email.value;

    try {
      fetch("/api/new-institutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ institutionName, email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setMessage(
              "Thank you for your submission! We will review your request and get back to you.",
            );
            (e.target as HTMLFormElement).reset();
          } else {
            setMessage(data.error || "Failed to submit. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error submitting institution:", error);
          setMessage(
            "There was an error submitting your request. Please try again later.",
          );
        })
        .finally(() => {
          useIsSubmitting(false);
        });
    } catch (error) {
      console.error("Error submitting institution:", error);
      setMessage(
        "There was an error submitting your request. Please try again later.",
      );
      useIsSubmitting(false);
    }
  };
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: 800,
        margin: "0 auto",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
        New Institution
      </h1>
      {message && (
        <p style={{ fontSize: "1rem", color: "#555", lineHeight: 1.5, textDecoration: 'italic' }}>
          {message}
        </p>
      )}
      <div>
        <form onSubmit={handleSubmit}>
          <p style={{ fontSize: "1.05rem", color: "#555", lineHeight: 1.5 }}>
            Please provide the name of your institution below:
          </p>
          <div>
            {" "}
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              style={{
                width: "100%",
                padding: "8px",
                margin: ".5rem 0 1rem 0",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <input
              type="text"
              name="institution"
              placeholder="Institution Name, State"
              style={{
                width: "100%",
                padding: "8px",
                margin: ".5rem 0 1rem 0",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: "#0A3D2B",
              width: "100%",
              color: "#fff",
              padding: ".5rem 0",
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <p style={{ fontSize: "1.05rem", color: "#555", lineHeight: 1.5, marginTop: "1rem" }}>
        You can also write us at{" "}
        <a
          href="mailto:hello@oakvaleltd.com"
          style={{ color: "#0070f3", textDecoration: "underline" }}
        >
          hello@oakvaleltd.com
        </a>
      </p>
    </div>
  );
}
