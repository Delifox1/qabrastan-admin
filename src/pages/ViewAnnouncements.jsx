import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

function ViewAnnouncements() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);

  const loadAnnouncements = async () => {
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setAnnouncements(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    await deleteDoc(doc(db, "announcements", id));

    loadAnnouncements();
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  return (
    <div className="table-container">
      <h1>Announcements</h1>

      {announcements.map((item) => (
        <div
          key={item.id}
          className="announcement-card"
        >
          <h3>{item.title}</h3>

          <p>{item.message}</p>

          <div>
            <button
              onClick={() =>
                navigate(
                  `/edit-announcement/${item.id}`
                )
              }
            >
              Edit
            </button>

            <button
              onClick={() =>
                handleDelete(item.id)
              }
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewAnnouncements;