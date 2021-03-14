import react from "react";
import st from "./converterItem.module.css";

function ConverterItem(props){
    const {
        rateIndex,
        base,
        value,
        rowIndex,
        handleCurrencyChange,
        options,
        removeCurrency
    } = props;


    return (
        <span className={st["item-container"]}>
            <select className={st.currencyList} onChange={e => handleCurrencyChange(e.target.value, rowIndex)}>
                {
                    options.map((currency, idx) => {
                        return (currency === base)? <option key={idx} selected value={currency}>{currency}</option> : <option key={idx} value={currency}>{currency}</option>
                    })
                }
            </select>
            <span className={st.bold}>
                {value}
            </span>
            {
                !(rateIndex === 0)? <button className={st.removeBtn} onClick={() => removeCurrency(rowIndex, rateIndex)}>x</button> : null
            }
        </span>
    );
}

export default ConverterItem;