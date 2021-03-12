import react, {useState, useEffect} from "react";

function Converter(props){

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
                temporary[row].rates[index] = [
                        key,
                        data.rates[key],
                        rates[index][2]
                    ];
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


    useEffect(() => {
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
    }, []);
    
    return (
        <>
            {
                loading? "...loading" : 

                (errMsg === "")?
                <>
                    {
                        converterData.map((data, index) => {
                            return (
                                <div key={index}>
                                    <select onChange={e => handleCurrencyChange(e, index)}>
                                        {
                                            options.map((currency, idx) => {
                                                if(currency === data.base){
                                                    return <option key={idx} selected value={currency}>{currency}</option>
                                                }
                                                return <option key={idx} value={currency}>{currency}</option>
                                            })
                                        }
                                    </select>
                                    {" "} 1 = 
                                    {   
                                        data.rates.map((rate, rateIndex) => {
                                            return (rate[2] === true)?
                                            <span key={rateIndex}>
                                                <select defaultValue={rate[0]} onChange={e => handleCurrencyChange(e, index)}>
                                                {
                                                    options.map((currency, idx) => {
                                                    
                                                        return (currency === rate[0])? <option key={idx} selected value={currency}>{currency}</option> : <option key={idx} value={currency}>{currency}</option> 
                                                        
                                                    })
                                                }
                                                </select>{" "}{rate[1]}
                                                {
                                                    !(rateIndex === 0)? <button onClick={() => removeCurrency(index, rateIndex)}>x</button> : null
                                                }
                                                {"   |   "} 
                                            </span> : null
                                        })
                                    }
                                    {
                                        (data.rates.filter(rate => rate[2] === true).length === data.rates.length)? null : <button onClick={() => addCurrency(index)} id={index}>+</button>
                                    }
                                    {
                                        !(index === 0)? <button onClick={() => removeRow(index)}>remove row</button> : null
                                    }
                                </div>
                            )
                        })
                    }
                    <button onClick={addTemplate}>+</button>    
                </> : errMsg
            }
        </>
    );

}


export default Converter;