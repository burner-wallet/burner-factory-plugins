import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: inline-flex;
  padding: 4px;
`;

const ButtonContainer = styled.div`
  width: 30px;
`;

const Button = styled.button`
  border-radius: 100px;
  height: 30px;
  width: 30px;
  background: gray;
  outline: none;
  font-size: 18px;
  color: #cccccc;
  font-weight: bold;
`;

const Value = styled.div`
  font-size: 24px;
  width: 30px;
  text-align: center;
`;

interface StepperProps {
  value: number;
  onChange: (newVal: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ value, onChange }) => {
  return (
    <Container>
      <ButtonContainer>
        {value > 0 && (
          <Button onClick={() => onChange(value - 1)}>-</Button>
        )}
      </ButtonContainer>
      <Value>{value}</Value>
      <ButtonContainer>
        <Button onClick={() => onChange(value + 1)}>+</Button>
      </ButtonContainer>
    </Container>
  );
};

export default Stepper;
