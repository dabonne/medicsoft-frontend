import React, { useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";
import { Route, Routes } from "react-router-dom";
import AntecedentPersonnel from "../components/AntecedentPersonnel";
import Imageries from "../components/DonneeCompteRendu";
import ExamenSpecialise from "../components/ExamenSpecialise";
import DossierMedicaux from "../components/DossierMedicaux";
import DonneeCompteRendu from "../components/DonneeCompteRendu";

const DossierContainer = ({setLocation, setPageName}) => {
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [list, setList] = useState("");
  const [nameIdx, setNameIdx] = useState(0);
  setLocation(window.location.pathname)
  const tabName = [
    "Dossier médical",
    "Antécédents personnels et familiaux",
    "Compte rendu d’imagerie",
    "Compte rendu d’examens spécialisés",
    "Compte rendu d’analyses biologiques",
    "Divers"
  ]
  setPageName(tabName[nameIdx])

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
    <div className="container-fluid">
      <Routes>
        <Route path="/" element={<DossierMedicaux setNameIdx={setNameIdx} />} />
        <Route path="/antecedent-personne" element={<AntecedentPersonnel setNameIdx={setNameIdx} />} />
        <Route path="/imageries" element={<DonneeCompteRendu setNameIdx={setNameIdx} />} />
        <Route path="/examens-specialises" element={<DonneeCompteRendu setNameIdx={setNameIdx} />} />
        <Route path="/analyses-biologiques" element={<DonneeCompteRendu setNameIdx={setNameIdx} />} />
        <Route path="/divers" element={<DonneeCompteRendu setNameIdx={setNameIdx} />} />
      </Routes>
    </div>
  );
};

export default DossierContainer;
