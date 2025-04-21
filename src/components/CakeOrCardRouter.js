import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CakePage from "../pages/CakePage"; // adjust path if needed
import GreetingCardPage from "./GreetingCardPage";

const CakeOrCardRouter = () => {
  const { personId } = useParams();
  const [person, setPerson] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetch(`${API_URL}/api/persons/${personId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Theme detected:", data.theme); // 🔍 Debug
        setPerson(data);
      })
      .catch(() => alert("Failed to load person data"));
  }, [personId]);

  if (!person) return <p>Loading...</p>;

  // ✅ Make sure this is case-sensitive and matches exactly:
  return person.theme === "Birthday" ? (
    <CakePage person={person} />
  ) : (
    <GreetingCardPage person={person} />
  );
};

export default CakeOrCardRouter;
