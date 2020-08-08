export const UPDATE_STATS_FOR_MAP = "UPDATE_STATS_FOR_MAP";

export type UpdateStatsForMap = {
    type: typeof UPDATE_STATS_FOR_MAP,
    statsForMap: string
}

export type StatsForMapActions =
    UpdateStatsForMap;

export const UPDATE_DATASET = "UPDATE_DATASET";

export type UpdateDataSet = {
    type: typeof UPDATE_DATASET,
    dataSet: string
}

export type DataSetActions =
    UpdateDataSet;