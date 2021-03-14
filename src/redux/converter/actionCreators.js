import { createNewTemplateFrom } from "../../utils";
import {
    ADD_CURRENCY,
    ADD_CONVERTER,
    REMOVE_CURRENCY,
    REMOVE_CONVERTER, 
    FETCH_DATA,
    FETCH_DATA_SUCCESS,
    FETCH_DATA_ERROR,
    UPDATE_SUCCESS,
    UPDATE_ERROR,
    SET_DATA_FROM_CACHE
} from "./actionTypes";


function fetchData(){
    return {
        type: FETCH_DATA
    }
}

function fetchDataSuccess(data){
    return {
        type: FETCH_DATA_SUCCESS,
        payload: data
    }
}

function fetchDataError(data){
    return {
        type: FETCH_DATA_ERROR,
        payload: data
    }
}

function updateSuccess(data){
    return {
        type: UPDATE_SUCCESS,
        payload: data
    }
}

function updateError(data){
    return {
        type: UPDATE_ERROR,
        payload: data
    }
}

function setDataFromCache(data){
    return {
        type: SET_DATA_FROM_CACHE,
        payload: data
    }
}

function addCurrency(converterIndex){
    // return action
    return {
        type: ADD_CURRENCY,
        payload: converterIndex
    }
}

function addConverter(){
    return {
        type: ADD_CONVERTER
    }
}


function removeCurrency(params){
    return {
        type: REMOVE_CURRENCY,
        payload:params
    }
}

function removeConverter(converterIndex){
    return {
        type: REMOVE_CONVERTER,
        payload: converterIndex
    }
}

function currencyChange(currency, converterIndex){
    return function(dispatch, getState){
        // setLoading(true);
        dispatch(fetchData());
        fetch(`https://api.exchangeratesapi.io/latest?base=${currency}`)
        .then(response => response.json())
        .then(data => {
            const stateBefore = getState();
            const temporary = stateBefore.converterData.slice();
            console.log("data", data);
            temporary[converterIndex].base = data.base;
            const rates = temporary[converterIndex].rates.slice();
            
            const currencyList = Object.keys(data.rates);
            currencyList.forEach((key, index) => {
                if(!temporary[converterIndex].rates[index]){
                    temporary[converterIndex].rates.push([
                        key,
                        data.rates[key],
                        rates[rates.length-1][2]
                    ]);
                }else{
                    temporary[converterIndex].rates[index] = [
                        key,
                        data.rates[key],
                        rates[index][2]
                    ];
                }
            })

            dispatch(updateSuccess(temporary))
            // setConverterData(temporary);
        })
        .catch(error => {
            dispatch(updateError("something ent wrong"));
            // setErrMsg("Something went wrong");
        })
        // .finally(() => setLoading(false));
    }
}


function getInitialData(){
    return function(dispatch){
        fetch("https://api.exchangeratesapi.io/latest?base=EUR")
            .then(response => response.json())
            .then(data => {

                // setOptions([data.base, ...Object.keys(data.rates)]);
                const currencyList = Object.keys(data.rates),
                        rates = currencyList.map((key, index) => {
                            return [
                                key,
                                data.rates[key],
                                (index === 0)? true : false
                            ]
                        });

                

                const template = 
                    {
                        base: "EUR",
                        rates: [
                            ...rates
                        ]
                    };  
                
                    
                const payload = {
                    converterTemplate: template,
                    converterData: [createNewTemplateFrom(template)],
                    options: [data.base, ...Object.keys(data.rates)]
                }


                dispatch(fetchDataSuccess(payload))

                // setConverterTemplate(template);
                // setConverterData([createNewTemplateFrom(template)]);
            })
            .catch(error => {
                dispatch(fetchDataError("something went wrong"));
                // setErrMsg("something went wrong");
            })
            // .finally(() => {
            //     setLoading(false)
            // });
    }
}

export {
    addCurrency,
    addConverter,
    removeCurrency,
    removeConverter,
    currencyChange,
    fetchData,
    fetchDataSuccess,
    fetchDataError,
    updateSuccess,
    updateError,
    getInitialData,
    setDataFromCache
};