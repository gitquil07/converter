import react, {useEffect} from "react";
import {connect} from "react-redux";
import st from "./converter.module.css";
import ConverterItem from "./converterItem/ConverterItem";
import {
    addCurrency,
    addConverter,
    removeCurrency,
    removeConverter,
    currencyChange,
    getInitialData,
    setDataFromCache
} from "../redux/converter";


function Converter(props){

    // Destructure states
    const {
            loading,
            converterData,
            converterTemplate,
            options,
            errMsg
        } = props;
    
    // Destructure functions
    const {
        addCurrency,
        addConverter,
        removeCurrency,
        removeConverter,
        setDataFromCache,
        handleCurrencyChange,
        getInitialData
    } = props;


    useEffect(() => {
       
        const converterDataJson = localStorage.getItem("converterData"),
              templateJson = localStorage.getItem("template");

        let resData = [],
            resTemplate = [];
        if(converterDataJson !== null && templateJson !== null){
            resData = JSON.parse(converterDataJson);
            resTemplate = JSON.parse(templateJson);
        }
        
        if(resData.length !== 0 && resTemplate.length !== 0){
            setDataFromCache({
                converterData: resData,
                converterTemplate: resTemplate,
                options: [resTemplate.base, ...resTemplate.rates.map(rate => rate[0])],
                loading: false
            });
        }else{
            getInitialData();
        }
    }, []);

    useEffect(() => {
        
        if(converterData.length !== 0){

            const json = JSON.stringify(converterData);
    
            localStorage.setItem("converterData", json);

        }

    }, [converterData]);

    useEffect(() => {
        if(converterTemplate !== undefined){
            const json = JSON.stringify(converterTemplate);

            localStorage.setItem("template", json);
        }
    }, [converterTemplate]);


    return (
        <>
            {
                loading? <div className={st.loading}>loading</div> : 

                (errMsg === "")?
                <>
                    <p className={st.bold}>
                        <span className={st.offset}>From</span>
                        <span>To</span>
                    </p>
                    {
                        converterData.map((data, index) => {
                            return (
                                <div key={index} className={st["item-row"]}>
                                  
                                    <ConverterItem 
                                        rateIndex={0}
                                        base={data.base}
                                        value={1}
                                        rowIndex={index}
                                        handleCurrencyChange={handleCurrencyChange}
                                        options={options}
                                    />
                                    <div className={st.equality}></div>
                                    {   
                                        data.rates.map((rate, rateIndex) => {
                                            return (rate[2] === true)?
                                            <ConverterItem 
                                                rateIndex={rateIndex}
                                                base={rate[0]}
                                                value={rate[1]}
                                                rowIndex={index}
                                                handleCurrencyChange={handleCurrencyChange}
                                                options={options}
                                                removeCurrency={removeCurrency}
                                            /> : null
                                        })
                                    }
                                    {
                                        (data.rates.filter(rate => rate[2] === true).length === data.rates.length)? null : <button className={`${st.btn} ${st.addBtn}`} onClick={() => addCurrency(index)} id={index}></button>
                                    }
                                    {
                                        !(index === 0)? <button className={`${st.btn} ${st.removeRow}`} onClick={() => removeConverter(index)}></button> : null
                                    }
                                </div>
                            )
                        })
                    }
                    <button className={`${st.btn} ${st.addBtn}`} onClick={addConverter}></button>    
                </> : errMsg
            }
        </>
    );

}

const mapStateToProps = state => {
    return {
        loading: state.loading,
        converterData: state.converterData,
        converterTemplate: state.converterTemplate,
        options: state.options,
        errMsg: state.errMsg
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addCurrency : converterIndex => dispatch(addCurrency(converterIndex)),
        addConverter: () => dispatch(addConverter()),
        removeCurrency: (converterIndex, currencyIndex) => dispatch(removeCurrency({converterIndex, currencyIndex})),
        removeConverter: converterIndex => dispatch(removeConverter(converterIndex)),
        setDataFromCache: data => dispatch(setDataFromCache(data)),
        handleCurrencyChange: (currency, converterIndex) => dispatch(currencyChange(currency, converterIndex)),
        getInitialData: () => dispatch(getInitialData())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Converter);