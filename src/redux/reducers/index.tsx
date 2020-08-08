import { combineReducers } from "redux";
import statsForMap_reducers from "./statsForMap_reducers";
import dataSet_reducers from "./dataSet_reducers";

// This is the collection of all redux reducers to be used
export default combineReducers({
    statsForMap_reducers,
    dataSet_reducers
});
