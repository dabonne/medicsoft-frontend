import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { apiParamedical, apiPatient } from "../services/api";
import { AppContext } from "../services/context";
import requestPatient from "../services/requestPatient";
import requestDoctor, { URL_DOCTOR_MANAGEMENT } from "../services/requestDoctor";

const InformationPatient = ({disableBtn = false}) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [data, setData] = useState("");
  const [syntheseList, setSyntheseList] = useState([]);
  const header = {
    headers: { Authorization: `${user.token}` },
  };

  useEffect(() => {
    get();
    synthese();
  }, []);

  const get = () => {
    requestPatient
      .get(apiPatient.get + "/" + user.cni, header)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        //deconnect()
      });
  };

  const synthese = () => {
    requestDoctor
      .get(apiParamedical.synthese + "/" + user.cni, header)
      .then((res) => {
        setSyntheseList(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        //deconnect()
      });
  };
  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="d-inline-block me-3 text-bold text-meduim align-top">
            <span>{data.lastname + " " + data.firstname}</span>
          </div>
          <div className="d-inline-block">
            <span className="text-bold">
              {data.age} ans. {data.gender}
            </span>{" "}
            <br />
            <span>Date de naissance: </span>
            <span className="text-bold">{data.birthdate}</span> <br />
            <span>Poids: </span>
            <span className="text-bold">{data.weight} kg</span> <br />
            <span>Taille: </span>
            <span className="text-bold">{data.height} m</span> <br />
            <span>IMC: </span>
            <span className="text-bold">{data.imc} KG/M²</span> <br />
            <span>
              <Link
                to="/dashboard/patient/dossier-paramedical"
                className="text-black"
              >
                Voir le dossier paramédical
              </Link>{" "}
            </span>{" "}
            <br />
          </div>
        </div>
        {
            ! disableBtn && <div className="col-12 col-md-6">
            <div className="btn-group">
              <div
                className="btn btn-secondary me-2"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    URL_DOCTOR_MANAGEMENT +
                      "/doctor-management/external-api/doctor/medical-record/synthesis-report/" +
                      user.cni +
                      "/" +
                      user.organisationRef
                  );
                }}
              >
                Synthèse
              </div>
              <div className="btn btn-primary me-2 disabled">Exporter le dossier</div>
            </div>
          </div>
        }
      </div>
    </>
  );
};

export default InformationPatient;
