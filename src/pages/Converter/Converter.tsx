import React, { useEffect } from 'react';

import Layout from '../../components/Layout/Layout';
import { API } from '../../services/api';

function Converter() {
  useEffect(() => {
    const fetchCurrencies = async () => {
      const result = await API.getLatest();
      console.log(result);
    };
    fetchCurrencies();
  }, []);
  return (
    <Layout>
      <div className="box">
        <h1>Currency Converter</h1>
      </div>
    </Layout>
  );
}

export default Converter;
