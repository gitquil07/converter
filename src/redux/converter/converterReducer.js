import {createNewTemplateFrom} from "../../utils";

const initialState = {
    loading: true,
    converterTemplate: undefined,
    converterData: [],
    options: [],
    errMsg: ""
};

const converterReducer = (state = initialState, action) => {
    switch(action.type){
        case "FETCH_DATA":
            return {...state, loading: true}
        case "FETCH_DATA_SUCCESS":
            return {
                    ...state,
                    loading: false,
                    converterTemplate: action.payload.converterTemplate,
                    converterData: action.payload.converterData,
                    options: action.payload.options
                }
        case "FETCH_DATA_ERROR":
            return {
                ...state,
                loading: false,
                errMsg: action.payload
            }
        case "UPDATE_SUCCESS":
            return {
                ...state,
                loading: false,
                converterData: action.payload
            }
        case "UPDATE_ERROR":
            return {
                ...state,
                loading: false,
                errMsg: action.payload
            }
        case "SET_DATA_FROM_CACHE":
            return {
                ...state,
                loading: false,
                converterTemplate: action.payload.converterTemplate,
                converterData: action.payload.converterData,
                options: action.payload.options
            }
        case "ADD_CURRENCY":

            const addCurrencyTemp = state.converterData.slice(),
                  converterIndex = action.payload,
                  ratesLength = addCurrencyTemp[converterIndex].rates.length;
        
            let i = 0;
            while(addCurrencyTemp[converterIndex].rates[i][2] !== false && i <= ratesLength){
                    i++;
            }
            
            addCurrencyTemp[converterIndex].rates[i][2] = true;

            return {
                ...state,
                converterData: addCurrencyTemp
            }

        case "ADD_CONVERTER":

            const newTemplate = createNewTemplateFrom(state.converterTemplate);

            return {
                ...state,
                converterData: [
                    ...state.converterData,
                    newTemplate
                ]
            }

        case "REMOVE_CURRENCY":

            
            const removeCurrencyTemp = state.converterData.slice();

            removeCurrencyTemp[action.payload.converterIndex].rates[action.payload.currencyIndex][2] = false;

            return {
                ...state,
                converterData: removeCurrencyTemp
            }

        case "REMOVE_CONVERTER":

            const removeConverterTemp = state.converterData.slice();

            removeConverterTemp.splice(action.payload, 1);

            return {
                ...state,
                converterData: removeConverterTemp
            }
      
        default:
            return state;
    }
}

export default converterReducer;