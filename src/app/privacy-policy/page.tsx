import React from "react";

const page: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Privacy Policy</h1>

      <p>Last Updated: {new Date().toDateString()}</p>

      <p>
        <strong>Shikshapay Student App</strong> respects your privacy and is
        committed to protecting your data.
      </p>

      <h2 style={styles.subHeading}>1. Information We Collect</h2>
      <ul>
        <li>Email address (for login)</li>
        <li>OTP verification data</li>
        <li>Student data like fees, attendance, marks</li>
      </ul>

      <h2 style={styles.subHeading}>2. Usage</h2>
      <ul>
        <li>Authentication via OTP</li>
        <li>Display academic data</li>
        <li>Conduct quizzes/tests</li>
      </ul>

      <h2 style={styles.subHeading}>3. Data Sharing</h2>
      <p>We do not sell or share your data with third parties.</p>

      <h2 style={styles.subHeading}>4. Security</h2>
      <p>Your data is securely stored and protected.</p>

      <h2 style={styles.subHeading}>5. Contact</h2>
      <p>Email: sandeepkhariwal01@gmail.com</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "Arial, sans-serif",
    lineHeight: 1.6,
    padding: "20px",
    maxWidth: "900px",
    margin: "auto",
    color: "#333",
  },
  heading: {
    color: "#2c3e50",
  },
  subHeading: {
    color: "#2c3e50",
    marginTop: "20px",
  },
};

export default page;