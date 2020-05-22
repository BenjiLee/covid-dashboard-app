import React, { Component } from 'react';
import Legend from '../Graph/Legend';
import Scenarios from '../Filters/Scenarios';
import Indicators from '../Filters/Indicators';
import Overlays from '../Filters/Overlays';
import SeverityContainer from '../Filters/SeverityContainer'
import Sliders from '../Filters/Sliders';


class GraphFilter extends Component {
    handleScenarioClick = (i) => {
        this.props.onScenarioClick(i);
    }

    handleButtonClick = (i) => {
        this.props.onButtonClick(i);
    }
    
    handleConfClick = () => {
        this.props.onConfClick();
    }

    handleSeveritiesClick = (i) => {
        this.props.onSeveritiesClick(i);
    }

    handleSeveritiesHover = (i) => {
        this.props.onSeveritiesHover(i);
    }

    handleSeveritiesHoverLeave= () => {
        this.props.onSeveritiesHoverLeave();
    }

    handleStatSliderChange = (i) => {
        this.props.onStatSliderChange(i);
    }

    handleDateSliderChange = (i) => {
        this.props.onDateSliderChange(i);
    }

    render() {
        return (
            <div>
                <Legend />
                <div className="param-header">SCENARIOS</div>
                <Scenarios
                    SCENARIOS={this.props.SCENARIOS}
                    scenario={this.props.scenario}
                    scenarioList={this.props.scenarioList}
                    onScenarioClick={this.handleScenarioClick}
                />
                <Indicators
                    stat={this.props.stat}
                    onButtonClick={this.handleButtonClick}
                />        
                <Overlays 
                    showConfBounds={this.props.showConfBounds}
                    onConfClick={this.handleConfClick}
                /> 
                <SeverityContainer
                    severityList={this.props.severityList}
                    scenarioList={this.props.scenarioList}
                    onSeveritiesClick={this.handleSeveritiesClick}
                    onSeveritiesHover={this.handleSeveritiesHover}
                    onSeveritiesHoverLeave={this.handleSeveritiesHoverLeave}
                />
                <div className="filter-description">
                    High, medium, and low severity correspond to 1%, 0.5%, 
                    and 0.25% infection fatality rate, respectively.
                </div>
                <br />      
                <Sliders 
                    stat={this.props.stat}
                    dates={this.props.dates}
                    seriesMax={this.props.seriesMax}
                    seriesMin={this.props.seriesMin}
                    statThreshold={this.props.statThreshold}
                    dateThreshold={this.props.dateThreshold}
                    dateThresholdIdx={this.props.dateThresholdIdx}
                    firstDate={this.props.firstDate}
                    lastDate={this.props.lastDate}
                    dateRange={this.props.dateRange}
                    onStatSliderChange={this.handleStatSliderChange}
                    onDateSliderChange={this.handleDateSliderChange}
                />
            </div>   
        )
    }
}

export default GraphFilter;