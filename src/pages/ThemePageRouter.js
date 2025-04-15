import { useParams } from "react-router-dom";
import CakePage from "../components/CakePage";
import GreetingCardPage from "../components/GreetingCardPage";
import AnniversaryBackground from "../components/AnniversaryBackground";
import GradBackground from "../components/GradBackground";
import JobBackground from "../components/JobBackground";
import CheerUpBackground from "../components/CheerUpBackground";
import LoveNoteCard from "../components/LoveNoteCard";
import SorryNote from "../components/SorryNote";

import { useEffect, useState } from "react";
import axios from "axios";

const ThemePageRouter = () => {
  const { personId } = useParams();
  const [person, setPerson] = useState(null);

  useEffect(() => {
    axios.get(`/api/persons/${personId}`).then((res) => {
      setPerson(res.data);
    });
  }, [personId]);

  if (!person) return <div>Loading...</div>;

  const theme = person.theme;

  switch (theme) {
    case "Birthday":
      return <CakePage person={person} />;
    case "Anniversary":
      return <AnniversaryBackground person={person} />;
    case "Grad":
      return <GradBackground person={person} />;
    case "JobCongrats":
      return <JobBackground person={person} />;
    case "CheerUp":
      return <CheerUpBackground person={person} />;
    case "LoveNote":
      return <LoveNoteCard person={person} />;
    case "SorryNote":
      return <SorryNote person={person} />;
    default:
      return <CakePage person={person} />; // fallback
  }
  console.log("Loaded person:", person);
console.log("Selected theme:", person.theme);

};

export default ThemePageRouter;
