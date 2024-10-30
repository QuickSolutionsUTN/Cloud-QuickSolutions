import React from "react";
import RequestDetails from "../components/Requests/RequestDetails";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/Requests/requestDetails.css';

export default function RequestDetailsPage() {
  return (
    <div className="container-fluid my-5">
      <div className="container request-data p-3">
        <RequestDetails />
      </div>
    </div>
  );
}
