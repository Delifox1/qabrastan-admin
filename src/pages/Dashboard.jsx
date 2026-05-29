import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../services/firebase";

function Dashboard() {
  const navigate = useNavigate();

  const [graveCount, setGraveCount] = useState(0);
  const [lastAnnouncement, setLastAnnouncement] =
    useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const gravesSnapshot = await getDocs(
        collection(db, "graves")
      );

      setGraveCount(gravesSnapshot.size);

      const announcementQuery = query(
        collection(db, "announcements"),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const announcementSnapshot =
        await getDocs(announcementQuery);

      if (!announcementSnapshot.empty) {
        setLastAnnouncement(
          announcementSnapshot.docs[0].data()
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Qabrastan Admin Dashboard</h1>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Graves</h3>
          <h1>{graveCount}</h1>
        </div>

        <div className="stat-card">
          <h3>Last Announcement</h3>

          {lastAnnouncement ? (
            <>
              <strong>
                {lastAnnouncement.title}
              </strong>

              <p>
                {lastAnnouncement.message}
              </p>
            </>
          ) : (
            <p>No announcements</p>
          )}
        </div>

      </div>

      <div className="dashboard-grid">

        <button
          onClick={() =>
            navigate("/add-grave")
          }
        >
          Add Grave
        </button>

        <button
          onClick={() =>
            navigate("/view-graves")
          }
        >
          View Graves
        </button>

        <button
          onClick={() =>
            navigate("/new-announcement")
          }
        >
          New Announcement
        </button>

        <button
          onClick={() =>
            navigate("/view-announcements")
          }
        >
          View Announcements
        </button>

      </div>
    </div>
  );
}

export default Dashboard;