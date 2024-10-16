import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => <footer className="page-footer font-small blue pt-4 bg-dark text-white">
    <div className="container-fluid text-center text-md-left">
        <div className="row">
            <div className="col-md-12 mt-md-0 mt-3">
                <h5 className="text-uppercase">Footer Content</h5>
                <p>Here you can use rows and columns to organize your footer content.</p>
            </div>

            <hr className="clearfix w-100 d-md-none pb-0"/>

        </div>
    </div>

    <div className="footer-copyright text-center py-3">© 2020 Copyright:
        <a href="https://mdbootstrap.com/"> MDBootstrap.com</a>
    </div>

</footer>

export default Footer