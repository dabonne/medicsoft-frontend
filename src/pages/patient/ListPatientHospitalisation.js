import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../../assets/imgs/back.png";
import sui from "../../assets/imgs/sui.png";
import profile from "../../assets/imgs/profile.png";
import sang from "../../assets/imgs/sang.png";
import { Route, Routes, useNavigate } from "react-router-dom";
import FormNotify from "../../components/FormNotify";
import requestPatient from "../../services/requestPatient";
import { apiHospitalisation, apiPatient } from "../../services/api";
import { AppContext } from "../../services/context";
import Loading from "../../components/Loading";
import ModalPatient from "../../components/ModalPatient";
import { matrice, onSearch } from "../../services/service";
import requestHospitalisation from "../../services/requestHospitalisation";

const initPatient = {
  organisationId: "",
  firstname: "",
  lastname: "",
  birthdate: "",
  phoneNumber: "",
  parentFirstname: "",
  parentLastname: "",
  parentCnib: "",
  country: "",
  city: "",
  parentPhoneNumber: "",
  countryMinor: "",
  cityMinor: "",
  cni: "",
  gender: "",
  linkParental: "",
  cities: {},
  countries: {},
  genders: {},
  parental: {},
  mineur: false,
};

const ListPatientHospitalisation = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange, onCniChange } = authCtx;
  const [refresh, setRefresh] = useState(0);
  const [stopLoad, setStopLoad] = useState(false);
  const [datas, setDatas] = useState([]);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [fail, setFail] = useState(false);
  let navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [pagination, setPagination] = useState([]);
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  useEffect(() => {
    //setDatas([...Array(20).keys()]);
    get();
  }, []);

  const get = () => {
    requestHospitalisation
      .get(apiHospitalisation.patient + "/hospitalisation", header)
      .then((res) => {
        setStopLoad(true);
        const data = matrice(res.data);
        setPagination(data.list);
        if (data.list.length !== 0) {
          setDatas(data.list[0]);
          setList(data.list[0]);
          setTotalPage(data.counter);
        } else {
          setTotalPage(data.counter + 1);
        }
        console.table(res.data);
      })
      .catch((error) => {
        console.log(error);
        setStopLoad(true);
        setFail(true);
      });
  };

  const navigateToPatientInfo = (e, data) => {
    e.preventDefault();
    user.cni = data.cni;
    user.patientId = data.patientId;
    onUserChange(user);
    return navigate(`details`);
  };

  const makeSearch = (e) => {
    e.preventDefault();
    onSearch(e, setList, datas, [
      "firstname",
      "lastname",
      "age",
      "phoneNumber",
      "cni",
      "gender",
    ]);
  };

  const makePagination = (e, page) => {
    e.preventDefault();
    if (page === "suiv" && pageNumber < Number(totalPage) - 1) {
      setPageNumber(pageNumber + 1);
      setList(pagination[pageNumber + 1]);
      setDatas(pagination[pageNumber + 1]);
    }
    if (page === "prece" && pageNumber >= 1) {
      setPageNumber(pageNumber - 1);
      setList(pagination[pageNumber - 1]);
      setDatas(pagination[pageNumber - 1]);
    }
  };
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <h1 className="h2">Patients en hospitalisation</h1>
        <div className="btn-toolbar">
          {
            /**
             * <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#newPatient"
            // onClick={(e) => getJsData(e)}
          >
            +
          </button>
             */
          }
        </div>
      </div>
      <div className="row my-4">
        <div className="col-12">
          <div className="d-inline-block">
            <input
              type="text"
              className="form-control search"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                makeSearch(e);
              }}
            />
          </div>
          <div className="btn-group">
            <div className="d-inline-block my-1 mx-1"
            onClick={(e) => makePagination(e, "prece")}
            >
              <img src={back} alt="" />
            </div>
            <div className="d-inline-block my-1 mx-1"
            onClick={(e) => makePagination(e, "suiv")}
            >
              <img src={sui} alt="" />
            </div>
          </div>
          <div className="d-inline-block my-1 mx-1 text-meduim text-bold">
          {pageNumber + 1}/{totalPage}
          </div>
        </div>
      </div>

      <Loading data={datas} stopLoad={stopLoad} fail={fail}>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3 mb-4">
          {list.map((data, idx) => {
            return (
              <div
                key={idx}
                className="col"
                type="button"
                onClick={(e) => navigateToPatientInfo(e, data)}
              >
                <div className="card v-card shadow-sm p-1">
                  <div className="d-inline-block mx-auto my-2">
                    <img className="circle" width="100%" src={profile} alt="" />
                  </div>
                  <div className="mt-2 mb-5">
                    <span className="d-block text-center text-bold text-meduim">
                      {data.lastname + " " + data.firstname}
                    </span>
                    <span className="d-block my-1 text-center">
                      <span>ID Patient: </span>
                      <span className="text-bold">{data.patientId}</span>
                    </span>
                    <span className="d-block my-1 text-center">
                      <span className="text-bold">
                        {data.age} ans . {data.gender}
                      </span>
                    </span>
                    <span className="d-block my-1 text-center">
                      <span className="text-bold text-meduim">
                        <img src={sang} alt="" /> {data.bloodGroup}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Loading>

      <ModalPatient refresh={get} />
    </>
  );
};

export default ListPatientHospitalisation;
