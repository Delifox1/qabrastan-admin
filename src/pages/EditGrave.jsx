import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

function EditGrave() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [graveNumber, setGraveNumber] = useState("");
  const [dateOfDeath, setDateOfDeath] = useState("");

  useEffect(() => {
    loadGrave();
  }, []);

  const loadGrave = async () => {
    const docRef = doc(db, "graves", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      setName(data.name || "");
      setGraveNumber(data.graveNumber || "");
      setDateOfDeath(data.dateOfDeath || "");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "graves", id), {
        name,
        graveNumber,
        dateOfDeath,
      });

      alert("Grave updated successfully");

      navigate("/view-graves");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="form-container">
      <h1>Edit Grave</h1>

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

      <button onClick={handleUpdate}>
        Update Grave
      </button>
    </div>
  );
}

export default EditGrave;