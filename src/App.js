import React, { useState } from "react";

const API_URL = process.env.REACT_API_URL;

export default function Betygsregistrering() {
  const [formData, setFormData] = useState({
    ideal: "",
    kurskod: "",
    termin: "",
    provnr: "",
    datum: "",
    betyg: "",
  });

  const [meddelande, setMeddelande] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/registrera-betyg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMeddelande("Betyget är registrerat!");
        setFormData({
          ideal: "",
          kurskod: "",
          termin: "",
          provnr: "",
          datum: "",
          betyg: "",
        });
      } else {
        setMeddelande("Fel vid registrering av betyg.");
      }
    } catch (error) {
      setMeddelande("Något gick fel: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Registrera studieresultat</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="ideal" value={formData.ideal} onChange={handleChange} placeholder="Ideal (t.ex. vermak-4)" required className="w-full p-2 border rounded" />
        <input name="kurskod" value={formData.kurskod} onChange={handleChange} placeholder="Kurskod (t.ex. D0031N)" required className="w-full p-2 border rounded" />
        <input name="termin" value={formData.termin} onChange={handleChange} placeholder="Termin (t.ex. ht19)" required className="w-full p-2 border rounded" />
        <input name="provnr" value={formData.provnr} onChange={handleChange} placeholder="Provnr (t.ex. 0002)" required className="w-full p-2 border rounded" />
        <input name="datum" type="date" value={formData.datum} onChange={handleChange} required className="w-full p-2 border rounded" />
        <select name="betyg" value={formData.betyg} onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="">Välj betyg</option>
          <option value="U">U</option>
          <option value="G">G</option>
          <option value="VG">VG</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Registrera</button>
      </form>
      {meddelande && <p className="mt-4 text-center text-sm text-gray-700">{meddelande}</p>}
    </div>
  );
}
