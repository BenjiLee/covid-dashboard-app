import React, { Component } from 'react'
import Graph from './Graph/Graph';
import Brush from './Filters/Brush';
import ThresholdLabel from './Graph/ThresholdLabel';
import Legend from './Graph/Legend';
import Buttons from './Filters/Buttons';
import Scenarios from './Filters/Scenarios';
import Severity from './Filters/Severity';
import Sliders from './Filters/Sliders';
// import Overlays from './Filters/Overlays';
import { getRange } from '../utils/utils'
import { utcParse } from 'd3-time-format'
import { max } from 'd3-array';
const dataset = require('../store/geo06085.json');

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: {},
            dataLoaded: false,
            series: {},
            dates: [],
            yAxisLabel: '',
            stat: {
                'id': 1,
                'name': 'Infections',
                'key': 'incidI'
            },
            geoid: '06085',
            scenario: {
                'id': 1,
                'key': 'USA_Uncontrolled',
                'name': 'USA_Uncontrolled'
            },
            severity: {
                'id': 1,
                'key': 'high',
                'name': '1% IFR, 10% hospitalization rate'}, 
            statThreshold: 0,
            seriesMax: Number.NEGATIVE_INFINITY,
            seriesMin: Number.POSITIVE_INFINITY,
            dateThreshold: '2020-05-04',
            dateRange: ['2020-03-01', '2020-07-01'],
            firstDate: '',
            lastDate: '',
            r0: '1',
            simNum: '150',
            percExceedence: 0,
            showConfBounds: false,
            showActual: false,
            graphW: 0,
            graphH: 0,
        };
    };

    async componentDidMount() {
        console.log('componentDidMount')
        const { scenario, severity, geoid, stat } = this.state;
        const initialData = dataset[scenario.key][severity.key];
        const series = initialData.series[stat.key];
        const parseDate = utcParse("%Y-%m-%d");
        const dates = initialData.dates.map( d => parseDate(d));
        const firstDate = dates[0].toISOString().split('T')[0];
        const lastDate = dates[dates.length - 1].toISOString().split('T')[0];

        const [seriesMin, seriesMax] = getRange(series);
        const statThreshold = Math.ceil((seriesMax / 1.2) / 100) * 100;
        const dateThreshold = "2020-05-04";

        // mutates series
        const simsOver = this.updateThreshold(
            series,
            statThreshold,
            dates,
            dateThreshold
            )        
        const percExceedence = simsOver / series.length;
        
        const yAxisLabel = `Number of ${stat.name} per Day`;
        const graphW = this.graphEl.clientWidth;
        const graphH = this.graphEl.clientHeight;

        this.setState({
            dataset,
            dates,
            series,
            seriesMax,
            seriesMin,
            statThreshold,
            yAxisLabel,
            firstDate,
            lastDate,
            percExceedence,
            graphW,
            graphH
        }, () => {
            this.setState({
                dataLoaded: true
            });
        })
    };

    componentDidUpdate(prevProp, prevState) {
        if (this.state.stat !== prevState.stat ||
            this.state.scenario !== prevState.scenario ||
            this.state.severity !== prevState.severity) {

            const { dataset, stat, scenario, severity } = this.state;
            const newSeries = Array.from(
                dataset[scenario.key][severity.key].series[stat.key]
                );
            const [seriesMin, seriesMax] = getRange(newSeries);
            const statThreshold = Math.ceil(seriesMax / 1.2);
            const dateThreshold = "2020-05-04";

            // mutates series
            const simsOver = this.updateThreshold(
                newSeries,
                statThreshold,
                this.state.dates,
                dateThreshold
                )
            const percExceedence = simsOver / newSeries.length;

            this.setState({
                series: newSeries,
                statThreshold,
                seriesMin,
                seriesMax,
                percExceedence
            })
        }
    };

    updateThreshold(series, statThreshold, dates, dateThreshold) {
        // update 'over' flag to true if sim peak surpasses statThreshold
        // returns numSims 'over' threshold
        let simsOver = 0;
        const dateInput = new Date(Date.parse(dateThreshold));

        Object.values(series).map(sim => {
          const simPeak = Math.max.apply(null, sim.vals);
          const simPeakDate = dates[sim.vals.indexOf(simPeak)];

          if (simPeak > statThreshold && simPeakDate < dateInput) {
              simsOver = simsOver + 1;
              return sim.over = true;
          } else {
              return sim.over = false;
          };
        })
        console.log('simsOver', simsOver)
        return simsOver;
    };

    handleButtonClick = (i) => {
        const yAxisLabel = `Number of Daily ${i.name}`;
        this.setState({stat: i, yAxisLabel})
    };

    handleScenarioClick = (i) => {
        this.setState({scenario: i})
    };

    handleSeverityClick = (i) => {
        this.setState({severity: i});
    };

    handleStatSliderChange = (i) => {
        const { dates, dateThreshold } = this.state;
        // const rounded = Math.ceil(i / 100) * 100;
        const copy = Array.from(this.state.series);
        const simsOver = this.updateThreshold(copy, i, dates, dateThreshold);
        const percExceedence = simsOver / copy.length;

        this.setState({
            series: copy,
            statThreshold: +i,
            percExceedence
        });
    };

    handleDateSliderChange = (i) => {
        const { statThreshold, dates } = this.state;
        console.log('handleDateSliderChange', i)
        const copy = Array.from(this.state.series);
        const simsOver = this.updateThreshold(copy, statThreshold, dates, i);
        const percExceedence = simsOver / copy.length;

        this.setState({
            series: copy,
            dateThreshold: i,
            percExceedence
        })
    }

    handleBrushRange = (i) => {
        // for example, if props received is dateRange [minDate, maxDate]
        const parseDate = utcParse("%Y-%m-%d");
        const dateRange = [parseDate(i[0]), parseDate(i[1])];
        const idxMin = dateRange[0] - this.state.firstDate;
        const idxMax = dateRange[1] - this.state.firstDate;

        const copyDates = Array.from(this.state.dates.slice(idxMin, idxMax));
        const copySeries = Array.from(this.state.series);
        Object.values(copySeries).map(sim => sim.vals.splice(idxMin, idxMax));

        this.setState({
            series: copySeries,
            dates: copyDates,
        });
    };

    handleReprSliderChange = (i) => {
        this.setState({r0: i});
    };

    handleConfClick = (i) => {
        this.setState(prevState => ({
            showConfBounds: !prevState.showConfBounds
        }));
    };

    handleActualClick = (i) => {
        this.setState(prevState => ({
            showActual: !prevState.showActual
        }));
    };

    handleBrushChange = (i) => {
        // this.setState({ dateRange: i })
    }

    render() {
        const scenarioTitle = this.state.scenario.name.replace('_', ' ');
        return (
            <div className="main-container">
                <div className="container no-margin">
                    <div className="row">
                        <div className="col-9">
                            <Buttons
                                stat={this.state.stat}
                                onButtonClick={this.handleButtonClick}
                                />
                            <p></p>

                            {/* temp title row + legend */}
                            <div className="row">
                                <div className="col-3"></div>
                                <div className="col-6">
                                    <p className="filter-label scenario-title">
                                        {scenarioTitle}
                                    </p>
                                </div>
                                <div className="col-3">
                                    <Legend />
                                </div>
                            </div>

                            <div
                                className="graph border"
                                ref={ (graphEl) => { this.graphEl = graphEl } }
                                >
                                <ThresholdLabel
                                    statThreshold={this.state.statThreshold}
                                    dateThreshold={this.state.dateThreshold}
                                    percExceedence={this.state.percExceedence}
                                />
                                {this.state.dataLoaded &&
                                <div>
                                    <Graph 
                                        stat={this.state.stat}
                                        geoid={this.state.geoid}
                                        yAxisLabel={this.state.yAxisLabel}
                                        scenario={this.state.scenario}
                                        severity={this.state.severity}
                                        r0={this.state.r0}
                                        simNum={this.state.simNum}
                                        showConfBounds={this.state.showConfBounds}
                                        showActual={this.state.showActual}
                                        series={this.state.series}
                                        dates={this.state.dates}
                                        statThreshold={this.state.statThreshold}
                                        width={this.state.graphW}
                                        height={this.state.graphH}
                                    /> 
                                    <Brush
                                        series={this.state.series}
                                        dates={this.state.dates}
                                        width={this.state.graphW}
                                        height={80}
                                        onBrushChange={this.handleBrushChange}
                                    />
                                </div>
                                }
                            </div>
                        </div>
                        <div className="col-3">
                            <h5>Scenarios</h5>
                            <Scenarios 
                                scenario={this.state.scenario}
                                onScenarioClick={this.handleScenarioClick}
                            />
                            <p></p>
                            {/* <h5>Overlays</h5>
                            <Overlays 
                                showConfBounds={this.state.showConfBounds}
                                showActual={this.state.showActual}
                                onConfClick={this.handleConfClick}
                                onActualClick={this.handleActualClick}
                            />                         */}
                            <h5>Parameters</h5>
                            <p className="param-header">Severity</p>
                            <Severity 
                                severity={this.state.severity}
                                onSeverityClick={this.handleSeverityClick}
                            />
                            <p></p>
                            <h5>Thresholds</h5>
                            <Sliders 
                                stat={this.state.stat}
                                seriesMax={this.state.seriesMax}
                                seriesMin={this.state.seriesMin}
                                statThreshold={this.state.statThreshold}
                                dateThreshold={this.state.dateThreshold}
                                firstDate={this.state.firstDate}
                                lastDate={this.state.lastDate}
                                onStatSliderChange={this.handleStatSliderChange}
                                onDateSliderChange={this.handleDateSliderChange}
                                // // onReprSliderChange={this.handleReprSliderChange}
                            />

                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default MainContainer;