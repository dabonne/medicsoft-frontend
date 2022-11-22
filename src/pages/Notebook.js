import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link } from "react-router-dom";

const localizer = momentLocalizer(moment);
function getRandomDate() {
  const maxDate = Date.now();
  const timestamp = Math.floor(Math.random() * maxDate);
  return new Date(timestamp);
}

const myEventsList = [
  { start: new Date(), end: new Date(), title: "Reunion" },
  { start: getRandomDate(), end: getRandomDate(), title: "John Doe" },
  {
    start: new Date("2022-11-25"),
    end: new Date("2022-11-25"),
    title: "John Doe",
  },
  {
    start: new Date("2022-11-09"),
    end: new Date("2022-11-09"),
    title: "Réunion",
  },
  {
    start: new Date("2022-10-30"),
    end: new Date("2022-10-31"),
    title: "Franck Sawadogo",
  },
];

const Notebook = () => {
  return (
    <>
      <div className="row">
        <h1 className="h2">Agenda</h1>
      </div>
      <div className="row my-4">
        <div className="col-12">
          <ul className="nav nav-tabs mx-0" role="tablist">
            <li className="nav-item">
              <Link className="nav-link active" data-bs-toggle="tab" to="#home">
                Planning
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" data-bs-toggle="tab" to="#menu1">
              Mes consultations
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" data-bs-toggle="tab" to="#menu2">
              Tout afficher
              </Link>
            </li>
          </ul>

          <div className="tab-content">
            <div id="home" className="container tab-pane active">
              <br />
              <div className="row">
                <div className="col-12">
                  <Calendar
                    localizer={localizer}
                    events={myEventsList}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                  />
                </div>
              </div>
            </div>
            <div id="menu1" className="container tab-pane fade">
              <br />
              <div className="row">
                <div className="col-12">
                  <Calendar
                    localizer={localizer}
                    events={myEventsList}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                  />
                </div>
              </div>
            </div>
            <div id="menu2" className="container tab-pane fade">
              <br />
              <div className="row">
                <div className="col-12">
                  <Calendar
                    localizer={localizer}
                    events={myEventsList}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notebook;
