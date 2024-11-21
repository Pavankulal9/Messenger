import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ErrorPage = ({ error = null }) => {
  const navigate = useNavigate();

  return (
    <div className="error_page">
      <div>
        {error ? (
          <>
            <p>{error}</p>
            <button onClick={() => navigate("/")}>Return to home page</button>
          </>
        ) : (
          <>
            <h1>
              Access Denied <FiAlertTriangle />
            </h1>
            <p>Can't Access Page before Login</p>
            <button onClick={() => navigate("/")}>Return to home page</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
