// src/pages/PaymentSuccess.jsx
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import '~/styles/PaymentSuccess.css';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="payment-success-container">
            <div className="payment-success-wrapper">
                <div className="payment-success-icon-wrapper">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/753/753318.png"
                        alt="Payment Success"
                        className="payment-success-icon"
                    />
                </div>
                <h1 className="payment-success-title">Payment Successful</h1>
                <p className="payment-success-message">
                    Thank you! Your payment has been processed successfully.
                </p>
                <Button type='danger' className="payment-success-button" onClick={() => navigate('/app/io-requests')}>
                    Back To IO Request List
                </Button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
