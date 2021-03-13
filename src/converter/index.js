import react, {useState, useEffect} from "react";
import ConverterItem from "./ConverterItem";
import st from "./converter.module.css";

function Converter(){

    const [loading, setLoading] = useState(true),
          [converterTemplate, setConverterTemplate] = useState(undefined),
          [converterData, setConverterData] = useState([]),
          [options, setOptions] = useState([]),
          [errMsg, setErrMsg] = useState("");


    // Util function create new template from base template to avoid
    // object same object referencing
    function createNewTemplateFrom(base){
        const newTemplate = {...base};
        const rates = base.rates.map(rate => [...rate]);

        newTemplate.rates = rates;

        return newTemplate;
    }


    // Get new rates on currency change
    function convert(row, currency){
        setLoading(true);
        fetch(`https://api.exchangeratesapi.io/latest?base=${currency}`)
        .then(response => response.json())
        .then(data => {
            const temporary = converterData.slice();
            temporary[row].base = data.base;
            const rates = temporary[row].rates.slice();
            
            const currencyList = Object.keys(data.rates);
            currencyList.forEach((key, index) => {
                if(!temporary[row].rates[index]){
                    temporary[row].rates.push([
                        key,
                        data.rates[key],
                        rates[rates.length-1][2]
                    ]);
                }else{
                    temporary[row].rates[index] = [
                        key,
                        data.rates[key],
                        rates[index][2]
                    ];
                }
            })


            setConverterData(temporary);
        })
        .catch(error => {
            setErrMsg("Something went wrong");
        })
        .finally(() => setLoading(false));
    }


    // Define function to add new template (row)
    const addTemplate = () => {
        // Adding template

        const newTemplate = createNewTemplateFrom(converterTemplate);
        setConverterData([
            ...converterData,

            newTemplate
        ]);
    }

    // Define function to add new currency (column)
    const addCurrency = (templateIndex) => {
        const temporary = converterData.slice(),
              ratesLength = temporary[templateIndex].rates.length;

              temporary[templateIndex].sad = "AS";
            

        let i = 0;
        while(temporary[templateIndex].rates[i][2] !== false && i <= ratesLength){
                i++;
        }
        
        temporary[templateIndex].rates[i][2] = true;


        setConverterData(temporary);
    }


    // Remove currency
    const removeCurrency = (rowIndex, currencyIndex) => {
        const temporary = converterData.slice();

        temporary[rowIndex].rates[currencyIndex][2] = false;

        setConverterData(
            temporary
        );
    }

    // Remove row
    const removeRow = (rowIndex) => {
        const temporary = converterData.slice();

        temporary.splice(rowIndex, 1);

        setConverterData(temporary);
    }

    // Replace base currency and make request to get new conversion results
    const handleCurrencyChange = (e, row) => {
        const selectedBase = e.target.value;

        convert(row, selectedBase);
    } 
    
    
     // Whenever converterData changes update localStorage data
    // useEffect will help detect changes
    useEffect(() => {
        // Convert data from array to json string in first
        // case we get not valid data
        if(converterData.length !== 0){

            const json = JSON.stringify(converterData);
    
            localStorage.setItem("converterData", json);

        }

    }, [converterData]);

    // Whenever template changes update localStorage data
    useEffect(() => {
        if(converterTemplate !== undefined){
            const json = JSON.stringify(converterTemplate);

            localStorage.setItem("template", json);
        }
    }, [converterTemplate]);



    useEffect(() => {
        // Check local storage for convertedData, if exists take this data
        // if not make request to get data
        const converterDataJson = localStorage.getItem("converterData"),
              templateJson = localStorage.getItem("template");

        // try to Convert result from json string to object
        let resData = [],
            resTemplate = [];
        if(converterDataJson !== null && templateJson !== null){
            resData = JSON.parse(converterDataJson);
            resTemplate = JSON.parse(templateJson);
        }
        
        if(resData.length !== 0 && resTemplate.length !== 0){
            setConverterData(resData);
            setConverterTemplate(resTemplate);
            setOptions([resTemplate.base, ...resTemplate.rates.map(rate => rate[0])]);
            setLoading(false);
        }else{

            fetch("https://api.exchangeratesapi.io/latest?base=EUR")
                .then(response => response.json())
                .then(data => {
    
                    setOptions([data.base, ...Object.keys(data.rates)]);
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
    
                    setConverterTemplate(template);
                    setConverterData([createNewTemplateFrom(template)]);
                })
                .catch(error => {
                    setErrMsg("something went wrong");
                })
                .finally(() => setLoading(false));
        }
    }, []);
    
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
                                        !(index === 0)? <button className={`${st.btn} ${st.removeRow}`} onClick={() => removeRow(index)}></button> : null
                                    }
                                </div>
                            )
                        })
                    }
                    <button className={`${st.btn} ${st.addBtn}`} onClick={addTemplate}></button>    
                </> : errMsg
            }
        </>
    );

}


export default Converter;