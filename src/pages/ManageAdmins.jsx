import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "../services/firebase";

function ManageAdmins() {
  const [admins, setAdmins] =
    useState([]);

  const [email, setEmail] =
    useState("");

  const [uid, setUid] =
    useState("");

  const [active, setActive] =
    useState(true);

  const [role, setRole] =
    useState("cemetery_admin");

  const [cemeteries, setCemeteries] =
    useState([]);

  const [cemeteryId, setCemeteryId] =
    useState("");

  useEffect(() => {
    loadAdmins();
    loadCemeteries();
  }, []);

  const loadAdmins = async () => {
    const snapshot =
      await getDocs(
        collection(db, "admins")
      );

    const data =
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    setAdmins(data);
  };

  const loadCemeteries =
    async () => {
      const snapshot =
        await getDocs(
          collection(
            db,
            "cemeteries"
          )
        );

      const data =
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      setCemeteries(data);
    };

    const handleSave =
    async () => {

        if (!uid || !email) {
        alert(
            "Please enter UID and Email"
        );
        return;
        }

        try {

        let cemeteryName = "";
        let provinceName = "";
        let cityName = ""; 

        if (
            role ===
            "cemetery_admin"
        ) {
            const cemetery =
            cemeteries.find(
                (c) =>
                c.id ===
                cemeteryId
            );

            if (!cemetery) {
            alert(
                "Please select a cemetery"
            );

            return;
            }

            cemeteryName =
              cemetery.name;

            provinceName =
              cemetery.provinceName;

            cityName =
              cemetery.cityName;
        }

        await setDoc(
            doc(
            db,
            "admins",
            uid
            ),
            {
            uid,

            email,

            role,

            active,

            cemeteryId:
                role ===
                "cemetery_admin"
                ? cemeteryId
                : "",

            cemeteryName:
              role ===
              "cemetery_admin"
                ? cemeteryName
                : "",

            provinceName:
              role ===
              "cemetery_admin"
                ? provinceName
                : "",

            cityName:
              role ===
              "cemetery_admin"
                ? cityName
                : "",
            }
        );

        alert(
            "Admin created successfully"
        );

        setUid("");
        setEmail("");
        setRole(
            "cemetery_admin"
        );
        setCemeteryId("");

        loadAdmins();

        } catch (error) {
        alert(
            error.message
        );
        }
    };

  return (
    <div className="table-container">
      <h1>
        Manage Admins
      </h1>

        <input
        type="text"
        placeholder="Firebase UID"
        value={uid}
        onChange={(e) =>
            setUid(
            e.target.value
            )
        }
        />

        <br />
        <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <select
        value={role}
        onChange={(e) =>
          setRole(
            e.target.value
          )
        }
      >
        <option value="super_admin">
          Super Admin
        </option>

        <option value="cemetery_admin">
          Cemetery Admin
        </option>
      </select>

      <br />
      <br />

      {role ===
        "cemetery_admin" && (
        <>
          <select
            value={
              cemeteryId
            }
            onChange={(
              e
            ) =>
              setCemeteryId(
                e.target
                  .value
              )
            }
          >
            <option value="">
              Select Cemetery
            </option>

            {cemeteries.map(
              (
                cemetery
              ) => (
                <option
                  key={
                    cemetery.id
                  }
                  value={
                    cemetery.id
                  }
                >
                  {
                    cemetery.name
                  }
                </option>
              )
            )}
          </select>

          <br />
          <br />
        </>
      )}

        <label>
        <input
            type="checkbox"
            checked={active}
            onChange={(e) =>
            setActive(
                e.target.checked
            )
            }
        />

        Active
        </label>

        <br />
        <br />
        <br />


      <button
        onClick={
          handleSave
        }
      >
        Create Admin
      </button>

      <hr />

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Cemetery</th>
            <th>Active</th>
          </tr>
        </thead>

        <tbody>
          {admins.map(
            (admin) => (
              <tr
                key={
                  admin.id
                }
              >
                <td>
                  {
                    admin.email
                  }
                </td>

                <td>
                  {
                    admin.role
                  }
                </td>

                <td>
                  {
                  admin.cemeteryName
                  }
                </td>

                <td>
                {admin.active
                    ? "Yes"
                    : "No"}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageAdmins;