import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import CemeterySelector from "../components/CemeterySelector";

function AddGrave() {
  const { user } = useAuth();

  const [cemeteries, setCemeteries] =
    useState([]);

  const [selectedProvince, setSelectedProvince] =
    useState("");

  const [selectedCemetery, setSelectedCemetery] =
    useState("");

  const [name, setName] = useState("");

  const [graveNumber, setGraveNumber] =
    useState("");

  const [dateOfDeath, setDateOfDeath] =
    useState("");

  useEffect(() => {
    loadCemeteries();
  }, []);

  useEffect(() => {
    if (
      user?.role ===
      "cemetery_admin"
    ) {
      setSelectedProvince(
        user.provinceName || ""
      );

      setSelectedCemetery(
        user.cemeteryId || ""
      );
    }
  }, [user]);

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
      alert(error.message);
    }
  };

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

  const toTitleCase = (text) => {
    return text
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  const handleSave = async () => {
    if (
      !selectedCemetery ||
      !name ||
      !graveNumber ||
      !dateOfDeath
    ) {
      alert(
        "Please complete all fields"
      );
      return;
    }

    const cemetery =
      cemeteries.find(
        (c) =>
          c.id === selectedCemetery
      );

    if (!cemetery) {
      alert(
        "Please select a cemetery"
      );
      return;
    }

    try {
      const existingGraves =
        await getDocs(
          query(
            collection(db, "graves"),
            where(
              "cemeteryId",
              "==",
              cemetery.id
            ),
            where(
              "graveNumber",
              "==",
              graveNumber
            )
          )
        );

      if (!existingGraves.empty) {
        alert(
          `Grave Number ${graveNumber} already exists in ${cemetery.name}`
        );

        return;
      }

      await addDoc(
        collection(db, "graves"),
        {
          name: toTitleCase(name),

          graveNumber,

          dateOfDeath,

          provinceName:
            cemetery.provinceName,

          cityName:
            cemetery.cityName,

          cemeteryId:
            cemetery.id,

          cemeteryName:
            cemetery.name,
        }
      );

      alert(
        "Grave added successfully"
      );

      if (
        user?.role ===
        "super_admin"
      ) {
        setSelectedProvince("");
        setSelectedCemetery("");
      }

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

      {user?.role ===
        "super_admin" && (
        <>
          <select
            value={
              selectedProvince
            }
            onChange={(e) => {
              setSelectedProvince(
                e.target.value
              );

              setSelectedCemetery(
                ""
              );
            }}
          >
            <option value="">
              Select Province
            </option>

            {provinces.map(
              (
                province
              ) => (
                <option
                  key={
                    province
                  }
                  value={
                    province
                  }
                >
                  {
                    province
                  }
                </option>
              )
            )}
          </select>

          <br />
          <br />
        </>
      )}

      {user?.role ===
      "super_admin" ? (
        <CemeterySelector
          cemeteries={
            cemeteries
          }
          selectedProvince={
            selectedProvince
          }
          selectedCemetery={
            selectedCemetery
          }
          setSelectedCemetery={
            setSelectedCemetery
          }
        />
      ) : (
        <div
          style={{
            background:
              "#f5f5f5",
            padding:
              "15px",
            borderRadius:
              "10px",
            marginBottom:
              "20px",
          }}
        >
          <strong>
            Assigned Cemetery
          </strong>

          <br />
          <br />

          {
            user?.cemeteryName
          }
        </div>
      )}

      <br />

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) =>
          setName(
            e.target.value
          )
        }
      />

      <input
        type="text"
        placeholder="Grave Number"
        value={graveNumber}
        onChange={(e) =>
          setGraveNumber(
            e.target.value
          )
        }
      />

      <input
        type="date"
        value={dateOfDeath}
        onChange={(e) =>
          setDateOfDeath(
            e.target.value
          )
        }
      />

      <button
        onClick={handleSave}
      >
        Save Grave
      </button>
    </div>
  );
}

export default AddGrave;