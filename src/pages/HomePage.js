import React, { useEffect } from "react";
import "../assets/styles/homePage.css";
//import SelectLocation from "../components/homePage/SelectLocation";
import Services from "../components/homePage/Services";
import { useStateContext } from "../contexts/ContextProvider";
import Navigation from "../components/homePage/Navigation";
import axios from "axios";

/*
this is the hopepage component
it acts as a wrapper to all the other components

*/

function HomePage() {
  const [{ origin }, dispatch] = useStateContext();
  const fetchData = (pos) => {
    let crd = pos.coords;
    let locationDoc = {
      Location: {
        type: "Point",
        coordinates: [crd.longitude, crd.latitude],
      },
      Radius: 5,
      SortBy: "Oxygen",
    };
    // console.log("Request that will be going: ", locationDoc);
    axios
      .post(`${origin}/getHealthCentres`, locationDoc)
      .then((response) => {
        // console.log(response);
        dispatch({
          type: "Update Data",
          data: response.data,
        });
      })
      .catch((error) => {
        console.log("Error occoured while fetching data from backend", error);
      });
  };
  const errors = (err) => {
    alert(
      "Location Permission Denied! Enable permission to detect location",
      err
    );
  };
  useEffect(() => {
    let options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    };

    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          navigator.geolocation.getCurrentPosition(fetchData);
        } else if (result.state === "prompt") {
          navigator.geolocation.getCurrentPosition(fetchData, errors, options);
        } else if (result.state === "denied") {
          alert(
            "Location Permission Denied! Enable permission to detect location"
          );
        }
        result.onchange = function () {};
      });
    } else {
      alert("Sorry Not available!");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let wrapperDivClass = "homepage__wrapper homepage__wrapper--light";

  return (
    <>
      <Navigation />
      <div className={wrapperDivClass}>
        {/* the top right profile icon */}

        {/* headings */}
        <div className="homepage__heading">
          <h3>Covid-19</h3>
          <h2 style={{ margin: 0 }}>Help Resources</h2>
        </div>
        {/* (select option to select location and the cards based on categories )
        separated into thier own components
      */}
        {/* <SelectLocation /> */}
        <Services />
      </div>
    </>
  );
}

export default HomePage;
