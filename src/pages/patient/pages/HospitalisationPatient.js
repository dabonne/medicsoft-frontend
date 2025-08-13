import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";
import { Route, Routes, useLocation } from "react-router-dom";
import Dossier from "../components/DossierMedicaux";
import AntecedentPersonnel from "../components/AntecedentPersonnel";
import { useFormik } from "formik";
import FormNotify from "../../../components/FormNotify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import requestPatient from "../../../services/requestPatient";
import { apiHospitalisation, apiMedical } from "../../../services/api";
import { AppContext } from "../../../services/context";
import Loading from "../../../components/Loading";
import { matrice, onSearch } from "../../../services/service";
import requestDoctor from "../../../services/requestDoctor";
import requestHospitalisation from "../../../services/requestHospitalisation";
import Input from "../../../components/Input";
import HospitalisationListe from "../hospitalisation/HospitalisationListe";
import HospitalisationDetail from "../hospitalisation/HospitalisationDetail";
import FIchierHospi from "../hospitalisation/FIchierHospi";
import { URL_FILE_MANAGEMENT } from "../../../services/requestOrganisation";

const initData = {
  motifHospitalisation: "",
  historyDisease: "",
  examClinic: "",
  conclusion: "",
  entryDate: "",
};
const HospitalisationPatient = ({ setLocation }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [stopLoad, setStopLoad] = useState(false);
  const [list, setList] = useState([]);
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [value, setValue] = useState("");
  const [editMode, setEditMode] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [deleteId, setDeleteId] = useState("");
  const closeRef = useRef();
  const notifyRef = useRef();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  const [fail, setFail] = useState(false);

  useEffect(() => {
    get();
    setLocation(window.location.pathname);
  }, [refresh]);

  const makeSearch = (e) => {
    e.preventDefault();
    onSearch(e, setList, datas, [
      "editDate",
      "editBy",
      "description",
      "nameDoctor",
      "specialityDoctor",
      "numberOrder",
    ]);
  };

  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      console.log(values);
      post(values)
    },
  });

  const post = (values) => {
    //e.preventDefault();
    configNotify("loading", "", "Ajout des données en cours...");
    console.log(value);
    requestHospitalisation
      .post(
        apiHospitalisation.patient + "/" + user.patientId + "/hospital-records",
        values,
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

        closeRef.current.click();
        notifyRef.current.click();
        setRefresh(refresh + 1);
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
  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log(editMode);
    configNotify("loading", "", "Ajout des données en cours...");
    //console.log(apiMedical.updateReport + "/" + user.organisationRef + "/" + editMode+"?description="+value);
    requestPatient
      .put(
        apiMedical.updateReport +
          "/" +
          user.organisationRef +
          "/" +
          editMode +
          "?description=" +
          value,
        {
          patientCni: user.cni,
          description: value,
        },
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

        closeRef.current.click();
        notifyRef.current.click();
        setRefresh(refresh + 1);
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

  const get = () => {
    requestHospitalisation
      .get(
        apiHospitalisation.patient + "/" + user.patientId + "/hospital-records",
        header
      )
      .then((res) => {
        console.log(res.data);
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
      })
      .catch((error) => {
        console.log(error);
        setStopLoad(true);
        setFail(true);
      });
  };
  const viewCompteRendu = (id) => {
    requestPatient
      .get(apiMedical.getReportByID + "/" + id, header)
      .then((res) => {
        console.log("view");
        console.log(res.data);
        setValue(res.data.description);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDelete = (id) => {
    requestPatient
      .delete(apiMedical.deleteReport + "/" + id)
      .then((res) => {
        setModalNotifyMsg("Suppression réussie !");
        closeRef.current.click();
        notifyRef.current.click();
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const configNotify = (bg, title, message) => {
    setNotifyBg(bg);
    setNotifyTitle(title);
    setNotifyMessage(message);
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

  const printCompteRendu = (e, id) => {
    e.preventDefault();
    requestDoctor
      .get(apiMedical.printReport + "/" + id + "/" + user.organisationRef)
      .then((res) => {
        window.open( URL_FILE_MANAGEMENT + "/" + res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="container-fluid">
      <Routes>
        <Route path="/" element={<HospitalisationListe />} />
        <Route path="/detail/:id" element={<HospitalisationDetail />} />
      </Routes>
    </div>
  );
};

export default HospitalisationPatient;
