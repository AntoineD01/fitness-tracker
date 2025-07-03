require('dotenv').config();
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/login/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).send({ error: 'Missing credential' });

  try {
    // Vérification du token Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Créer notre propre JWT
    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(401).send({ error: 'Invalid Google token' });
  }
});

app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
