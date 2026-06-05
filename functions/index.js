const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.post("/api/auth/exchange", async (req, res) => {
  const { idToken } = req.body || {};
  if (!idToken) return res.status(400).json({ error: "missing idToken" });
  try {
    // Verify token then create secure session cookie
    await admin.auth().verifyIdToken(idToken);
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    // Set secure httpOnly cookie
    res.cookie("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("MCP exchange error:", err);
    return res.status(401).json({ error: "auth failed" });
  }
});

app.post("/api/profile/create", async (req, res) => {
  const profile = req.body;
  if (!profile || !profile.uid) return res.status(400).json({ error: "missing profile.uid" });
  try {
    const db = admin.firestore();
    await db.collection("users").doc(profile.uid).set({ ...profile, serverCreatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("profile create error:", err);
    return res.status(500).json({ error: "failed to create profile" });
  }
});

exports.api = functions.https.onRequest(app);
