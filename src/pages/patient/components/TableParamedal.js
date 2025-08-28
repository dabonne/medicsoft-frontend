import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import bck from "../../../assets/imgs/bck.png";
import { Link } from "react-router-dom";
import requestPatient from "../../../services/requestPatient";
import { apiParamedical } from "../../../services/api";
import { AppContext } from "../../../services/context";
import ModalParamedical from "../../../components/ModalParamedical";
import DeleteModal from "../../../components/DeleteModal";
import Loading from "../../../components/Loading";
import { matrice, onSearch } from "../../../services/service";

const initSelected = {
  idData: "",
  idModale: "",
  title: "",
  callBack: () => {},
};
const initData = {
  TRANSMISSION: "",
  WEIGHT: "",
  BODY_TEMPERATURE: "",
  ARTERIAL_PRESSURE: "",
  ARTERIAL_PRESSURE2: "",
  CARDIAC_FREQUENCY: "",
  BLOOD_SUGAR: "",
  OXYGEN_SATURATION: "",
  HEIGHT: "",
  BLOOD_GROUP: "",
};
const TableParamedal = ({
  label = ["", ""],
  type = {},
  unite = "",
  setLocation = () => {},
}) => {
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const [stopLoad, setStopLoad] = useState(false);
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [editValue, setEditValue] = useState();
  const [refresh, setRefresh] = useState(0);
  const notify = useRef();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [dataView, setDataView] = useState({});
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  const styles = {
    width: "150px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  const [fail, setFail] = useState(false);

  useEffect(() => {
    get();
  }, [refresh]);

  const get = () => {
    requestPatient
      .get(
        apiParamedical.get + "/" + user.cni + "?paramedicalType=" + type.id,
        header
      )
      .then((res) => {
        console.log(res.data);
        const data = matrice(res.data);
        setPagination(data.list);
        if (data.list.length !== 0) {
          setDatas(data.list[0]);
          setList(data.list[0]);
          setTotalPage(data.counter);
        } else {
          setTotalPage(data.counter + 1);
        }
        setStopLoad(true);
      })
      .catch((error) => {
        console.log(error);
        setStopLoad(true);
        setFail(true);
      });
  };

  setLocation(window.location.pathname);

  const onDelete = (id) => {
    requestPatient
      .delete(apiParamedical.delete + "/" + id)
      .then((res) => {
        //setModalNotifyMsg("Suppression réussie !")
        notify.current.click();
        //setDelete([]);
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const makeSearch = (e) => {
    e.preventDefault();
    onSearch(e, setList, datas, [
      "value",
      "dateElaboration",
      "author",
      "arterialPressure",
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
    <div className="container-fluid">
      <div className="row">
        <Link
          className="text-decoration-none text-black"
          to="/dashboard/patient/dossier-paramedical/"
        >
          <img src={bck} alt="" /> Retour
        </Link>
      </div>
      <div className="row my-3">
        <div className="col-9">
          <div className="d-inline-block">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                makeSearch(e);
              }}
            />
          </div>
          <div className="btn-group">
            <div
              className="d-inline-block my-1 mx-1"
              onClick={(e) => makePagination(e, "prece")}
            >
              <img src={back} alt="" />
            </div>
            <div
              className="d-inline-block my-1 mx-1"
              onClick={(e) => makePagination(e, "suiv")}
            >
              <img src={sui} alt="" />
            </div>
          </div>
          <div className="d-inline-block my-1 mx-1 text-meduim text-bold">
            {pageNumber + 1}/{totalPage}
          </div>
        </div>
        <div className="col-3 d-flex justify-content-end align-items-center">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target={"#modalEdit" + type.id}
            onClick={(e) => {
              e.preventDefault();
              setEditValue({
                id: "",
                content: "",
                pressDia: "",
              });
            }}
          >
            Ajouter
          </button>
        </div>
      </div>

      <Loading data={datas} stopLoad={stopLoad} fail={fail}>
        <div className="table-responsive-lg">
          <table className="table table-striped align-middle">
            <thead>
              <tr className="align-middle">
                <th scope="col" className="border-raduis-left">
                  {label[0]} ID
                </th>
                <th scope="col">{label[1]}</th>
                {type.id === "ARTERIAL_PRESSURE" && (
                  <th scope="col">Pression A. Diastolique</th>
                )}
                <th scope="col">Date d’élobaration</th>
                <th scope="col">Auteur</th>
                <th scope="col" className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((data, idx) => {
                if(type.id === "HEIGHT"){
                  if(navigator.language.includes('fr')){
                    // convertion avec virgule
                    data.value = data.value.toString().replace('.', ',');
                  }
                }
                return (
                  <tr key={idx}>
                    <td>
                      <span className="text-bold">RAPP-0218374</span>
                    </td>
                    <td>
                      <div className="text-bold" style={styles}>
                        {data.value.toString() + " " + unite}

                      </div>
                    </td>
                    {type.id === "ARTERIAL_PRESSURE" && (
                      <td>
                        <div className="text-bold" style={styles}>
                          {data.arterialPressure + " " + unite}
                        </div>
                      </td>
                    )}
                    <td>
                      <span className="text-bold">{data.dateElaboration}</span>
                    </td>
                    <td>
                      <div className="d-inline-block me-2 align-middle">
                        <img src={user} alt="" />
                      </div>
                      <div className="d-inline-block align-middle">
                        <span className="text-bold">{data.author}</span>
                        <br />
                        <span>Psychiatre</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-inline-block mx-1">
                        <img
                          title="Éditer les données"
                          data-bs-toggle="modal"
                          data-bs-target={"#modalEdit" + type.id}
                          onClick={(e) => {
                            e.preventDefault();
                            setEditValue({
                              id: data.id,
                              content: data.value,
                              pressDia: data.arterialPressure,
                            });
                          }}
                          src={edit}
                          alt=""
                        />
                      </div>
                      <div className="d-inline-block mx-1">
                        <img
                          title="Supprimer les données"
                          data-bs-toggle="modal"
                          data-bs-target={"#deleteData" + data.id}
                          onClick={(e) => {
                            e.preventDefault();
                            initSelected.idData = data.id;
                            initSelected.idModale = "delete" + type.title;
                            initSelected.title = type.title;
                            initSelected.callBack = onDelete;
                            //setDelete(["" + data.employeeReference]);
                          }}
                          src={del}
                          alt=""
                        />
                      </div>
                      <DeleteModal
                        id={data.id}
                        modal={"deleteData" + data.id}
                        title={"Supprimer " + type.title}
                        onDelete={onDelete}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Loading>
      <ModalParamedical
        id={"modalEdit" + type.id}
        type={type.id}
        labelInput={type.label}
        placeholderInput={type.placeholder}
        oldValue={editValue}
        refresh={get}
      />

      <div className="modal fade" id="notify">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">Suppression réussie !</div>

            <div className="modal-footer border-0 d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={(e) => {
                  e.preventDefault();
                  //setModalNotifyMsg("");
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
      <input
        type="hidden"
        ref={notify}
        data-bs-toggle="modal"
        data-bs-target="#notify"
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    </div>
  );
};

export default TableParamedal;
