import React from 'react';
import { NavLink } from 'react-router-dom';
import { Vendor } from '../menuType';

interface VendorsProps {
  vendors: Vendor[];
}

const Vendors: React.FC<VendorsProps> = ({ vendors }) => {
  return (
    <div>
      {vendors.map((vendor: Vendor) => (
        <NavLink to={`/menu/${vendor.id}`} key={vendor.id}>{vendor.name}</NavLink>
      ))}
    </div>
  );
};

export default Vendors;
