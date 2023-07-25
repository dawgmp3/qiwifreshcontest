import './App.css';
import React, {useEffect, useState} from "react";
import select from 'react-select'

function App() {
  const date = new Date();
  const currentDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const previousDate = `${date.getDate() - 1}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const [currency, setCurrency] = useState({})
  const [currencyArray, setCurrencyArray] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCurrencyValue, setSelectedCurrencyValue] = useState('');

  const fetchCurrency = () => {
    fetch("https://www.cbr-xml-daily.ru/daily_json.js")
        .then(response => {
          return response.json()
        })
        .then(data => {
          setCurrency(data)
        })
  }

  const getCurrencyArray = () => {
    const curArray = [];
    for(let i in currency.Valute){
      const { ID, CharCode, Value, Name, Previous } = currency.Valute[i]
      curArray.push({
        value: Value,
        code: CharCode,
        id: ID,
        name: Name,
        label: CharCode,
        previous: Previous, })
    }
    setCurrencyArray(curArray);
  }

  const handleCurrencyChange = (e) => {
    const selectedValue = e.target.value;
    setQuery(selectedValue);
    const currencyValue = getCurrencyValue(selectedValue);
    setSelectedCurrencyValue(currencyValue);
  };

  function getCurrencyValue(value){
    const parseId = value.match(/(\w+)/)[1]
    for (let cur of currencyArray) {
      if (cur.id === parseId)
        return cur;
    }
    return 'no found';
  }

  useEffect(() => {
    fetchCurrency()
  }, [])

  useEffect(() => {
    getCurrencyArray();
  }, [currency])

  return (
      <div className="App">
        <h1>Курс валюты</h1>
        <select
            onChange={e => handleCurrencyChange(e)}
            value={query}>
          {currencyArray.map(curr => (
              <option>{curr.id} - {curr.name}</option>
          ))}
        </select>
        <div className="card">
          <div className="container">
            <p>{selectedCurrencyValue.id} - {selectedCurrencyValue.name} ({selectedCurrencyValue.code})</p>
            <p>{currentDate} - {selectedCurrencyValue.value}</p>
            <p>{previousDate} - {selectedCurrencyValue.previous}</p>
          </div>
        </div>
      </div>
  );
}
export default App;
