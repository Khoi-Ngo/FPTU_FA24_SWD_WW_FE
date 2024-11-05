import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import '~/styles/PaymentFailure.css';

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="payment-failure-container">
            <div className="payment-failure-wrapper">
                <div className="payment-failure-icon-wrapper">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/753/753345.png"
                        alt="Payment Failed"
                        className="payment-failure-icon"
                    />
                </div>
                <h1 className="payment-failure-title">Payment Failed</h1>
                <p className="payment-failure-message">
                    Sorry, your payment was unsuccessful. Please try again or check your information.
                </p>
                <Button type='danger' className="payment-failure-button" onClick={() => navigate('/app/io-requests')}>
                    Back To IO Request List
                </Button>
            </div>
        </div>
    );
};

export default PaymentFailure;
