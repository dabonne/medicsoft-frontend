import view from "../assets/imgs/view.png";
import add from "../assets/imgs/add.png";
import { Link } from "react-router-dom";

const ButtonParamedical = ({ img, title, id, link }) => {
  
  return (
    <>
      <div className="px-1 border rounded-2 py-1 my-3">
        <div className="d-flex align-items-center">
          <div className="me-auto">
            <span>
              <img src={img} alt="" />
            </span>
            <span>{" " + title}</span>
          </div>
          <div>
            <Link to={link}>
              <span className="d-inline-block me-1">
                <img src={view} alt="" />
              </span>
            </Link>
            {/***
             * <span
              className="d-inline-block"
              data-bs-toggle="modal"
              data-bs-target={"#" + id}
            >
              <img src={add} alt="" />
            </span>
             */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ButtonParamedical;
