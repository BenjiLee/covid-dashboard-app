import { DataSetActions, StatsForMapActions, UPDATE_DATASET, UPDATE_STATS_FOR_MAP } from "./actionTypes";
import { fetchJSON } from "../../utils/fetch";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";


export function setDataSet(payload: string): DataSetActions {
    return {
        type: UPDATE_DATASET,
        dataSet: payload
    };
}

export function fetchDataSet(geoid: string): ThunkAction<Promise<void>, {}, {}, DataSetActions> {
    return async (dispatch: Dispatch<DataSetActions>) => {
        try {
            const response = await fetchJSON(geoid);
            dispatch(setDataSet(response));
        } catch (e) {
            console.log(`fetchDataSet(): error when fetching for geoid=${geoid} message=${e.message}`)
        }
    };

}