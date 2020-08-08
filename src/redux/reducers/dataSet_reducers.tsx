import { DataSetActions, UPDATE_DATASET } from "../actions/actionTypes";


const initialState: any | null = null;

const dataSet_reducers = (state = initialState, action: DataSetActions) => {
    switch (action.type) {
        case UPDATE_DATASET: {
            return {
                // @ts-ignore
                ...action.dataSet
            };
            return action.dataSet
        }
        default: {
            return state;
        }
    }
};

export default dataSet_reducers;
