import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Vendor } from '../menuType';

const Container = styled.div`
  margin: 4px 0;
  padding: 4px 0;
  border-bottom: solid 1px #bbbbbb;
`;

const Link = styled(NavLink)`
  display: inline-block;
  border-radius: 100px;
  border: solid 1px #aaaaaa;
  padding: 4px 8px;
  margin: 2px;
  text-decoration: none;

  &.active {
    color: #eeeeee;
    background: #aaaaaa;
  }
`;

interface VendorsProps {
  vendors: Vendor[];
}

const Vendors: React.FC<VendorsProps> = ({ vendors }) => {
  return (
    <Container>
      {vendors.map((vendor: Vendor) => (
        <Link to={`/menu/${vendor.id}`} key={vendor.id}>{vendor.name}</Link>
      ))}
    </Container>
  );
};

export default Vendors;
