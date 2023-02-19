import React, { useContext, useEffect, useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";
import ModalMedical from "../../../components/ModalMedical";
import requestPatient from "../../../services/requestPatient";
import { apiMedical } from "../../../services/api";
import { AppContext } from "../../../services/context";
import DeleteModal from "../../../components/DeleteModal";

const initSelected = {
  idData: "",
  idModale: "",
  title: "",
  callBack: () => {},
};

const DonneeCompteRendu = ({ setNameIdx, type = {} }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [list, setList] = useState("");
  const [editValue, setEditValue] = useState();
  const [refresh, setRefresh] = useState(0);
  const [seletedData, setSelectedData] = useState(initSelected);
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  useEffect(() => {
    console.log(type);
    requestPatient
      .get(apiMedical.get + "/" + user.cni + "?medicalType=" + type.id, header)
      .then((res) => {
        console.log(res.data);
        setDatas(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);

  if (window.location.pathname.includes("imageries")) {
    setNameIdx(2);
  }
  if (window.location.pathname.includes("examens-specialises")) {
    setNameIdx(3);
  }
  if (window.location.pathname.includes("analyses-biologiques")) {
    setNameIdx(4);
  }
  if (window.location.pathname.includes("divers")) {
    setNameIdx(5);
  }

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
  const onDelete = (id) => {
    //e.preventDefault();
    console.log(id);
    requestPatient
      .delete(apiMedical.delete + "/" + id)
      .then((res) => {
        console.log("suppression ok");
        //setModalNotifyMsg("Suppression réussie !")
        //notifyRef.current.click()
        //setDelete([]);
        //setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="container-fluid">
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
        <div className="col-3 d-flex justify-content-end align-items-center">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target={"#modalEdit" + type.id}
          >
            Ajouter
          </button>
        </div>
      </div>

      <div className="table-responsive-lg">
        <table className="table table-striped align-middle">
          <thead>
            <tr className="align-middle">
              <th scope="col" className="border-raduis-left">
                Compte rendu ID
              </th>
              <th scope="col">Intitulé</th>
              <th scope="col">Date d’élobaration</th>
              <th scope="col">Auteur</th>
              <th scope="col" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {datas.map((data, idx) => {
              //data.checkValue = false
              return (
                <tr key={idx}>
                  <td>
                    <span className="text-bold">CR-0218374</span>
                  </td>
                  <td>
                    <span className="text-bold">{data.entitled}</span>
                  </td>
                  <td>
                    <span className="text-bold">{data.dateElaboration}</span>
                  </td>
                  <td>
                    <div className="d-inline-block me-2 align-middle">
                      <img src={user} alt="" />
                    </div>
                    <div className="d-inline-block align-middle">
                      <span className="text-bold">{data.doctor}</span>
                      <br />
                      <span>Psychiatre</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="btn-group">
                      <div className="d-inline-block mx-1">
                        <img
                          title="Voir la prescription"
                          data-bs-toggle="modal"
                          data-bs-target="#viewEmploye"
                          onClick={(e) => {
                            e.preventDefault();
                            //setDelete(["" + data.employeeReference]);
                            //viewEmploye(data);
                          }}
                          src={view}
                          alt=""
                        />
                      </div>
                      <div className="d-inline-block mx-1">
                        <img
                          title="Éditer le rapport"
                          data-bs-toggle="modal"
                          data-bs-target={"#modalEdit" + type.id}
                          onClick={(e) => {
                            e.preventDefault();
                            setEditValue({
                              id: data.id,
                              entitled: data.entitled,
                              content: data.detail,
                            });
                          }}
                          src={edit}
                          alt=""
                        />
                      </div>
                      <div className="d-inline-block mx-1">
                        <img
                          title="Supprimer le rapport"
                          data-bs-toggle="modal"
                          data-bs-target={"#deleteData"+data.id}
                          onClick={(e) => {
                            e.preventDefault();
                            initSelected.idData = data.id;
                            initSelected.title = "type.title";
                            setSelectedData(initSelected);
                          }}
                          src={del}
                          alt=""
                        />
                      </div>
                      <DeleteModal
                        id={data.id}
                        modal={"deleteData"+data.id}
                        title={"Supprimer " + seletedData.title}
                        data={seletedData}
                        onDelete={onDelete}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ModalMedical
        id={"modalEdit" + type.id}
        title={type.title}
        type={type.id}
        oldValue={editValue}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default DonneeCompteRendu;
