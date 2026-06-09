import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";

function ViewGraves() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [graves, setGraves] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [selectedProvince, setSelectedProvince] =
    useState("");

  const [selectedCemetery, setSelectedCemetery] =
    useState("");

  const [cemeteries, setCemeteries] =
    useState([]);

  const provinces = [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "North West",
    "Northern Cape",
    "Western Cape",
  ];

  useEffect(() => {
    loadGraves();
    loadCemeteries();
  }, []);

  const loadGraves = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "graves")
      );

      const data = snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setGraves(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const loadCemeteries = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "cemeteries")
      );

      const data = snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setCemeteries(data);
    } catch (error) {
      console.error(error);
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

  const filteredCemeteries =
    cemeteries.filter(
      (cemetery) =>
        !selectedProvince ||
        cemetery.provinceName ===
          selectedProvince
    );

  const filteredGraves =
    graves.filter((grave) => {

      if (
        user?.role ===
        "cemetery_admin"
      ) {
        if (
          grave.cemeteryId !==
          user.cemeteryId
        ) {
          return false;
        }
      }

      const matchesSearch =
        `${grave.name} ${grave.graveNumber}`
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesProvince =
        !selectedProvince ||
        grave.provinceName ===
          selectedProvince;

      const matchesCemetery =
        !selectedCemetery ||
        grave.cemeteryId ===
          selectedCemetery;

      return (
        matchesSearch &&
        matchesProvince &&
        matchesCemetery
      );
    });

  return (
    <div className="table-container">
      <h1>View Graves</h1>

{user?.role ===
  "super_admin" && (
  <>
    <select
      value={selectedProvince}
      onChange={(e) => {
        setSelectedProvince(
          e.target.value
        );

        setSelectedCemetery("");
      }}
    >
      <option value="">
        All Provinces
      </option>

      {provinces.map(
        (province) => (
          <option
            key={province}
            value={province}
          >
            {province}
          </option>
        )
      )}
    </select>

    <br />
    <br />

    <select
      value={selectedCemetery}
      onChange={(e) =>
        setSelectedCemetery(
          e.target.value
        )
      }
    >
      <option value="">
        All Cemeteries
      </option>

      {filteredCemeteries.map(
        (cemetery) => (
          <option
            key={cemetery.id}
            value={cemetery.id}
          >
            {cemetery.name}
          </option>
        )
      )}
    </select>

    <br />
    <br />
  </>
)}

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
            <th>Grave No</th>
            <th>Cemetery</th>
            <th>City</th>
            <th>Province</th>
            <th>Date of Death</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredGraves.map(
            (grave) => (
              <tr key={grave.id}>
                <td>{grave.name}</td>

                <td>
                  {grave.graveNumber}
                </td>

                <td>
                  {grave.cemeteryName}
                </td>

                <td>
                  {grave.cityName}
                </td>

                <td>
                  {grave.provinceName}
                </td>

                <td>
                  {grave.dateOfDeath}
                </td>

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
                      handleDelete(
                        grave.id
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewGraves;