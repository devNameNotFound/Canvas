const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Initiera SQLite-databas
const db = new sqlite3.Database(path.resolve(__dirname, "studieresultat.db"), (err) => {
  if (err) {
    console.error("Fel vid anslutning till SQLite:", err.message);
  } else {
    console.log("Ansluten till SQLite-databasen.");
  }
});

// Skapa tabell om den inte finns
db.run(`
  CREATE TABLE IF NOT EXISTS studieresultat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ideal TEXT NOT NULL,
    kurskod TEXT NOT NULL,
    termin TEXT NOT NULL,
    provnr TEXT NOT NULL,
    datum TEXT NOT NULL,
    betyg TEXT NOT NULL
  )
`);

app.post("/api/registrera-betyg", (req, res) => {
  const { ideal, kurskod, termin, provnr, datum, betyg } = req.body;

  if (!ideal || !kurskod || !termin || !provnr || !datum || !betyg) {
    return res.status(400).json({ error: "Alla fält måste fyllas i." });
  }

  const sql = `INSERT INTO studieresultat (ideal, kurskod, termin, provnr, datum, betyg) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [ideal, kurskod, termin, provnr, datum, betyg];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Fel vid databasinsättning:", err.message);
      return res.status(500).json({ error: "Databasfel vid registrering." });
    }
    console.log("Registrerat studieresultat med ID:", this.lastID);
    res.status(200).json({ message: "Betyg registrerat." });
  });
});

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
