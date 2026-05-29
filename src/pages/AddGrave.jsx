import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";

function AddGrave() {
  const [name, setName] = useState("");
  const [graveNumber, setGraveNumber] = useState("");
  const [dateOfDeath, setDateOfDeath] = useState("");

  const handleSave = async () => {
    try {
      await addDoc(collection(db, "graves"), {
        name,
        graveNumber,
        dateOfDeath,
      });

      alert("Grave added successfully");

      setName("");
      setGraveNumber("");
      setDateOfDeath("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="form-container">
      <h1>Add Grave</h1>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Grave Number"
        value={graveNumber}
        onChange={(e) => setGraveNumber(e.target.value)}
      />

      <input
        type="date"
        value={dateOfDeath}
        onChange={(e) => setDateOfDeath(e.target.value)}
      />

      <button onClick={handleSave}>
        Save Grave
      </button>
    </div>
  );
}

export default AddGrave;