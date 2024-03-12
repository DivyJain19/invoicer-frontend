import React, { useState } from 'react';
import { FaBars, FaRegFileAlt } from 'react-icons/fa';
import {
  MdDomainAdd,
  MdAssignmentAdd,
  MdAddShoppingCart,
} from 'react-icons/md';

import { IoHome } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const menuItem = [
    {
      path: '/home',
      name: 'Dashboard',
      icon: <IoHome size={20} />,
    },
    {
      path: '/addCompany',
      name: 'Add Company',
      icon: <MdDomainAdd size={20} />,
    },
    {
      path: '/addProduct',
      name: 'Add Product',
      icon: <MdAddShoppingCart size={20} />,
    },
    {
      path: '/addEntry',
      name: 'Add Entry',
      icon: <MdAssignmentAdd size={20} />,
    },
    {
      path: '/invoice',
      name: 'Invoice',
      icon: <FaRegFileAlt size={20} />,
    },
  ];
  return (
    <div className="containerSidebar">
      <div style={{ width: isOpen ? '250px' : '50px' }} className="sidebar">
        <div className="top_section">
          <h1 style={{ display: isOpen ? 'block' : 'none' }} className="logo">
            Invoicer
          </h1>
          <div style={{ marginLeft: isOpen ? '70px' : '0px' }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeclassname="active"
          >
            <div className="icon">{item.icon}</div>
            <div
              style={{ display: isOpen ? 'block' : 'none' }}
              className="link_text"
            >
              {item.name}
            </div>
          </NavLink>
        ))}
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
