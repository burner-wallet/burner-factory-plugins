import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 12px;

  border: 1px solid transparent;
  border-color: #eee;
  border-radius: 8px;
  box-shadow: 0px 8px 16px rgba(0,0,0,0.1);
  height: 100px;
  width: 120px;
  padding: 8px;
  box-sizing: border-box;
`;

const Img = styled.div`
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  flex: 1;
  margin-bottom: 4px;
`;

const Title = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`;

interface CardProps {
  image?: string;
  name: string;
  onClick: (e: React.MouseEvent) => void;
}

const Card: React.FC<CardProps> = ({ image, name, onClick }) => (
  <Container onClick={onClick}>
    <Img style={{ backgroundImage: image && `url(${image})` }} />
    <Title>{name}</Title>
  </Container>
);

export default Card;
