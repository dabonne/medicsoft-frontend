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
    "Antécédents",
    "Compte rendu d’imagerie",
    "Compte rendu d’examens spécialisés",
    "Compte rendu d’analyses biologiques",
    "Divers"
  ]
  const medicalType = [
    {
      id: "PERSONNAL_FAMILY_HISTORY",
      title: "Antécédents",
    },
    {
      id: "IMAGERY",
      title: "Compte rendu d’imagerie",
      label: "Imagerie",
    },
    {
      id: "SPECIALIZED_EXAM",
      title: "Compte rendu d’examens spécialisés",
    },
    {
      id: "BIOLOGIC_ANALYSE",
      title: "Compte rendu d’analyses biologiques",
    },
    {
      id: "VARIOUS",
      title: "Résumé consultation",
    },
  ]

  setPageName(tabName[nameIdx])

  return (
    <div className="container-fluid">
      <Routes>
        <Route path="/" element={<DossierMedicaux setNameIdx={setNameIdx} />} />
        <Route path="/antecedent-personne" element={<AntecedentPersonnel type={medicalType[0]} setNameIdx={setNameIdx} />} />
        <Route path="/imageries" element={<DonneeCompteRendu type={medicalType[1]} setNameIdx={setNameIdx} />} />
        <Route path="/examens-specialises" element={<DonneeCompteRendu type={medicalType[2]} setNameIdx={setNameIdx} />} />
        <Route path="/analyses-biologiques" element={<DonneeCompteRendu type={medicalType[3]} setNameIdx={setNameIdx} />} />
        <Route path="/resume-consultation" element={<DonneeCompteRendu type={medicalType[4]} setNameIdx={setNameIdx} />} />
      </Routes>
    </div>
  );
};

export default DossierContainer;
