import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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
import userp from "../../assets/imgs/user_agenda.png";
import sv from "../../assets/imgs/sv.png";
import bk from "../../assets/imgs/bk.png";
import Toolbar from "react-big-calendar/lib/Toolbar";
import FormNotify from "../../components/FormNotify";
import { AppContext } from "../../services/context";
import requestAgenda from "../../services/requestAgenda";
import { apiAgenda, apiMedical } from "../../services/api";
import NotifyRef from "../../components/NofifyRef";
import requestDoctor from "../../services/requestDoctor";
import { Typeahead } from "react-bootstrap-typeahead";

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
const initData = {
  doctorUuid: "",
  period: "",
  hour: "",
  patientCni: "",
  detail: "",
};
const NotebookConsultation = () => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [eventDetail, setEventDetail] = useState({
    name: "",
    start: "",
    description: "",
  });
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [formValidate, setFormValidate] = useState("needs-validation");

  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [startHours, setStartHours] = useState("");
  const [endHours, setEndHours] = useState("");
  const [titre, setTitre] = useState("");
  const [type, setType] = useState("");
  const [listType, setTListype] = useState({});
  const [desc, setDesc] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  //const [notifyRef,setNotifyRef] = useState('')
  const notifyRef = useRef();
  const agendaRef = useRef();
  const [eventList, setEventList] = useState([]);
  const [employeList, setEmployeList] = useState([]);
  const [indexEvent, setIndexEvent] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [patientList, setPatientList] = useState({});
  const [selectedOption, setSelectedOption] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [rendezVous, setRendezVous] = useState([]);
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  useEffect(() => {
    getEventList();
    getPatientList();
  }, [refresh]);

  const getEventList = () => {
    requestAgenda
      .get(apiAgenda.getAll + "/" + user.organisationRef, header)
      .then((res) => {
        setEmployeList(res.data.employees);
        const lst = res.data.events.map((data, idx) => {
          return {
            //allDay: true,
            start: new Date(data.startDate + ", " + data.startHour),
            end: new Date(data.endDate + ", " + data.endHour),
            desc: data.typeEvent,
            title: data.title,
            name: "John Doe",
            description: data.description,
            idx: idx,
            referenceId: data.referenceId,
          };
        });
        //setEventList(lst);
        getAgendaData();
      })
      .catch((error) => {});
  };

  const getPatientList = () => {
    requestDoctor
      .get(apiMedical.patientsReduce + "/" + user.organisationRef, header)
      .then((res) => {
        //console.log(res.data);
        const tab = Object.keys(res.data).map((key) => {
          return {
            uuid: key,
            label: res.data[key],
          };
        });
        setPatientList(tab);
      })
      .catch((error) => {});
  };
  const getRendezVous = (id) => {
    //configNotify("loading", "", "Ajout d’un nouvel(le) employé(e) en cours...");
    //console.log(jsData)
    requestAgenda
      .get(apiAgenda.eventConsultation + "/" + id, header)
      .then((res) => {
        //setDatas(res.data);
        console.log("okok");
        console.log(res.data);
        const lst = res.data.map((data, idx) => {
          return {
            //allDay: true,
            start: new Date(data.startDate + ", " + data.startHour),
            end: new Date(data.endDate + ", " + data.endHour),
            desc: data.typeEvent ? data.typeEvent : "Consultation",
            title: data.title ? data.title : data.patient.firstname +" " +data.patient.lastname,
            name: "John Doe",
            description: data.description ? data.description : "",
            idx: idx,
            referenceId: data.referenceId ? data.referenceId : data.id,
            type: data.type,
          };
        });
        setEventList(lst);
      })
      .catch((error) => {
        console.log(error);
        configNotify(
          "danger",
          "Oups !",
          "Une erreur est survenue. Veuillez réessayer ultérieurement..."
        );
      });
  };
  const handleSelectEvent = useCallback(() => {
    var myModal = new Modal(document.getElementById("eventDetail"), {});
    myModal.show();
  }, []);

  const employeEvent = (e, list) => {
    requestAgenda
      .get(
        apiAgenda.agendaEmployee + "/" + e + "/" + user.organisationRef,
        header
      )
      .then((res) => {
        console.log(res.data);
        //setEmployeList(res.data.employees);
        const lst = res.data.map((data, idx) => {
          return {
            //allDay: true,
            start: new Date(data.startDate + ", " + data.startHour),
            end: new Date(data.endDate + ", " + data.endHour),
            desc: data.typeEvent,
            title: data.title,
            name: "John Doe",
            description: data.description,
            idx: idx,
            referenceId: data.referenceId,
          };
        });
        //console.log(res)
        setEventList(lst);
        getAgendaData();
      })
      .catch((error) => {});
  };

  const setDetailEvent = (e) => {
    setIndexEvent(e.idx);
    eventDetail.name = e.name;
    eventDetail.start = e.start.toLocaleString();
    eventDetail.description = e.description;
    //console.log(moment(e.start))
    setEventDetail(eventDetail);
    var myModal = new Modal(document.getElementById("planningEvent"), {});
    eventList[e.idx] && myModal.show();
    eventList[e.idx] && myModal.show();
    //handleSelectEvent();
    console.log(e)

  };


  const formatDate = (date) => {
    const day = date.getDate() < 10 ? 0 + "" + date.getDate() : date.getDate();
    const month =
      date.getMonth() < 10
        ? 0 + "" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    console.log(date.getFullYear() + "-" + month + "-" + day);
    return date.getFullYear() + "-" + month + "-" + day;
  };
  const createEvent = (e) => {
    setStartDay(formatDate(e.start));
    setEndDay(formatDate(e.end));
    setStartHours(e.start.toLocaleTimeString());
    setEndHours(e.end.toLocaleTimeString());

    var myModal = new Modal(document.getElementById("createRendezVous"), {});
    myModal.show();
  };
  const fValidate = (cl) => {
    setFormValidate(cl);
  };

  const configNotify = (bg, title, message) => {
    setNotifyBg(bg);
    setNotifyTitle(title);
    setNotifyMessage(message);
  };

  const getAgendaData = () => {
    requestAgenda
      .get(apiAgenda.getData, header)
      .then((res) => {
        setTListype(res.data.listTypeEvent);
      })
      .catch((error) => {});
  };

  const setEditData = () => {
    console.log(eventList[indexEvent]);
    setStartDay(formatDate(eventList[indexEvent].start));
    setEndDay(formatDate(eventList[indexEvent].end));
    setStartHours(eventList[indexEvent].start.toLocaleTimeString());
    setEndHours(eventList[indexEvent].end.toLocaleTimeString());
    setDesc(eventList[indexEvent].description);
    setTitre(eventList[indexEvent].title);
    setType(eventList[indexEvent].desc);
    setReferenceId(eventList[indexEvent].referenceId);
  };

  const submitEventOld = (e) => {
    e.preventDefault();
    console.log({
      doctorUuid: doctor,
      period: startDay,
      hour: startHours,
      patientCni: selectedOption[0].uuid,
      detail: desc,
    });
    /*console.log({
      startDate: startDay,
      endDate: endDay,
      startHour: startHours,
      endHour: endHours,
      //username: user.roles[0].organisation,
      organisationId: user.organisationRef,
      description: desc,
    });*/
    console.log(selectedOption[0]);

    /*requestAgenda
      .post(
        apiAgenda.post,
        {
          title: titre,
          startDate: startDay,
          endDate: endDay,
          startHour: startHours,
          endHour: endHours,
          //username: user.roles[0].organisation,
          typeEvent: type,
          organisationId: user.organisationRef,
          description: desc,
        },
        header
      )
      .then((res) => {
        console.log("creation ok");
        setModalNotifyMsg("Les informations ont bien été enrégistrées");
        agendaRef.current.click();
        notifyRef.current.click();
        setRefresh(refresh + 1);
        setStartDay("");
        setEndDay("");
        setTitre("");
        setType("");
        setDesc("");
        fValidate("needs-validation");
      })
      .catch((error) => {
        console.log(error);
      });*/
  };

  const submitEvent = (e) => {
    e.preventDefault();
    configNotify("loading", "", "Ajout d’un nouvel rendez vous en cours...");
    const rdv = {
      doctorUuid: doctor,
      period: startDay,
      hour: startHours,
      patientCni: selectedOption[0].uuid,
      detail: desc,
    };
    requestDoctor
      .post(
        apiMedical.rendezVous +
          "/" +
          user.organisationRef +
          "?startDate=" +
          startDay +
          "&endDate=" +
          startDay,
        rdv,
        header
      )
      .then((res) => {
        console.log("enregistrement ok");
        setModalNotifyMsg("Les informations ont bien été enrégistrées");
        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );

        console.log("creation ok");
        setModalNotifyMsg("Les informations ont bien été enrégistrées");
        //agendaRef.current.click();
        notifyRef.current.click();
        setRefresh(refresh + 1);
        setStartDay("");
        setEndDay("");
        setType("");
        setDesc("");
        fValidate("needs-validation");
        getRendezVous(doctor)
      })
      .catch((error) => {
        console.log(error);
        configNotify(
          "danger",
          "Oups !",
          "Une erreur est survenue. Veuillez réessayer ultérieurement..."
        );
      });
  };
  const submitEditEvent = (e) => {
    e.preventDefault();
    requestAgenda
      .put(
        apiAgenda.put,
        {
          title: titre,
          startDate: startDay,
          endDate: endDay,
          startHour: startHours,
          endHour: endHours,
          //username: user.roles[0].organisation,
          typeEvent: type,
          organisationId: user.organisationRef,
          description: desc,
          referenceId: referenceId,
        },
        header
      )
      .then((res) => {
        console.log("modification ok");
        setModalNotifyMsg("Les informations ont bien été modifiées");
        agendaRef.current.click();
        notifyRef.current.click();
        setRefresh(refresh + 1);
        setStartDay("");
        setEndDay("");
        setTitre("");
        setType("");
        setDesc("");
        fValidate("needs-validation");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  /*const onDelete = (e) => {
    e.preventDefault();
    console.log(eventList[indexEvent].referenceId);
    requestAgenda
      .delete(apiAgenda.delete + "/" + eventList[indexEvent].referenceId)
      .then((res) => {
        console.log("suppression ok");
        setModalNotifyMsg("Suppression réussie !");
        notifyRef.current.click();
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };*/
  const onDelete = () => {
    requestDoctor
      .delete(apiMedical.deleteRendezVous + "/" + eventList[indexEvent].referenceId, header)
      .then((res) => {
        setModalNotifyMsg("Suppression réussie !");
        notifyRef.current.click();
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let change = handleChange;
  const handleInputChange = (input) => {
    // Filter the options based on the user input
    const filteredOptions = patientList.filter((option) =>
      option.label.toLowerCase().includes(input.toLowerCase())
    );
    return filteredOptions;
  };
  const renderMenuItemChildren = (option, props) => {
    return (
      <div key={option.uuid}>
        <span>Patient: {option.label}</span> <br />
        <span>CNIB: {option.uuid}</span>
      </div>
    );
  };
  const eventStyleGetter = (event) => {
    console.log(event)
    if(event.type ==="CONSULTATION"){
      return {
        style: {
          backgroundColor: 'red',
          borderColor:'red'
        }
      };
    }
    
  };
  return (
    <>
      <NotifyRef
        modalNotifyMsg={modalNotifyMsg}
        setModalNotifyMsg={setModalNotifyMsg}
        notifyRef={notifyRef}
      />
      <div className="row">
        <div className="col-12">
          <Calendar
            onClick={() => alert("ok")}
            defaultView="week"
            localizer={localizer}
            events={[...eventList,...rendezVous]}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={setDetailEvent}
            onSelectSlot={createEvent}
            eventPropGetter={eventStyleGetter}
            selectable
            messages={message}
            views={["day", "week", "month", "today"]}
            onNavigate={handleNavigation}
            components={{
              event: EventComponent({ myEventsList, change }),
              toolbar: CustomToolbar({
                myEventsList,
                change,
                employeList,
                employeEvent,
                setDoctor,
                getRendezVous
              }),
            }}
          />
        </div>
      </div>

      <div className="modal fade" id="createEvent">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold"></h4>
              <button
                type="button"
                className="btn-close"
                ref={agendaRef}
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {notifyBg != "" ? (
                <FormNotify
                  bg={notifyBg}
                  title={notifyTitle}
                  message={notifyMessage}
                />
              ) : null}
              <form className={formValidate} onSubmit={submitEvent} noValidate>
                <div className="row mb-3">
                  <div className="col-4">
                    <input
                      className="form-control text-32 border-0 text-primary"
                      type="date"
                      value={startDay}
                      onChange={(e) => {
                        setStartDay(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <input
                      className="form-control text-32 border-0 text-primary"
                      type="date"
                      value={endDay}
                      onChange={(e) => {
                        setEndDay(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-1 ">
                    <span className="d-inline-block">
                      <input
                        className="border-0 bg-white text-bold text-meduim"
                        type="button"
                        value="Heure: "
                      />
                    </span>
                  </div>
                  <div className="col-2">
                    <input
                      className="form-control border-0"
                      type="time"
                      value={startHours}
                      onChange={(e) => {
                        setStartHours(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-2">
                    <input
                      className="form-control border-0"
                      type="time"
                      value={endHours}
                      onChange={(e) => {
                        setEndHours(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                    Titre
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    placeholder="Entrer le titre de l'évènement"
                    value={titre}
                    onChange={(e) => {
                      e.preventDefault();
                      setTitre(e.target.value);
                    }}
                    required
                  />
                  <div className="invalid-feedback">
                    Veuillez entrer un titre
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="clst" className="form-label">
                    Type
                  </label>
                  <select
                    id="clst"
                    className="form-select"
                    value={type}
                    onChange={(e) => {
                      e.preventDefault();
                      setType(e.target.value);
                    }}
                    required
                  >
                    <option value="">Choisir le type</option>
                    {Object.keys(listType).map((key) => {
                      return (
                        <option key={key} value={key}>
                          {listType[key]}
                        </option>
                      );
                    })}
                  </select>
                  <div className="invalid-feedback">
                    Veuillez Choisir un type
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">
                    Description
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="fname"
                    placeholder="Entrer la description"
                    value={desc}
                    onChange={(e) => {
                      e.preventDefault();
                      setDesc(e.target.value);
                    }}
                    required
                  ></textarea>

                  <div className="invalid-feedback">
                    Veuillez entrer une description
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={(e) => {
                      e.preventDefault();
                      fValidate("needs-validation");
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => {
                      fValidate("was-validated");
                    }}
                  >
                    Enregistrer l’activité
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="editEvent">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold"></h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {notifyBg != "" ? (
                <FormNotify
                  bg={notifyBg}
                  title={notifyTitle}
                  message={notifyMessage}
                />
              ) : null}
              <form
                className={formValidate}
                onSubmit={submitEditEvent}
                noValidate
              >
                <div className="row mb-3">
                  <div className="col-4">
                    <input
                      className="form-control text-32 border-0 text-primary"
                      type="date"
                      value={startDay}
                      onChange={(e) => {
                        setStartDay(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <input
                      className="form-control text-32 border-0 text-primary"
                      type="date"
                      value={endDay}
                      onChange={(e) => {
                        setEndDay(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-1 ">
                    <span className="d-inline-block">
                      <input
                        className="border-0 bg-white text-bold text-meduim"
                        type="button"
                        value="Heure: "
                      />
                    </span>
                  </div>
                  <div className="col-2">
                    <input
                      className="form-control border-0"
                      type="time"
                      value={startHours}
                      onChange={(e) => {
                        setStartHours(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-2">
                    <input
                      className="form-control border-0"
                      type="time"
                      value={endHours}
                      onChange={(e) => {
                        setEndHours(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                    Titre
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    placeholder="Entrer le nom de famille de l’employé(e)"
                    value={titre}
                    onChange={(e) => {
                      e.preventDefault();
                      setTitre(e.target.value);
                    }}
                    required
                  />
                  <div className="invalid-feedback">
                    Veuillez entrer un titre
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="clst" className="form-label">
                    Type
                  </label>
                  <select
                    id="clst"
                    className="form-select"
                    value={type}
                    onChange={(e) => {
                      e.preventDefault();
                      setType(e.target.value);
                    }}
                    required
                  >
                    <option value="">Choisir le type</option>
                    {Object.keys(listType).map((key) => {
                      return (
                        <option key={key} value={key}>
                          {listType[key]}
                        </option>
                      );
                    })}
                  </select>
                  <div className="invalid-feedback">
                    Veuillez Choisir un type
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">
                    Description
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="fname"
                    placeholder="Entrer la description"
                    value={desc}
                    onChange={(e) => {
                      e.preventDefault();
                      setDesc(e.target.value);
                    }}
                    required
                  ></textarea>

                  <div className="invalid-feedback">
                    Veuillez entrer une description
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={() => fValidate("needs-validation")}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => fValidate("was-validated")}
                  >
                    Modifier l’activité
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="planningEvent">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold"></h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-9 col-sm-10 py-2">
                  <div className="d-flex justify-content-between">
                    <span className="text-bold text-32">
                      {eventList[indexEvent] && eventList[indexEvent].desc}
                    </span>
                  </div>

                  <div className="">
                    <div className="d-inline-block me-5">
                      <span>Date de début</span> <br />
                      <span className="text-bold text-meduim">
                        {eventList[indexEvent] &&
                          " " +
                            eventList[indexEvent].start.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="d-inline-block me-5">
                      <span>Date de fin</span> <br />
                      <span className="text-bold text-meduim">
                        {eventList[indexEvent] &&
                          eventList[indexEvent].end.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12 ">
                  <span className="text-bold">Heure:</span>
                  <span>
                    {eventList[indexEvent] &&
                      " " + eventList[indexEvent].start.toLocaleTimeString()}
                  </span>
                  <span>
                    {eventList[indexEvent] &&
                      " - " + eventList[indexEvent].end.toLocaleTimeString()}
                  </span>
                </div>

                <div className="col-12 pt-3 ">
                  <span className="text-bold text-underline">Détails</span>
                  <hr className="mt-0" />
                </div>
              </div>
              {eventList[indexEvent] && eventList[indexEvent].description}
            </div>

            <div className="modal-footer border-0 d-flex justify-content-start">
              {
                eventList[indexEvent] !== undefined && eventList[indexEvent].type === "CONSULTATION" ? <button
                type="button"
                className="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#deleteAgenda"
              >
                supprimer
              </button> : null
              }
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                
              >
                fermer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="detailEvent">
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
                  <img width="100px" src={userp} alt="" />
                </div>
                <div className="col-9 col-sm-10 py-2">
                  <div className="d-flex justify-content-between">
                    <span className="text-bold text-meduim">
                      {/*eventList[indexEvent] && eventList[indexEvent].title*/}
                      John DOE
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-bold">
                      {/*eventList[indexEvent] && eventList[indexEvent].title*/}
                      (00226) xx xx xx xx
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-bold">
                      {/*eventList[indexEvent] && eventList[indexEvent].title*/}
                      johndoe@example.com
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">
                      {/*eventList[indexEvent] && eventList[indexEvent].title*/}
                      <Link to="#" className="text-black">
                        Dossier patient
                      </Link>
                    </span>
                  </div>
                </div>
                <div className="col-12 pt-3 ">
                  <span className="text-bold">Date de consultation:</span>
                  <span className="text-bold text-meduim">
                    {eventList[indexEvent] &&
                      " " + eventList[indexEvent].start.toLocaleDateString()}
                  </span>
                  <span className="text-bold text-meduim">
                    {eventList[indexEvent] &&
                      " - " + eventList[indexEvent].end.toLocaleDateString()}
                  </span>{" "}
                  <br />
                  <span className="text-bold">Heure:</span>
                  <span className="text-bold text-meduim">
                    {eventList[indexEvent] &&
                      " " + eventList[indexEvent].start.toLocaleTimeString()}
                  </span>
                  <span className="text-bold text-meduim">
                    {eventList[indexEvent] &&
                      " - " + eventList[indexEvent].end.toLocaleTimeString()}
                  </span>
                </div>

                <div className="col-12 pt-3 ">
                  <span className="text-bold text-underline">Détails</span>
                  <hr className="mt-0" />
                </div>
              </div>
              {eventList[indexEvent] && eventList[indexEvent].description}
            </div>

            <div className="modal-footer border-0 d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Confirmer le rendez-vous
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="deleteAgenda">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Supprimer l'évènement
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">Comfirmer l'action</div>

            <div className="modal-footer border-0 d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={onDelete}
              >
                Comfirmer
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="createRendezVous">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Création d'un rendez vous
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {notifyBg != "" ? (
                <FormNotify
                  bg={notifyBg}
                  title={notifyTitle}
                  message={notifyMessage}
                />
              ) : null}
              <form className={formValidate} onSubmit={submitEvent} noValidate>
                <div className="row mb-3">
                  <div className="col-6">
                    <input
                      className="form-control text-32 border-0 text-primary"
                      type="date"
                      value={startDay}
                      onChange={(e) => {
                        setStartDay(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-1 ">
                    <span className="d-inline-block">
                      <input
                        className="border-0 bg-white text-bold text-meduim"
                        type="button"
                        value="Heure: "
                      />
                    </span>
                  </div>
                  <div className="col-3">
                    <input
                      className="form-control border-0"
                      type="time"
                      value={startHours}
                      onChange={(e) => {
                        setStartHours(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 text-meduim">
                    <span className="fw-bold">Docteur: </span>
                    <span className="fw-bold  text-primary">
                      {doctor !== ""
                        ? employeList[doctor]
                        : "Veuillez sélectionnez l'agenda d'un docteur"}
                    </span>
                  </div>
                </div>
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                    Sélectionnez le patient
                  </label>
                  <Typeahead
                    id="basic-typeahead-example"
                    labelKey="label"
                    options={patientList}
                    placeholder="Veuillez choisir le nom du médicament"
                    onChange={setSelectedOption}
                    onInputChange={handleInputChange}
                    renderMenuItemChildren={renderMenuItemChildren}
                    selected={selectedOption}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">
                    Description
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="fname"
                    placeholder="Entrer la description"
                    value={desc}
                    onChange={(e) => {
                      e.preventDefault();
                      setDesc(e.target.value);
                    }}
                    required
                  ></textarea>

                  <div className="invalid-feedback">
                    Veuillez entrer une description
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={(e) => {
                      e.preventDefault();
                      fValidate("needs-validation");
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => {
                      fValidate("was-validated");
                    }}
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <input
        type="hidden"
        ref={agendaRef}
        data-bs-dismiss="modal"
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    </>
  );
};
// design html for event tile
const EventComponent =
  ({ events, change }) =>
  (props) => {
    return (
      <div className="customEventTile" title={props.event.title}>
        <div className="text-16 text-bold">{props.event.title}</div>
        {/** <button onClick={props.change}>Do Something</button> */}
      </div>
    );
  };
// design custom design or elements for top navigation toolbaar, for today, next, prev or all views

var CustomToolbar = ({
  handleChange,
  employeList = [],
  employeEvent,
  setDoctor,
  getRendezVous
}) => {
  const [viewBtn, setViewBtn] = useState({
    type: "week",
    true: "d-inline-block p-2 bg-primary text-white border-radius",
    false: "d-inline-block p-2",
  });
  const [selected, setSelected] = useState();
  return class BaseToolBar extends Toolbar {
    constructor(props) {
      super(props);
      this.state = { employeeReference: "" };
      this.getEmployeAgenda = this.getEmployeAgenda.bind(this);
    }

    shouldComponentUpdate() {
      return true;
    }
    handleDayChange = (event, mconte) => {
      mconte(event.target.value);
    };
    handleNamvigate = (detail, elem) => {
      detail.navigate(elem);
    };

    getEmployeAgenda = (e) => {
      e.preventDefault();
      this.setState({ employeeReference: e.target.value });
      //employeEvent(e.target.value, employeList);
      console.log(e.target.value);
      setSelected(e.target.value);
      setDoctor(e.target.value);
      getRendezVous(e.target.value);
    };
    render() {
      return (
        <div className="row py-2">
          <div className="col-12 col-sm my-1">
            <div className="d-inline-block  mb-3 me-2">
              <div className="border-radius bg-secondary border-0 px-0">
                <span
                  className="btn"
                  onClick={() => this.handleNamvigate(this, "PREV")}
                >
                  <img src={bk} alt="" />
                </span>
                {this.props.label}
                <span
                  className="btn"
                  onClick={() => this.handleNamvigate(this, "NEXT")}
                >
                  <img src={sv} alt="" />
                </span>
              </div>
            </div>
            <div
              defaultValue={"week"}
              className="d-inline-block bg-secondary border-radius border-0 p-0 text-bold mb-3"
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
            <div className="d-inline-block mb-3 ms-2">
              <div className="border-radius bg-secondary border-0 px-0">
                <span
                  className="btn"
                  onClick={() => this.handleNamvigate(this, "TODAY")}
                >
                  <span className="fw-bold">
                    {new Date().getDate() < 10
                      ? "0" + new Date().getDate()
                      : new Date().getDate()}{" "}
                  </span>
                  Aujourd'hui
                </span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm d-flex justify-content-end my-1">
            <div className="mb-3 me-2">
              <select
                id="clst"
                className="form-select"
                value={"" + selected}
                onChange={(e) => this.getEmployeAgenda(e)}
                style={{ height: "40px" }}
                required
              >
                <option value="">Agenda du medecin</option>
                {Object.keys(employeList).map((key) => {
                  return (
                    <option key={key} value={key}>
                      {employeList[key]}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          {/*
            <>
              <div className="rbc-btn-group">
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
              </div>
            </>*/}
        </div>
      );
    }
  };
};

export default NotebookConsultation;
