import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../../assets/imgs/back.png";
import sui from "../../assets/imgs/sui.png";
import profile from "../../assets/imgs/profile.png";
import sang from "../../assets/imgs/sang.png";
import { Route, Routes, useNavigate } from "react-router-dom";
import FormNotify from "../../components/FormNotify";
import requestPatient from "../../services/requestPatient";
import { apiPatient } from "../../services/api";
import { AppContext } from "../../services/context";
import Loading from "../../components/Loading";
import ModalPatient from "../../components/ModalPatient";

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

const ListPatient = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange, onCniChange } = authCtx;
  const [refresh, setRefresh] = useState(0);
  const [stopLoad, setStopLoad] = useState(false);
  const [datas, setDatas] = useState([]);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [fail, setFail] = useState(false)
  let navigate = useNavigate();

  const header = {
    headers: { Authorization: `${user.token}` },
  };
  useEffect(() => {
    //setDatas([...Array(20).keys()]);
    get()
  }, []);

  const get = () => {
    requestPatient
      .get(apiPatient.getAll + "/" + user.organisationRef, header)
      .then((res) => {
        setStopLoad(true)
        setDatas(res.data);
        console.table(res.data);
      })
      .catch((error) => {
        setStopLoad(true)
        setFail(true)
      });
  }


  const navigateToPatientInfo = (e, idx) => {
    e.preventDefault();
    user.cni = idx;
    onUserChange(user);
    return navigate(`details`);
  };

  const onSearch = (e) => {
    e.preventDefault();
    let str = e.target.value;
    let dd = datas.filter((data) => {
      const fullNameOne = data.lastName + " " + data.firstName;
      const fullNameTwo = data.firstName + " " + data.lastName;
      const fullNameOneDepart =
        data.lastName + " " + data.firstName + " " + data.department;
      const fullNameTwoDepart =
        data.firstName + " " + data.lastName + " " + data.department;

      return (
        data.lastName.toLowerCase().includes(str.toLowerCase()) ||
        data.firstName.toLowerCase().includes(str.toLowerCase()) ||
        data.department.toLowerCase().includes(str.toLowerCase()) ||
        fullNameOne.toLowerCase().includes(str.toLowerCase()) ||
        fullNameTwo.toLowerCase().includes(str.toLowerCase()) ||
        fullNameOneDepart.toLowerCase().includes(str.toLowerCase()) ||
        fullNameTwoDepart.toLowerCase().includes(str.toLowerCase())
      );
    });

    dd !== [] ? setList(dd) : setList(datas);
  };
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <h1 className="h2">Mes patients</h1>
        <div className="btn-toolbar">
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#newPatient"
           // onClick={(e) => getJsData(e)}
          >
            +
          </button>
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
                onSearch(e, search);
              }}
            />
          </div>
          <div className="btn-group">
            <div className="d-inline-block my-1 mx-1">
              <img src={back} alt="" />
            </div>
            <div className="d-inline-block my-1 mx-1">
              <img src={sui} alt="" />
            </div>
          </div>
          <div className="d-inline-block my-1 mx-1 text-meduim text-bold">
            1/10
          </div>
        </div>
      </div>

      <Loading data={datas} stopLoad={stopLoad} fail={fail}>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3 mb-4">
          {datas.map((data, idx) => {
            return (
              <div
                key={idx}
                className="col"
                type="button"
                onClick={(e) => navigateToPatientInfo(e, data.cni)}
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

export default ListPatient;
