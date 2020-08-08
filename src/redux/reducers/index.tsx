import { combineReducers } from "redux";
import statsForMap from "./statsForMap_reducers";
import dataSet from "./dataSet_reducers";

// This is the collection of all redux reducers to be used
export default combineReducers({
    statsForMap,
    dataSet
});
