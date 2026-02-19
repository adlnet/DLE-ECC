'use strict';

import React, { useEffect, useState } from "react";
import axios from "axios";

import { axiosInstance } from "../../config/axiosInstance";
import { catalogs_url } from "../../config/endpoints";
import CatalogList from "./Catalogs/CatalogList/CatalogList";
import DefaultLayout from "@/components/layouts/DefaultLayout";

const Catalogs = (props) => {
  const [catalogs, setCatalogs] = useState({
    providers: null,
    isLoading: true,
    error: null,
  });

  // API Endpoint for XIS Catalogs.
  // const catalogs_api_url = process.env.REACT_APP_XIS_CATALOGS_API;

  useEffect(() => {
    // Setting the catalogs to loading
    setCatalogs({
      isLoading: true,
    });

    // Requesting data from the API endpoint
    axiosInstance
      .get(catalogs_url)
      .then((resp) => {
        setCatalogs({
          providers: JSON.parse(resp.data),
          isLoading: false,
          error: null,
        });
      })

      // If there is an error.
      .catch((err) => {
        console.log("Failed to retrieve data from endpoint")
        setCatalogs({
          providers: null,
          isLoading: false,
          error: err,
        });
      });
  }, []);

  // Default state is to load nothing
  let content = null;

  // Show a loading message
  if (catalogs.isLoading) {
    content = <div> Loading...</div>;
  }

  // Show the content if there is any
  else if (catalogs.providers && !catalogs.isLoading) {
    content = <CatalogList catalogs={catalogs.providers} />;
  }

  // Show the error message if there is an error
  else if (catalogs.error){
    content = (
      <div>Error loading catalogs. Please contact an administrator</div>
    );
  }

  return (<DefaultLayout>{content}</DefaultLayout>);
};
export default Catalogs;
