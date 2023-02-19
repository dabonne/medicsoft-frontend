import view from "../assets/imgs/view.png";
import add from "../assets/imgs/add.png";
import FormNotify from "./FormNotify";
import { useContext, useEffect, useRef, useState } from "react";
import requestPatient from "../services/requestPatient";
import { apiParamedical } from "../services/api";
import { AppContext } from "../services/context";
import { Link } from "react-router-dom";

const initParamedical = {
  patientCni: "",
  value: "",
  paramedicalType: "",
  dateElaborate: "",
};

const ButtonParamedical = ({ img, title, id, link }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [paramedical, setParamedical] = useState(initParamedical);
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [formValidate, setFormValidate] = useState("needs-validation");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  const [moment, setMoment] = useState();
  const closeRef = useRef();
  const closeEditRef = useRef();
  const notifyRef = useRef();
  const header = {
    headers: { Authorization: `${user.token}` },
  };

  useEffect(() => {
    setMoment(getDate());
    console.log({ img, title });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    configNotify("loading", "", "Ajout d’un nouvel(le) employé(e) en cours...");
    //console.log(jsData)
    requestPatient
      .post(apiParamedical.post, paramedical, header)
      .then((res) => {
        console.log("enregistrement ok");

        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );
        setModalNotifyMsg("L'employé a été ajouté avec succès");
        closeRef.current.click();
        notifyRef.current.click();
      })
      .catch((error) => {
        console.log(error);
        configNotify(
          "danger",
          "Ouppss!!",
          "Une erreur est survenue, veuillez reesayer plus tard..."
        );
      });
  };

  const configNotify = (bg, title, message) => {
    setNotifyBg(bg);
    setNotifyTitle(title);
    setNotifyMessage(message);
  };
  const fValidate = (cl) => {
    setFormValidate(cl);
  };

  const getDate = () => {
    const mois = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];

    function frenchTodayDate() {
      let today = new Date();
      let year = today.getFullYear();
      let dayNumber = today.getDate();
      let month = mois[today.getMonth()];
      let weekday = today.toLocaleDateString("fr-FR", { weekday: "long" });
      let hours = today.getHours();
      let minutes = today.getMinutes();
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return { weekday, dayNumber, month, year, hours, minutes };
    }

    const capitalize = ([first, ...rest]) =>
      first.toUpperCase() + rest.join("").toLowerCase();
    const { weekday, dayNumber, month, year, hours, minutes } =
      frenchTodayDate();
    const aujourdhui = `${capitalize(
      weekday
    )} ${dayNumber} ${month} ${year} - ${hours}H:${minutes}`;

    return aujourdhui;
  };
  return (
    <>
      <div className="px-1 border rounded-2 py-1 my-3">
        <div className="d-flex align-items-center">
          <div className="me-auto">
            <span>
              <img src={img} alt="" />
            </span>
            <span>{" " + title}</span>
          </div>
          <div>
            <Link to={link}>
              <span className="d-inline-block me-1">
                <img src={view} alt="" />
              </span>
            </Link>
            <span
              className="d-inline-block"
              data-bs-toggle="modal"
              data-bs-target={"#" + id}
            >
              <img src={add} alt="" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ButtonParamedical;
