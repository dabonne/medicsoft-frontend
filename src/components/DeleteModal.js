import React, { useEffect, useState } from "react";

const callBack = () => {};

const DeleteModal = ({ title, id, modal, onDelete = callBack }) => {
  const [deleteModal, setDeleteModale] = useState("");
  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    //console.log({title, id , modal, onDelete})
    if (id !== undefined) {
      setDeleteModale(modal);
      setDeleteId(id);
    }
  }, [id, modal]);
  return (
    <div className="modal fade" id={deleteModal}>
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h4 className="modal-title text-meduim text-bold">{title}</h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body text-start">Comfirmer l'action</div>

          <div className="modal-footer border-0 d-flex justify-content-start">
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={(e) => {
                onDelete(deleteId);
              }}
            >
              Comfirmer
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
