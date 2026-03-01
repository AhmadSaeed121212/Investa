import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import './DepositQR.css';

const DepositQR = () => {
  const [searchParams] = useSearchParams();
  const method = searchParams.get('method');
  const amount = searchParams.get('amount');

  return (
    <Layout title="Deposit QR Code">
      <div className="dashboard-card text-center">
        <h5 className="text-white mb-4">Complete Your Deposit</h5>
        <p className="text-gray mb-3">Payment Method: {method}</p>
        <p className="text-white mb-4">Amount: ${amount}</p>
        <div className="qr-placeholder mb-4">
          <i className="fas fa-qrcode fa-5x text-gray"></i>
          <p className="text-gray mt-3">QR Code will be displayed here</p>
        </div>
        <p className="text-gray small">Scan the QR code to complete your payment</p>
      </div>
    </Layout>
  );
};

export default DepositQR;
