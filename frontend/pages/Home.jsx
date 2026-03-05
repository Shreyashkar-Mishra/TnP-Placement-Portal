import React from "react";
import { Link } from "react-router-dom";
import { Building2, BookOpen, Award, CheckCircle, Users, Briefcase, Mail } from "lucide-react";
import { motion } from "framer-motion";

export const Home = () => {
  const teamMembers = [
    { name: "Shreyashkar Mishra", role: "Team Member", image: "https://mca.pccoepune.com/assets/img/team/shreyashka-mishra.jpg", linkedin: "https://www.linkedin.com/in/shreyashkar-mishra/" },
    { name: "Chirag Gajare", role: "Team Member", image: "https://mca.pccoepune.com/assets/img/team/chirag-gajare.jpg", linkedin: "https://www.linkedin.com/in/chiraggajare/" },
    { name: "Ansh Gupta", role: "Team Member", image: "https://mca.pccoepune.com/assets/img/team/ansh-gupta.jpg", linkedin: "https://www.linkedin.com/in/ansh1gupta/" },
    { name: "Rohan Paramanand", role: "Team Member", image: "https://mca.pccoepune.com/assets/img/team/rohan-paramanad.jpg", linkedin: "https://www.linkedin.com/in/rohan-paramanand/" },
    { name: "Swati Sharma", role: "Team Member", image: "https://mca.pccoepune.com/assets/img/team/swati-sharm.jpeg", linkedin: "https://www.linkedin.com/in/swati--sharma/" },
    { name: "Najmunnisa Jamadar", role: "Team Member", image: "https://mca.pccoepune.com/assets/img/team/najmunnisa-jamadar.jpg", linkedin: "https://www.linkedin.com/in/najmunnisa-jamadar-1a526a304/" },
    { name: "Sohel Shaikh", role: "Team Member", image: "https://mca.pccoepune.com/assets/img/team/sohel-shaikh.jpg", linkedin: "https://www.linkedin.com/in/sohel-shaikh-9978a3355/" },
    { name: "Bhakti Agrawal", role: "Team Member", image: "https://mca.pccoepune.com/assets/img/team/bhakti-agrawal.jpg", linkedin: "https://www.linkedin.com/in/bhakti-agrawal-776197263/" }
  ];


  return (
    <div className="bg-white scroll-smooth">
      {/* Formal Hero Section */}
      <div className="relative bg-[#0a192f] overflow-hidden">
        {/* Classy Corporate Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-blue-600 opacity-20 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[400px] w-[400px] rounded-full bg-yellow-500 opacity-10 blur-[100px] pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left md:w-2/3">
            <h1 className="text-4xl font-serif font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
              PCCoE MCA Training & Placement Cell
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl font-light leading-relaxed">
              Bridging the gap between academia and industry. We are committed
              to providing comprehensive career guidance and placement
              opportunities for our engineering graduates.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-blue-900 bg-yellow-400 hover:bg-yellow-300 md:py-4 md:px-10 md:text-lg transition-all hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
              >
                Student Registration
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3 border border-white/50 text-base font-bold rounded-full text-white hover:bg-white hover:text-blue-900 md:py-4 md:px-10 md:text-lg transition-all hover:-translate-y-1 backdrop-blur-md bg-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
              >
                Portal Login
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="h-4 bg-yellow-500 w-full absolute bottom-0"></div>
      </div>

      {/* TPO Message / Vision */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="lg:w-1/2">
              <h2 className="text-sm font-bold tracking-widest text-yellow-500 uppercase mb-2">Training And Placement Officer</h2>
              <h3 className="text-3xl font-serif font-bold text-blue-900 mb-6">
                Prof. Rajkamal Sangole
              </h3>
              <div className="flex items-center text-gray-600 mb-6 font-medium bg-gray-50 p-3 rounded-md border-l-4 border-blue-900">
                <Mail className="h-5 w-5 mr-3 text-blue-900" />
                rajkamal.sangole@pccoepune.org
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6 font-light">
                The Training and Placement Cell plays a vital role and is committed to provide all possible assistance to its post-graduates students in their efforts to find employment. The benefits of this assistance would be reflected in the preparation of PCCOE students to secure lucrative and esteemed positions in all fields.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Arranging Campus Interviews of various organizations for final year students.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Co-ordination for Industrial visits arranged by departments.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Co-ordinations for arranging Technical Seminars, Mock Interviews, Written Test & Group Discussion.</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-12 lg:mt-0 lg:w-1/2 relative flex justify-center">
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-yellow-500 shadow-xl mb-4">
                  <img
                    src="https://mca.pccoepune.com/assets/img/staff/R.%20C.%20Sangole.jpg"
                    alt="Prof. Rajkamal Sangole"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Statistics Strip */}
      <div className="bg-blue-900 py-16 relative overflow-hidden">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40V0H40V40z" fill="none" />
                <path d="M40 0L0 40M0 0l40 40" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 border-b sm:border-b-0 sm:border-r border-blue-800 last:border-0">
              <p className="text-5xl font-serif font-bold text-yellow-500">92%</p>
              <p className="mt-2 text-sm font-medium text-blue-200 uppercase tracking-widest">Placement Rate</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 border-b sm:border-b-0 lg:border-r border-blue-800 last:border-0">
              <p className="text-5xl font-serif font-bold text-yellow-500">350+</p>
              <p className="mt-2 text-sm font-medium text-blue-200 uppercase tracking-widest">Recruiters</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center p-6 border-b sm:border-b-0 sm:border-r border-blue-800 last:border-0">
              <p className="text-5xl font-serif font-bold text-yellow-500">20 LPA</p>
              <p className="mt-2 text-sm font-medium text-blue-200 uppercase tracking-widest">Highest Package</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center p-6">
              <p className="text-5xl font-serif font-bold text-yellow-500">1200+</p>
              <p className="mt-2 text-sm font-medium text-blue-200 uppercase tracking-widest">Students Placed</p>
            </motion.div>
          </div>
        </div>
      </div>





      {/* Meet Our Team */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-yellow-500 uppercase mb-2">The Face of Placement</h2>
            <h3 className="text-3xl font-serif font-bold text-blue-900">Meet Our Team</h3>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="mx-auto w-40 h-40 rounded-full overflow-hidden bg-gray-200 mb-4 border-4 border-white shadow-lg relative group-hover:border-blue-900 transition-colors duration-300">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150?text=" + member.name.split(' ').map(n => n[0]).join('');
                      }}
                    />
                  </a>
                </div>
                <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    {member.name}
                  </a>
                </h4>
                <p className="text-sm text-yellow-600 font-medium uppercase tracking-wider mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div >
  );
};
