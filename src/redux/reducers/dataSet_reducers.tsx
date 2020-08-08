import { DataSetActions, UPDATE_DATASET } from "../actions/actionTypes";


const initialState: string | null = null;

const dataSet_reducers = (state = initialState, action: DataSetActions) => {
    switch (action.type) {
        case UPDATE_DATASET: {
            return action.dataSet;
        }
        default: {
            return state;
        }
    }
};

export default dataSet_reducers;
