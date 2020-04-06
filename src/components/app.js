import React, {useEffect, useState} from 'react';

import {initUrls} from '../common/constants';
import ApiClient from "../services/ApiClient";

import './app.css';

function App() {
    const [currencyValue, setCurrencyValue] = useState(null);
    const [error, setError] = useState(false);
    const [urls, setUrls] = useState(initUrls);
    const [newUrl, setNewUrl] = useState('');

    function promiseAny(urls, asyncFn) {
        return new Promise(function(resolve, reject) {
            urls.length === 0
                ? reject()
                : asyncFn(urls[0])
                    .then(function(val) {
                        resolve(val);
                    })
                    .catch(function() {
                        urls.shift();
                        promiseAny(urls, asyncFn).then(resolve).catch(reject);
                    });
        });
    }

    function commonPromise(val) {
        return new Promise(function(resolve, reject) {
            ApiClient.get(val)
                .then(res => resolve(res))
                .catch(() => reject())
        });
    }

    const getCurrencyValue = () => {
        promiseAny(urls, commonPromise)
            .then((val) => {
                setError(false);
                if (val.data && val.data.Valute && currencyValue !== val.data.Valute.EUR.Value) {
                    setCurrencyValue(val.data.Valute.EUR.Value)
                }
            })
            .catch(() => {
                setError(true)
            });
    };

    const getDataWithTimeOut = () => {
        setTimeout(function run() {
            getCurrencyValue();
            setTimeout(run, 10000);
        }, 0);
    };

    const addNewUrl = () => {
        setUrls([...urls, newUrl]);
        setNewUrl('');
    };

    const deleteUrl = (url) => {
        setUrls(urls.filter(i => i !== url));
    };

    useEffect(() => getDataWithTimeOut(), []);

    return (
        <div className="app">
            <h1 className="currency">1 Euro = {currencyValue} rub</h1>

            {urls.map((i, index) => {
                return (
                    <div key={index} className="url-item">
                        {i}
                        <div className="delete-button" onClick={() => deleteUrl(i)}>X</div>
                    </div>
                )
            })}

            <div className="url-form">
                <input
                    type="text"
                    value={newUrl}
                    className="input"
                    placeholder="Add new url"
                    onChange={e => setNewUrl(e.target.value)}
                />

                {newUrl &&
                    <button onClick={() => addNewUrl()}>
                        Add
                    </button>
                }
            </div>

            {error && <h2>ERROR</h2>}
        </div>
    )
}

export default App;
