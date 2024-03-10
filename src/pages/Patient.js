import React, { useEffect, useState } from "react";
import back from "../assets/imgs/back.png";
import sui from "../assets/imgs/sui.png";
import sang from "../assets/imgs/sang.png";
import { Route, Routes, useNavigate } from "react-router-dom";
import InfoPatient from "./patient/InfoPatient";
import ListPatient from "./patient/ListPatient";
import DossierParamedical from "./patient/DossierParamedical";
import ListPatientHospitalisation from "./patient/ListPatientHospitalisation";

const Patient = () => {
  const [datas, setDatas] = useState([]);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  let navigate = useNavigate();
  const path = document.location.pathname;
  useEffect(() => {
    setDatas([...Array(20).keys()]);
  }, []);

  const navigateToPatientInfo = (e, idx) => {
    e.preventDefault();
    return navigate(`detail`);
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
      <Routes>
        {path.includes("patient") && (
          <Route path="/" element={<ListPatient />} />
        )}
        {path.includes("hospitalisation") && (
          <Route path="/" element={<ListPatientHospitalisation />} />
        )}

        <Route path="details/*" element={<InfoPatient />} />
        <Route path="dossier-paramedical/*" element={<DossierParamedical />} />
      </Routes>
    </>
  );
};

export default Patient;
