import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../services/firebase";

import CemeterySelector from "../components/CemeterySelector";

function EditGrave() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [cemeteries, setCemeteries] =
    useState([]);

  const [selectedProvince, setSelectedProvince] =
    useState("");

  const [selectedCemetery, setSelectedCemetery] =
    useState("");

  const [name, setName] =
    useState("");

  const [graveNumber, setGraveNumber] =
    useState("");

  const [dateOfDeath, setDateOfDeath] =
    useState("");

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
    loadGrave();
    loadCemeteries();
  }, []);

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

      setCemeteries(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadGrave = async () => {
    try {
      const docRef = doc(
        db,
        "graves",
        id
      );

      const docSnap =
        await getDoc(docRef);

      if (docSnap.exists()) {
        const data =
          docSnap.data();

        setName(
          data.name || ""
        );

        setGraveNumber(
          data.graveNumber || ""
        );

        setDateOfDeath(
          data.dateOfDeath || ""
        );

        setSelectedProvince(
          data.provinceName || ""
        );

        setSelectedCemetery(
          data.cemeteryId || ""
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate =
    async () => {
      const cemetery =
        cemeteries.find(
          (c) =>
            c.id ===
            selectedCemetery
        );

 if (
  !cemetery
) {
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

  const duplicate =
    existingGraves.docs.find(
      (document) =>
        document.id !== id
    );

      if (duplicate) {
        alert(
          `Grave Number ${graveNumber} already exists in ${cemetery.name}`
        );

        return;
      }

      await updateDoc(
        doc(
          db,
          "graves",
          id
        ),
        {
          name,
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
        "Grave updated successfully"
      );

      navigate(
        "/view-graves"
      );

    } catch (error) {
      alert(
        error.message
      );
    }
  };

  return (
    <div className="form-container">
      <h1>Edit Grave</h1>

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
          (province) => (
            <option
              key={
                province
              }
              value={
                province
              }
            >
              {province}
            </option>
          )
        )}
      </select>

      <br />
      <br />

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
        value={
          graveNumber
        }
        onChange={(e) =>
          setGraveNumber(
            e.target.value
          )
        }
      />

      <input
        type="date"
        value={
          dateOfDeath
        }
        onChange={(e) =>
          setDateOfDeath(
            e.target.value
          )
        }
      />

      <button
        onClick={
          handleUpdate
        }
      >
        Update Grave
      </button>
    </div>
  );
}

export default EditGrave;