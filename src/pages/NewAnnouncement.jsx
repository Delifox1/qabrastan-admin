import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../services/firebase";

function NewAnnouncement() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!title || !message) {
      alert("Please complete all fields");
      return;
    }

    try {
      // TEST: Verify admin can read device tokens
      const tokenSnapshot = await getDocs(
        collection(db, "deviceTokens")
      );

      console.log(
        "Device Tokens Found:",
        tokenSnapshot.size
      );

      await addDoc(
        collection(db, "announcements"),
        {
          title,
          message,
          createdAt: serverTimestamp(),
        }
      );

      alert("Announcement published");

      setTitle("");
      setMessage("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="form-container">
      <h1>New Announcement</h1>

      <input
        type="text"
        placeholder="Announcement Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <textarea
        className="announcement-textarea"
        placeholder="Announcement Message"
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
      />

      <button onClick={handleSave}>
        Publish Announcement
      </button>
    </div>
  );
}

export default NewAnnouncement;