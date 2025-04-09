import { useParams } from "react-router-dom";
import CakePage from "../components/CakePage";
import GreetingCardPage from "../components/GreetingCardPage";
import AnniversaryGreetingCard from "../components/AnniversaryGreetingCard";
import GraduationCard from "../components/GraduationCard";
import JobCongratsCard from "../components/JobCongratsCard";
import CheerUpCard from "../components/CheerUpCard";
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
      return <AnniversaryGreetingCard person={person} />;
    case "Grad":
      return <GraduationCard person={person} />;
    case "JobCongrats":
      return <JobCongratsCard person={person} />;
    case "CheerUp":
      return <CheerUpCard person={person} />;
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
