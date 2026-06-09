import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "../services/firebase";

function ManageCemeteries() {
  const [cemeteries, setCemeteries] =
    useState([]);

  const [provinceName, setProvinceName] =
    useState("");

  const [cityName, setCityName] =
    useState("");

  const [cemeteryName, setCemeteryName] =
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

      data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setCemeteries(data);
    } catch (error) {
      console.error(error);
    }
  };

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

  const createDocumentId = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleAdd = async () => {
    if (
      !provinceName ||
      !cityName ||
      !cemeteryName
    ) {
      alert(
        "Please complete all fields"
      );
      return;
    }

    const formattedCity =
      toTitleCase(cityName);

    const formattedCemetery =
      toTitleCase(cemeteryName);

    const cemeteryId =
      createDocumentId(
        formattedCemetery
      );

    try {
      await setDoc(
        doc(
          db,
          "cemeteries",
          cemeteryId
        ),
        {
          name:
            formattedCemetery,

          provinceName,

          cityName:
            formattedCity,

          active: true,
        }
      );

      setProvinceName("");
      setCityName("");
      setCemeteryName("");

      await loadCemeteries();

      alert(
        "Cemetery added successfully"
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="table-container">
      <h1>Cemeteries</h1>

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <select
          value={provinceName}
          onChange={(e) =>
            setProvinceName(
              e.target.value
            )
          }
        >
          <option value="">
            Select Province
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

        <input
          type="text"
          placeholder="City"
          value={cityName}
          onChange={(e) =>
            setCityName(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Cemetery Name"
          value={cemeteryName}
          onChange={(e) =>
            setCemeteryName(
              e.target.value
            )
          }
        />

        <button
          onClick={handleAdd}
          style={{
            marginLeft: "10px",
          }}
        >
          Add Cemetery
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Cemetery</th>
            <th>City</th>
            <th>Province</th>
          </tr>
        </thead>

        <tbody>
          {cemeteries.map(
            (cemetery) => (
              <tr
                key={
                  cemetery.id
                }
              >
                <td>
                  {
                    cemetery.name
                  }
                </td>

                <td>
                  {
                    cemetery.cityName
                  }
                </td>

                <td>
                  {
                    cemetery.provinceName
                  }
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageCemeteries;