import logo from './logo.svg';
import './App.css';
import Converter from "./converter";
import ConverterRedux from "./converterWithRedux";

import {Provider} from "react-redux";
import store from "./redux";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        {/* <Converter /> */}
        <ConverterRedux />
      </Provider>
    </div>
  );
}

export default App;
