import React, { useContext, useEffect, useState } from "react";
import doctor from "./assets/imgs/doc.svg";
import logo from "./assets/imgs/medicsoft.png";
import intersect from "./assets/imgs/intersect.png";
import pwd from "./assets/imgs/pwd.png";
import btn_circle from "./assets/imgs/btn_circle.svg";
import { Link, useNavigate } from "react-router-dom";
import requestUser from "./services/requestUser";
import { apiUser } from "./services/api";
import { AppContext } from "./services/context";
import FormNotify from "./components/FormNotify";

const Login = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  const navigate = useNavigate();
  const [inputType, setInputType] = useState("password");
  const [loginFail, setLoginFail] = useState(false);
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const [isSend,setIsSend] = useState(false)

  useEffect(() => {
    isAuth();
  }, [user.isAuth]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginFail(false);
    requestUser
      .post(apiUser.login, login)
      .then((res) => {
        //console.log(res.data);
        onUserChange({
          isAuth: true,
          type: "",
          name: res.data.firstname + " " + res.data.lastname,
          organisation: res.data.roles[0].organisation,
          organisationRef: Object.keys(res.data.organisation)[0],
          organisations: res.data.organisation,
          profile: "",
          roles: res.data.roles,
          token: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          cni: "",
        });
        isAuth();
      })
      .catch((error) => {
        setLoginFail(true);
        console.log(error);
      });
  };

  const isAuth = () => {
    console.log(`connexion reussi, isAuth: ${user}`);

    if (user.isAuth === true && user.token != null && user.token !== "") {
      console.log(`connexion reussi, isAuth: ${user}`);
      console.log(user);

      return navigate("/dashboard/");
    }
  };

  const onChange = (e) => {
    e.preventDefault();
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };
  const restPassword = (e) => {
    e.preventDefault();
    const data = { email: login.username };
    console.log(data);
    requestUser
      .post(apiUser.forget + "?email=" + login.username)
      .then((res) => {
        console.log(res.data);
        setIsSend(true)
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="d-none d-lg-block col-lg-5 h-100 illustration-img">
        <img width="100%" src={doctor} alt="" />
      </div>
      <div className="col-12 col-lg-7 h-100 illustration-form position-relative">
        <div className="row px-3">
          <div className="col-12 col-sm-12 col-md-7">
            <form onSubmit={handleSubmit} className="mt-5">
              <img
                className="mt-5 mb-3"
                src={logo}
                alt=""
                width="156.04px"
                height="35px"
              />
              <h1 className="text-bold m-0">Connexion</h1>
              <span className="d-inline-block mb-5">
                Heureux de vous revoir
              </span>
              {loginFail ? (
                <div className="mb-3">
                  <FormNotify
                    bg={"danger"}
                    title={""}
                    message={"Nom d’utilisateur ou mot de passe incorrect."}
                  />
                </div>
              ) : null}
              <div className="form-floating mb-4">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  name="username"
                  value={login.username}
                  onChange={onChange}
                />
                <label htmlFor="floatingInput">Email</label>
              </div>
              <div className="form-floating mb-4 position-relative">
                <input
                  type={inputType}
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  name="password"
                  value={login.password}
                  onChange={onChange}
                />
                <label htmlFor="floatingPassword">Mots de passe</label>
                <img
                  className="position-absolute eye-position"
                  src={intersect}
                  alt=""
                  onClick={(e) => {
                    e.preventDefault();
                    inputType === "password"
                      ? setInputType("text")
                      : setInputType("password");
                  }}
                />
              </div>

              <div className="checkbox mb-4 position-relative">
                <label className="text-small align-middle">
                  <input
                    className="no-height"
                    type="checkbox"
                    value="remember-me"
                  />{" "}
                  Se souvenir de moi
                </label>
                <Link
                  to="#"
                  className="text-small link text-deco position-absolute top-0 end-0"
                  data-bs-toggle="modal"
                  data-bs-target="#forgetPassword"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <button type="submit" className="w-100 btn btn-lg btn-primary">
                Se connecter
              </button>
            </form>
          </div>
        </div>

        <div className="row position-absolute bottom-0 w-100">
          <div className="col-12 col-md-11 mx-auto my-2 d-flex justify-content-between ">
            <div className="text-small d-inline-block my-1 me-2">
              © Laafi Vision Médical, Tous droits réservés.
            </div>
            <div className="d-inline-block">
              <Link to="#" className="text-small link d-inline-block my-1 me-2">
                Conditions générales
              </Link>
              <Link to="#" className="text-small link d-inline-block my-1">
                Politiques de confidentialités
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 position-relatve">
        <div className="position-fixed bottom-3 end-0">
          <img className="" src={btn_circle} alt="" />
        </div>
      </div>

      <div className="modal fade" id="forgetPassword">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body col-12 col-md-8 mx-auto">
              <div className="text-center">
                <img src={pwd} alt="" />
              </div>
              <h4 className="modal-title text-center text-meduim text-bold mt-4 mb-3">
                {
                  !isSend ? "Mot de passe oublié?" : "Le lien de réinitialisation a été envoyé"
                }
              </h4>
              {!isSend && (
                <>
                  <p className="text-center">
                    Veuillez renseigner votre adresse e-mail, et nous vous
                    enverrons un courriel contenant les instructions pour
                    réinitialiser votre mot de passe.{" "}
                  </p>
                  <form className="" onSubmit={restPassword}>
                    <div className="mb-3 mt-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Entrer votre adresse mail"
                        name="username"
                        value={login.username}
                        onChange={onChange}
                        required
                      />
                      <input
                        type="submit"
                        
                        className="form-control btn btn-primary my-3"
                        value="Envoyer le mail de réinitialisation"
                      />
                      <div className="invalid-feedback">
                        Veuillez entrer une adresse mail
                      </div>
                    </div>
                  </form>
                </>
              )}
              {isSend && (
                <>
                  <p className="text-center">
                  Votre lien de réinitialisation a été envoyé. Veuillez vérifier votre compte.{" "}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
