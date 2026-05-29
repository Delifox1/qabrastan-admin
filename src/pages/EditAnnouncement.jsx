import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

function EditAnnouncement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAnnouncement();
  }, []);

  const loadAnnouncement = async () => {
    try {
      const docRef = doc(
        db,
        "announcements",
        id
      );

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setTitle(data.title || "");
        setMessage(data.message || "");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(
        doc(db, "announcements", id),
        {
          title,
          message,
        }
      );

      alert("Announcement updated");

      navigate("/view-announcements");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="form-container">
      <h1>Edit Announcement</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <textarea
        className="announcement-textarea"
        placeholder="Message"
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
      />

      <button onClick={handleUpdate}>
        Update Announcement
      </button>
    </div>
  );
}

export default EditAnnouncement;