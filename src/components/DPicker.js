import { addDays, subDays } from "date-fns";
import React, { forwardRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";

import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

const DPicker = ({ open = false }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [value, setValue] = useState("");

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
    const mois = [
      { nom: "Janvier", jour: 31 },
      { nom: "Février", jour: 28 },
      { nom: "Mars", jour: 31 },
      { nom: "Avril", jour: 30 },
      { nom: "Mai", jour: 31 },
      { nom: "Juin", jour: 30 },
      { nom: "Juillet", jour: 31 },
      { nom: "Août", jour: 31 },
      { nom: "Septembre", jour: 30 },
      { nom: "Octobre", jour: 31 },
      { nom: "Novembre", jour: 30 },
      { nom: "Décembre", jour: 31 },
    ];
    const d = new Date();
    const day = d.getDay();
    const month = d.getMonth();
    const year = d.getFullYear();
    const bix = year % 4 === 0 && year % 100 !== 0 ? 1 : 0;
    const start = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    var end = 0;
    if (bix === 1 && month === 1) {
      end =
        start + 6 > mois[month].jour + 1
          ? start + 6 - mois[month].jour + 1
          : start + 6;
    } else {
      end =
        start + 6 > mois[month].jour ? start + 6 - mois[month].jour : start + 6;
    }

    return (
      <>{
        open ? <>
        <Link to={"/dashboard/agenda"} className="btn bg-secondary border-0 me-2">
        Agenda
      </Link>
      <button className="btn bg-primary text-white border-0" onClick={onClick} ref={ref}>
        {mois[month].nom}
      </button>
        </> : <button className="btn bg-secondary border-0" onClick={onClick} ref={ref}>
        {start + "  " + mois[month].nom}
      </button>
      }
      </>
    );
  });
  registerLocale("fr", fr);

  return (
    <>
      {open ? (
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          customInput={<ExampleCustomInput />}
          
        />
      ) : (
        <DatePicker
          selected={startDate}
          startOpen={open}
          onChange={(date) => setStartDate(date)}
          customInput={<ExampleCustomInput />}
          />
        
      )}
    </>
  );
};

export default DPicker;
