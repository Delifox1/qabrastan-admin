import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";

function ViewGraves() {
  const navigate = useNavigate();

  const [graves, setGraves] = useState([]);
  const [search, setSearch] = useState("");

  const loadGraves = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "graves")
      );

      const data = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      setGraves(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this grave?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, "graves", id)
      );

      loadGraves();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  useEffect(() => {
    loadGraves();
  }, []);

  const filteredGraves = graves.filter((grave) =>
    `${grave.name} ${grave.graveNumber}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="table-container">
      <h1>View Graves</h1>

      <input
        type="text"
        placeholder="Search name or grave number..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Grave Number</th>
            <th>Date of Death</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredGraves.map((grave) => (
            <tr key={grave.id}>
              <td>{grave.name}</td>
              <td>{grave.graveNumber}</td>
              <td>{grave.dateOfDeath}</td>

              <td>
                <button
                  onClick={() =>
                    navigate(
                      `/edit-grave/${grave.id}`
                    )
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(grave.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewGraves;