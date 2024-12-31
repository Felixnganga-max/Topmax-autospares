import React from 'react';
import styled from 'styled-components';

// Styled components for the receipt
const ReceiptWrapper = styled.div`
  width: 350px;
  padding: 20px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
`;

const ShopName = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0;
  font-weight: bold;
  letter-spacing: 2px;
`;

const Line = styled.hr`
  border: 0;
  border-top: 2px solid #ff2929;
  margin: 15px 0;
`;

const ProductList = styled.div`
  margin-bottom: 20px;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const ProductName = styled.span`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

const ProductPrice = styled.span`
  font-size: 16px;
  color: #ff2929;
  font-weight: bold;
`;

const TotalSection = styled.div`
  margin-top: 20px;
  border-top: 2px solid #f0f0f0;
  padding-top: 15px;
`;

const TotalText = styled.h3`
  font-size: 18px;
  text-align: right;
  color: #333;
  margin: 0;
`;

const ThankYouMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
  color: #555;
`;

const HighlightText = styled.span`
  color: #ff2929;
  font-weight: bold;
`;

const Receipt = ({ saleData }) => {
  const { products, totalAmount } = saleData;

  return (
    <ReceiptWrapper>
      <Header>
        <Logo src="https://via.placeholder.com/80" alt="Logo" />
        <ShopName>Perfect Mechanic</ShopName>
        <Line />
      </Header>

      <ProductList>
        {products.map((item) => (
          <ProductItem key={item.product}>
            <ProductName>{item.name}</ProductName>
            <ProductPrice>
              KSh {item.price * item.quantity}
            </ProductPrice>
          </ProductItem>
        ))}
      </ProductList>

      <TotalSection>
        <TotalText>
          <HighlightText>Subtotal: </HighlightText> KSh {totalAmount}
        </TotalText>
      </TotalSection>

      <ThankYouMessage>
        <p>Thank you for shopping with us!</p>
      </ThankYouMessage>
    </ReceiptWrapper>
  );
};

export default Receipt;
