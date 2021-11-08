import {useEffect, useState, useCallback} from 'react';
import { Table, Input } from "antd";
import 'antd/dist/antd.css';
import { getTransfers } from '../api/api';
import { userColumns } from "../modules/columnData";


const { Search } = Input;

const filterData = (data) => {
  const formattedData = {};
  const updatedArray = [];
  data.forEach(data => {
    if (!formattedData[data.EVENT_CURRENCY]) {
      formattedData[data.EVENT_CURRENCY] = {};
      formattedData[data.EVENT_CURRENCY].name = data.EVENT_CURRENCY;
      formattedData[data.EVENT_CURRENCY].totalAmount = data.EVENT_AMOUNT
      formattedData[data.EVENT_CURRENCY].transactions = [];
      formattedData[data.EVENT_CURRENCY].amounts = [];
      updatedArray.push(formattedData[data.EVENT_CURRENCY]);
    } else {
      formattedData[data.EVENT_CURRENCY].totalAmount += data.EVENT_AMOUNT;
    }
    formattedData[data.EVENT_CURRENCY].transactions.push({
      amount: data.EVENT_AMOUNT,
      timestamp: data.BLOCK_TIMESTAMP
    });
  });
  return updatedArray;
};

const bubbleSort = (obj) => {
  const inputArr = obj.transactions;
  let len = inputArr.length;
  for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
          if (inputArr[j + 1] && new Date(inputArr[j].timestamp) > new Date(inputArr[j + 1].timestamp)) {
              let tmp = inputArr[j];
              inputArr[j] = inputArr[j + 1];
              obj.amounts[j] = inputArr[j + 1].amount; 
              inputArr[j + 1] = tmp;
              obj.amounts[j + 1] = tmp.amount;
          }
      }
  }
  return inputArr;
};

const ExampleJSPage = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [origData, setOrigData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const filterTransactions = (data) => {
      data.forEach((obj) => {
        // obj.transactions.sort((a, b) => {
        //   const comparison = new Date(a.timestamp) - new Date(b.timestamp);
        //   return comparison
        // });
        // obj.transactions.forEach((transactionObj)=> {
        //   obj.amounts.push(transactionObj.amount);
        // })
        bubbleSort(obj);
      })
    }
    const fetchData = async () => {
      const {data} = await getTransfers();
      const updatedData = filterData(data);
      filterTransactions(updatedData);

      setOrigData(updatedData);
      setFilteredData(updatedData);
      if (updatedData) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const searchChange = useCallback((value) => {
    if (value) {
      const searchFilter = origData.filter((obj) => {
        if (obj.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          return true;
        }
        return null;
      });
      setFilteredData(searchFilter);
    } else {
      setFilteredData(origData);
    }
  }, [origData]);



  return (
    <div className="container">
      <h1>Terra - Totals by Currency</h1>
      <Search
        onChange={(e) => searchChange(e.target.value)}
        placeholder=""
        enterButton="Search"
        style={{
          width: "200px",
          marginTop: "2vh",
          marginBottom: "2vh"
        }}
        size="large"
      />
      <Table
        rowKey="name"
        dataSource={filteredData}
        columns={userColumns}
        loading={loading}
        pagination={false}
      />
    </div>
  );
}

export default ExampleJSPage;
