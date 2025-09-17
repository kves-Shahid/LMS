
import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Footer = () => {
  return (
    <>
      <style>{`
        .footer-container {
          margin-top: 1rem;
        }
        .footer-social {
          background-color: #0d6efd;
          padding: 0.5rem 0;
        }
        .footer-main {
          background-color: #1c2331;
          padding: 1.5rem 0;
        }
        .footer-copyright {
          background-color: rgba(0, 0, 0, 0.2);
          padding: 0.5rem 0;
          margin-bottom: 0;
        }
        .footer-divider {
          width: 60px;
          height: 2px;
          background-color: #7c4dff;
          margin: 0.5rem 0 1rem 0;
        }
        .social-icon {
          font-size: 1.2rem;
          margin-right: 1rem;
          transition: all 0.3s ease;
        }
        .social-icon:hover {
          transform: translateY(-2px);
          opacity: 0.8;
        }
        .footer-content {
          padding: 0 15px;
        }
        .footer-text-small {
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        /* Remove any extra spacing at the bottom */
        footer {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }
      `}</style>

      <footer className="text-white text-lg-start footer-container">
        {/* Section: Social media */}
        <section className="footer-social">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center footer-content">
              {/* Left */}
              <div className="me-5">
                <span className="footer-text-small">Get connected with us on social networks:</span>
              </div>
              {/* Right */}
              <div>
                <a href="https://www.facebook.com/shahid.ahamed.95594" className="text-white me-4 social-icon" aria-label="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://x.com/" className="text-white me-4 social-icon" aria-label="Twitter">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="https://www.udemy.com/?utm_source=aff-campaign&utm_medium=udemyads&LSNPUBID=wizKxmN8no4&ranMID=47907&ranEAID=wizKxmN8no4&ranSiteID=wizKxmN8no4-l3Ji6yYMRnwsyw96OivZFQ&gad_source=1&gad_campaignid=22388734312&gbraid=0AAAAApACmIM7fOmy6Bn-J6Vt3V6G5bVTc&gclid=CjwKCAjwk7DFBhBAEiwAeYbJsVVx9I2slLs65KoqmBbuNWLMKyCXLknoYot6xDsgDJHavBugLmhhXRoCmVUQAvD_BwE" className="text-white me-4 social-icon" aria-label="Udemy">
                  <i className="bi bi-google"></i>
                </a>
              </div>
            </div>
          </div>
        </section>


        <section className="footer-main">
          <div className="container text-center text-md-start footer-content">
            <div className="row">

              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold">LMS</h6>
                <div className="footer-divider"></div>
                <p className="footer-text-small">
                  LMS is your premier destination for online learning. 
                  Discover thousands of courses to advance your career and 
                  expand your knowledge.
                </p>
              </div>

              <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold">Products</h6>
                <div className="footer-divider"></div>
                <p className="footer-text-small"><a href="#!" className="text-white text-decoration-none">LMS Courses</a></p>
                <p className="footer-text-small"><a href="#!" className="text-white text-decoration-none">LMS Pro</a></p>
                <p className="footer-text-small"><a href="#!" className="text-white text-decoration-none">LMS Business</a></p>
                <p className="footer-text-small"><a href="#!" className="text-white text-decoration-none">LMS Teach</a></p>
              </div>


              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold">Useful Links</h6>
                <div className="footer-divider"></div>
                <p className="footer-text-small"><a href="#!" className="text-white text-decoration-none">Your Account</a></p>
                <p className="footer-text-small"><a href="#!" className="text-white text-decoration-none">Become an Affiliate</a></p>
                <p className="footer-text-small"><a href="#!" className="text-white text-decoration-none">Learning Paths</a></p>
                <p className="footer-text-small"><a href="#!" className="text-white text-decoration-none">Help Center</a></p>
              </div>


              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold">Contact</h6>
                <div className="footer-divider"></div>
                <p className="footer-text-small"><i className="bi bi-house me-2"></i> Dhaka, Bangladesh</p>
                <p className="footer-text-small"><i className="bi bi-envelope me-2"></i> info@LMS.com</p>
                <p className="footer-text-small"><i className="bi bi-phone me-2"></i> + 01 234 567 88</p>
                <p className="footer-text-small"><i className="bi bi-printer me-2"></i> + 01 234 567 89</p>
              </div>
            </div>
          </div>
        </section>

        <div className="footer-copyright text-center p-2">
          <span className="footer-text-small">
            © {new Date().getFullYear()} Copyright: 
            <a className="text-white ms-1 text-decoration-none" href="/">LMS.com</a>
          </span>
        </div>
      </footer>
    </>
  );
};

export default Footer;