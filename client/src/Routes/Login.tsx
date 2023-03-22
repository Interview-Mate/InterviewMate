import { LockClosedIcon } from "@heroicons/react/20/solid";
import Interview from "../Assets/InterviewMock.JPG";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useContext } from "react";
import { Context } from "../Context";
// import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginWithRedirect } = useAuth0();
  // console.log({ isAuthenticated });

  const {
    currentUser,
    setCurrentUser,
    isAuthenticated,
    handleGetUser,
    handleCreateUser,
  } = useContext(Context) as any;

  useEffect(() => {
    if (isAuthenticated) {
      handleGetUser();
    }
  }, [isAuthenticated]);

  return (
    <>
      <h1 className="app-title">InterviewMate</h1>
      {/* {isLoading && <p>Page is loading...</p>}
      {error && <p>{error.message}</p>} */}

      <div className="login-container">
        <div>
          <img className="login-image" src={Interview}></img>
        </div>

        {!isAuthenticated && (
          <div className="login-button">
            <button className="login-span" onClick={() => loginWithRedirect()}>
              <div>
                <LockClosedIcon
                  // className="h-5 text-african-violet-400 "
                  aria-hidden="true"
                />
                Sign in
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
