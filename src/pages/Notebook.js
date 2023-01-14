import React, { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar,
  momentLocalizer,
  dateFnsLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "moment/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Link } from "react-router-dom";
import Modal from "bootstrap/js/dist/modal";
import user from "../assets/imgs/user_agenda.png";
import Toolbar from "react-big-calendar/lib/Toolbar";
import filtrer from "../assets/imgs/filtrer.png";
import { forwardRef } from "react";
import DPicker from "../components/DPicker";

let localizer = momentLocalizer(moment);
function getRandomDate() {
  const maxDate = Date.now();
  const timestamp = Math.floor(Math.random() * maxDate);
  return new Date(timestamp);
}

const myEventsList = [
  {
    allDay: true,
    start: getRandomDate(),
    desc: "Pre-meeting meeting, to prepare for the meeting",
    title: "Reunion",
    name: "John Doe",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel sem enim. Aliquam pellentesque blandit nibh vel faucibus. Nulla vitae nisi ac erat egestas volutpat. Nam aliquam lobortis mi, ut posuere sem posuere nec. Sed mauris magna, facilisis id augue eget, lacinia accumsan urna. Nam posuere libero felis, quis dictum lorem ornare non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non ultricies mauris. Cras quis faucibus arcu, ut pellentesque tellus. Etiam nisi metus, dapibus nec ornare nec, mattis id neque.",
  },
  {
    start: getRandomDate(),
    end: getRandomDate(),
    desc: "Pre-meeting meeting, to prepare for the meeting",
    title: "John Doe",
    name: "John Doe",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel sem enim. Aliquam pellentesque blandit nibh vel faucibus. Nulla vitae nisi ac erat egestas volutpat. Nam aliquam lobortis mi, ut posuere sem posuere nec. Sed mauris magna, facilisis id augue eget, lacinia accumsan urna. Nam posuere libero felis, quis dictum lorem ornare non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non ultricies mauris. Cras quis faucibus arcu, ut pellentesque tellus. Etiam nisi metus, dapibus nec ornare nec, mattis id neque.",
  },
  {
    start: new Date("2022-15-25"),
    end: new Date("2022-15-25"),
    title: "John Doe",
    name: "John Doe",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel sem enim. Aliquam pellentesque blandit nibh vel faucibus. Nulla vitae nisi ac erat egestas volutpat. Nam aliquam lobortis mi, ut posuere sem posuere nec. Sed mauris magna, facilisis id augue eget, lacinia accumsan urna. Nam posuere libero felis, quis dictum lorem ornare non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non ultricies mauris. Cras quis faucibus arcu, ut pellentesque tellus. Etiam nisi metus, dapibus nec ornare nec, mattis id neque.",
  },
  {
    start: new Date("2022-15-09"),
    end: new Date("2022-15-09"),
    title: "Réunion",
    name: "John Doe",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel sem enim. Aliquam pellentesque blandit nibh vel faucibus. Nulla vitae nisi ac erat egestas volutpat. Nam aliquam lobortis mi, ut posuere sem posuere nec. Sed mauris magna, facilisis id augue eget, lacinia accumsan urna. Nam posuere libero felis, quis dictum lorem ornare non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non ultricies mauris. Cras quis faucibus arcu, ut pellentesque tellus. Etiam nisi metus, dapibus nec ornare nec, mattis id neque.",
  },
  {
    start: new Date("2022-12-30"),
    end: new Date("2022-12-31"),
    title: "Franck Sawadogo",
    name: "Franck Sawadogo",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel sem enim. Aliquam pellentesque blandit nibh vel faucibus. Nulla vitae nisi ac erat egestas volutpat. Nam aliquam lobortis mi, ut posuere sem posuere nec. Sed mauris magna, facilisis id augue eget, lacinia accumsan urna. Nam posuere libero felis, quis dictum lorem ornare non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non ultricies mauris. Cras quis faucibus arcu, ut pellentesque tellus. Etiam nisi metus, dapibus nec ornare nec, mattis id neque.",
  },
];

const message = {
  week: "La semaine",
  work_week: "Semaine de travail",
  day: "Jour",
  month: "Mois",
  previous: "Antérieur",
  next: "Prochain",
  today: `Aujourd'hui`,
  agenda: "Ordre du jour",

  showMore: (total) => `+${total} plus`,
};
const handleNavigation = (date, view, action) => {
  console.log(date, view, action);
  //it returns current date, view options[month,day,week,agenda] and action like prev, next or today
};
const handleChange = () => {
  console.log("this block code executed");
};

const Notebook = () => {
  const [eventDetail, setEventDetail] = useState({
    name: "",
    start: "",
    description: "",
  });

  const handleSelectEvent = useCallback(() => {
    var myModal = new Modal(document.getElementById("eventDetail"), {});
    myModal.show();
  }, []);

  const setDetailEvent = (e) => {
    console.log(e);
    eventDetail.name = e.name;
    eventDetail.start = e.start;
    eventDetail.description = e.description;
    //console.log(moment(e.start))
    setEventDetail(eventDetail);
    var myModal = new Modal(document.getElementById("eventDetail"), {});
    myModal.show();
    //handleSelectEvent();
  };
  let change = handleChange;
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
                    defaultView="week"
                    localizer={localizer}
                    events={myEventsList}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    onSelectEvent={setDetailEvent}
                    messages={message}
                    views={["day", "week", "month"]}
                    onNavigate={handleNavigation}
                    components={{
                      event: EventComponent({ myEventsList, change }),
                      toolbar: CustomToolbar({ myEventsList, change }),
                    }}
                  />
                </div>
              </div>
            </div>
            <div id="menu1" className="container tab-pane fade">
              <br />
              <div className="row">
                <div className="col-12">
                  <Calendar
                    defaultView="week"
                    localizer={localizer}
                    events={myEventsList}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    onSelectEvent={setDetailEvent}
                    messages={message}
                    views={["day", "week", "month"]}
                    onNavigate={handleNavigation}
                    components={{
                      event: EventComponent({ myEventsList, change }),
                      toolbar: CustomToolbar({ myEventsList, change }),
                    }}
                  />
                </div>
              </div>
            </div>
            <div id="menu2" className="container tab-pane fade">
              <br />
              <div className="row">
                <div className="col-12">
                  <Calendar
                    defaultView="week"
                    localizer={localizer}
                    events={myEventsList}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    onSelectEvent={setDetailEvent}
                    messages={message}
                    views={["day", "week", "month"]}
                    onNavigate={handleNavigation}
                    components={{
                      event: EventComponent({ myEventsList, change }),
                      toolbar: CustomToolbar({ myEventsList, change }),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="eventDetail">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Information de la consultation
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-3 col-sm-2">
                  <img src={user} alt="" />
                </div>
                <div className="col-9 col-sm-10 py-2">
                  <div className="d-flex justify-content-between">
                    <span className="text-bold text-meduim">
                      {eventDetail.name}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">
                      Samedi 12 Novembre 2022 - 10h à 11h45
                    </span>
                  </div>
                </div>
                <div className="col-12 pt-3 ">
                  <span className="text-bold text-underline">Description</span>
                  <hr className="mt-0" />
                </div>
              </div>
              {eventDetail.description}
            </div>

            <div className="modal-footer border-0 d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Voir le dossier du patient
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
// design html for event tile
const EventComponent =
  ({ events, change }) =>
  (props) => {
    return (
      <div className="customEventTile" title="This is EventTile">
        <h5>{props.event.title}</h5>
        {/** <button onClick={props.change}>Do Something</button> */}
      </div>
    );
  };
// design custom design or elements for top navigation toolbaar, for today, next, prev or all views

var CustomToolbar = ({ handleChange }) => {
  const [viewBtn, setViewBtn] = useState({
    type: "week",
    true: "d-inline-block p-2 bg-primary text-white border-radius",
    false: "d-inline-block p-2",
  });

  return class BaseToolBar extends Toolbar {
    constructor(props) {
      super(props);
    }
    handleDayChange = (event, mconte) => {
      mconte(event.target.value);
    };
    handleNamvigate = (detail, elem) => {
      detail.navigate(elem);
    };
    render() {
      return (
        <div className="row py-2">
          <div className="col-12 col-sm my-1">
            <DPicker />
          </div>
          <div className="col-12 col-sm d-flex justify-content-center my-1">
            <div
              defaultValue={"week"}
              className="d-inline-block bg-secondary border-radius border-0 p-0 text-bold"
            >
              <div
                type="button"
                className={
                  viewBtn.type === "day" ? viewBtn.true : viewBtn.false
                }
                style={{
                  borderEndEndRadius: 0,
                  borderTopRightRadius: 0,
                }}
                onClick={(e) => {
                  e.target.value = "day";
                  viewBtn.type = "day";
                  setViewBtn(viewBtn);
                  this.handleDayChange(e, this.view);
                }}
              >
                Jour
              </div>
              <div
                type="button"
                className={
                  viewBtn.type === "week" ? viewBtn.true : viewBtn.false
                }
                style={{
                  borderTopLeftRadius: 0,
                  borderEndStartRadius: 0,
                  borderEndEndRadius: 0,
                  borderTopRightRadius: 0,
                }}
                onClick={(e) => {
                  e.target.value = "week";
                  viewBtn.type = "week";
                  setViewBtn(viewBtn);
                  this.handleDayChange(e, this.view);
                }}
              >
                Semaine
              </div>
              <div
                type="button"
                className={
                  viewBtn.type === "month" ? viewBtn.true : viewBtn.false
                }
                style={{
                  borderTopLeftRadius: 0,
                  borderEndStartRadius: 0,
                }}
                onClick={(e) => {
                  e.target.value = "month";
                  viewBtn.type = "month";
                  setViewBtn(viewBtn);
                  this.handleDayChange(e, this.view);
                }}
              >
                Mois
              </div>
            </div>
          </div>
          <div className="col-12 col-sm d-flex justify-content-end my-1">
            <button className="btn text-bold">
              <img src={filtrer} alt="" /> {"Filtrer"}
            </button>
          </div>
          {/**
             * <div className="rbc-btn-group">
            <button
              type="button"
              className="defaultbtn"
              onClick={() => this.handleNamvigate(this, "TODAY")}
            >
              Today
            </button>
            <button
              type="button"
              className="nextp-btn"
              onClick={() => this.handleNamvigate(this, "PREV")}
            >
              Prev
            </button>
            <button
              type="button"
              className="nextp-btn"
              onClick={() => this.handleNamvigate(this, "NEXT")}
            >
              Next
            </button>
          </div>
          <div className="rbc-toolbar-label">{this.props.label}</div>
             

          <div className="rbc-btn-group">
            <select
              className="form-control"
              onChange={(e) => this.handleDayChange(e, this.view)}
              defaultValue={"week"}
            >
              <option className="optionbar" value="day">
                Day
              </option>
              <option className="optionbar" value="week">
                Week
              </option>
              <option className="optionbar" value="month">
                Month
              </option>
              <option className="optionbar" value="agenda">
                Agenda
              </option>
            </select>
          </div>*/}
        </div>
      );
    }
  };
};


export default Notebook;
