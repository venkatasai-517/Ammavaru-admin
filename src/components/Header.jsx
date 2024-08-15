import { useEffect } from "react";
import flower from "/flower.svg";
import { Link } from "react-router-dom";

export default function Header() {
  useEffect(() => {
    const offcanvasLinks = document.querySelectorAll(
      ".offcanvas-body .nav-link"
    );
    const offcanvasNavbar = document.getElementById("offcanvasNavbar");

    const handleClose = () => {
      const offcanvasInstance =
        bootstrap.Offcanvas.getInstance(offcanvasNavbar);
      offcanvasInstance.hide();
    };

    offcanvasLinks.forEach((link) => {
      link.addEventListener("click", handleClose);
    });

    return () => {
      offcanvasLinks.forEach((link) => {
        link.removeEventListener("click", handleClose);
      });
    };
  }, []);

  return (
    <>
      <header
        className="bg-yellow-400 bg-repeat-x"
        style={{ backgroundImage: `url(${flower})` }}
      >
        <div className="grid grid-cols-6 py-2">
          <div className="col-span-1 flex justify-center items-center">
            <Link to="/special">
              <i className="bi bi-house text-xl"></i>
            </Link>
          </div>
          <div className="col-span-4">
            <div className="flex justify-center p-2 items-end">
              <img
                src="/images/kalasam.png"
                alt="Kalasam"
                width={30}
                height={30}
              />
              <div className="flex flex-col items-center">
                <img src="/images/face.png" alt="Face" width={40} height={40} />
                <b className="text-xs">శ్రీ శ్రీ కళగోళ శాంభవీ దేవి</b>
              </div>
              <img
                src="/images/kalasam.png"
                alt="Kalasam"
                width={30}
                height={30}
              />
            </div>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <button
              className="navbar-toggler border-red-700"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              aria-label="Toggle navigation"
            >
              <span>
                <i className="bi bi-list text-xl"></i>
              </span>
            </button>
          </div>
          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header flex justify-between items-center p-4">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body p-4">
              <ul className="navbar-nav flex flex-col space-y-2">
                {/* <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/weekly"
                  >
                    Daily Updates
                  </Link>
                </li> */}
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/history">
                    History
                  </Link>
                </li> */}
                <li className="nav-item">
                  <Link className="nav-link" to="/special">
                    Special Days
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/photos">
                    Photo Gallery
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/viralam">
                    Viralam
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/app">
                    Committee
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </header>
      <div
        className="bg-yellow-300 bg-repeat pt-7"
        style={{ backgroundImage: `url(${flower})` }}
      ></div>
    </>
  );
}
