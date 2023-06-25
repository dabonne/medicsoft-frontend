import React, { useContext, useEffect, useState } from "react";
import hp from "../assets/imgs/home_profile.png";
import homeBg from "../assets/imgs/home_bg_1.png";
import grd from "../assets/imgs/gard.png";
import { AppContext } from "../services/context";
import { Link } from "react-router-dom";
import DPicker from "../components/DPicker";
import { Calendar } from "react-calendar";
import "../assets/css/Calendar.css";
import requestUser, { URLLVM } from "../services/requestUser";
import { apiMedical, apiUser } from "../services/api";
import requestDoctor from "../services/requestDoctor";

const Home = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  const [userImg, setUserImg] = useState(hp);
  const [value, onChange] = useState(new Date());
  const [rdv, setRdv] = useState([]);
  const [stat, setStat] = useState({});
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  useEffect(() => {
    setUserImg(user.profile);
    getUserInfos()
    getEvent();
    getStatistique();
  }, []);

  const getUserInfos = () => {
    requestUser
      .get(apiUser.get + "/" + user.organisationRef, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        ///console.log(res.data.photo);
        user.profile = res.data.photoFileName;
        setUserImg(res.data.photoFileName);
        onUserChange(user);
        //console.log(res.data.employeeResponseList);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getEvent = () => {
    requestDoctor
      .get(
        apiMedical.appointmentConfirmWait + "/" + user.organisationRef,
        header
      )
      .then((res) => {
        console.log(res.data);
        //setEmployeList(res.data.employees);
        console.log(res.data);
        setRdv(res.data)
      })
      .catch((error) => {});
  };
  const getStatistique = () => {
    requestDoctor
      .get(
        apiMedical.statistique + "/" + user.organisationRef,
        header
      )
      .then((res) => {
        console.log(res.data);
        //setEmployeList(res.data.employees);
        setStat(res.data);
      })
      .catch((error) => {});
  };
  return (
    <>
      <div className="row px-3">
        <h1 className="h2">Accueil</h1>
      </div>
      <div className="row px-3">
        <div className="col-12 col-md-12 col-lg-7 bg-primary px-0 border-radius overflow-hidden d-flex align-items-center mt-4 line-height">
          <img height="150px" src={homeBg} alt="" />
          <div className="d-inline-block mx-3 line-height">
            <span className="text-white text-16">Bonjour</span> <br />
            <span className="text-white text-32 text-bold">
              {user.name}
            </span>{" "}
            <br />
            <div className="d-inline-block bg-white border-radius px-2 mt-2">
              <img src={grd} alt="" />
              <span>
                {" "}
                Vous êtes de garde cette semaine,{" "}
                <Link to="#">Voir plus en cliquant ici</Link>
              </span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-12 col-lg-4 mx-lg-3 bg-secondary border-radius d-flex align-items-center justify-content-center mt-4">
          <div className="row py-2">
            <div className="col-7">
              <div className="align-middle">
                <span className="d-block">Connecté sur</span>
                <span className="d-block text-meduim text-bold">
                  {user.organisation}
                </span>
                <span className="d-block">
                  <span
                    className="text-bold text-decoration-underline"
                    style={{ cursor: "pointer" }}
                    data-bs-toggle="modal"
                    data-bs-target="#changeOrganisation"
                  >
                    Changer d’organisation
                  </span>
                </span>
              </div>
            </div>
            <div className="col-4">
              <img
                className="rounded-circle"
                width="100px"
                src={URLLVM+""+ userImg}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row px-3">
        <div className="col-12 col-lg-7 border border-radius mt-4 d-flex align-items-center position-relative">
          <div className="w-100 text-bold text-meduim mb-3 ms-2 position-absolute top-0 py-4">
            Cette semaine
          </div>
          <div className="row row-cols-1 row-cols-md-3 mt-3 py-4">
            <div className="col text-center">
              <span className="text-48 text-bold">{stat.consultation_end}</span> <br />
              <span className="text-bold text-meduim">
                Consultation(s) effectuée(s)
              </span>
            </div>
            <div className="col text-center">
              <span className="text-48 text-bold">{stat.consultation_cancel}</span> <br />
              <span className="text-bold text-meduim">
                Consultation(s) annulée(s)
              </span>
            </div>
            <div className="col text-center">
              <span className="text-48 text-bold">{stat.prescriptions}</span> <br />
              <span className="text-bold text-meduim">
                Prescription(s) réalisée(s)
              </span>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4 mx-md-3  border border-radius col-md-5 py-4 mt-4">
          <DPicker open={true} />
          <div className="mt-4">
            <Calendar onChange={onChange} value={value} />
          </div>
        </div>
      </div>
      <div className="row px-3 mb-4">
        <div className="col-12 col-md-7 border border-radius py-4 mt-4">
          <p className="text-bold text-meduim ms-2">Vos rendez-vous à venir</p>
          {rdv.map((data, idx) => {
            return (
              <div key={idx} className="row">
                <div className="col-11 ms-3 border border-radius d-flex py-2 my-1">
                  <div className="col-4 col-md-2  text-center">
                    <img width="48px" src={hp} />
                  </div>
                  <div className="col-8 col-md-10 d-flex justify-content-between">
                    <div className="d-inline-block">
                      <span className="text-bold">{ data.patient}</span> <br />
                      <span>{data.age} ans . {data.gender}</span>
                    </div>
                    <div className="d-inline-block">
                      <span className="text-bold">{data.period}</span> <br />
                      <span>
                        <span className="text-bold">Heure</span>: {data.hour}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-12 col-md-4 mx-md-3 border border-radius py-4 mt-4">
          <p className="text-bold text-meduim ms-2">Vos récentes activités</p>
        </div>
      </div>
    </>
  );
};

export default Home;
