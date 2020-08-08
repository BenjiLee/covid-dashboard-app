import { DataSetActions, StatsForMapActions, UPDATE_DATASET, UPDATE_STATS_FOR_MAP } from "./actionTypes";
import { fetchJSON } from "../../utils/fetch";
import { Dispatch } from "redux";


export function setDataSet(payload: string): DataSetActions {
    return {
        type: UPDATE_DATASET,
        dataSet: payload
    };
}

export function fetchDataSet(geoid: string) {
    return async (dispatch: Dispatch<DataSetActions>) => {
        try {
            console.log(`fetchDataSet(): attempting to fetch for geoid=${geoid}`);
            const response = await fetchJSON(geoid);
            dispatch(setDataSet(response))
        } catch (e) {
            console.log(`fetchDataSet(): error when fetching. message=${e.message}`)
        }
    };

}