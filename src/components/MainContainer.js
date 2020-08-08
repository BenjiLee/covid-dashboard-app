import React, { Component } from 'react';
import { Layout } from 'antd';
import { defaultGeoid, margin, dimMultipliers } from '../utils/constants';
import { fetchJSON } from '../utils/fetch';
import Search from './Search/Search'
import MainGraph from './Graph/MainGraph';
import MainChart from './Chart/MainChart';
import MainMap from './Map/MainMap';
import Methodology from './Methodology';
import About from './About';
import connect from "react-redux/es/connect/connect";
import { fetchDataSet, setDataSet } from "../redux/actions/dataSet_actions";
import store from '../redux/store'

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            geoid: defaultGeoid,
            graphW: 0,
            graphH: 0,
            mapContainerW: 0,
            mapContainerH: 0
        };
    };

    componentDidMount() {
        window.addEventListener('resize', this.updateGraphDimensions);
        window.addEventListener('resize', this.updateMapContainerDimensions);

        this.updateGraphDimensions();
        this.updateMapContainerDimensions();

        this.props.fetchDataSet(this.state.geoid);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataSet !== this.props.dataSet) {
            this.setState({ dataLoaded: true })
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateGraphDimensions);
        window.removeEventListener('resize', this.updateMapContainerDimensions);
    }

    updateGraphDimensions = () => {
        const ratioH = dimMultipliers.graphDesktopH;
        const ratioW = window.innerWidth > 800 ?
            dimMultipliers.graphDesktopW :
            dimMultipliers.graphMobileW; // account for mobile

        const graphH = window.innerHeight * ratioH;
        const graphW = (window.innerWidth * ratioW) - margin.yAxis;

        this.setState({ graphW, graphH, animateTransition: false });
    }

    updateMapContainerDimensions = () => {
        const ratioH = dimMultipliers.mapDesktopH;
        const ratioW = window.innerWidth > 800 ?
            dimMultipliers.graphDesktopW :
            dimMultipliers.mapMobileW; // account for mobile 

        const mapContainerH = window.innerHeight * ratioH;
        const mapContainerW = ((window.innerWidth * ratioW) - margin.yAxis) -
            (6 * (margin.left));

        this.setState({ mapContainerW, mapContainerH });
    }

    handleCountySelect = (geoid) => {
        this.setState({ dataLoaded: false });
        this.props.fetchDataSet(geoid);
    };

    handleUpload = (dataSet, geoid) => {
        console.log('Main handleUpload', geoid, dataSet);
        store.dispatch(setDataSet(dataSet));
        this.setState({ geoid })
    };

    render() {
        return (
            <Layout>
                <Search
                    geoid={this.state.geoid}
                    onFileUpload={this.handleUpload}
                    onCountySelect={this.handleCountySelect}>
                </Search>

                {this.state.dataLoaded  &&
                <MainGraph
                    geoid={this.state.geoid}
                    width={this.state.graphW}
                    height={this.state.graphH}
                />}

                {this.state.dataLoaded &&
                <MainChart
                    geoid={this.state.geoid}
                    width={this.state.graphW - margin.left - margin.right}
                    height={this.state.graphH * dimMultipliers.chartDesktopH}
                />}

                {this.state.dataLoaded &&
                <MainMap
                    geoid={this.state.geoid}
                    width={this.state.mapContainerW - margin.left - margin.right}
                    height={this.state.mapContainerH}
                />}

                <Methodology/>
                <About/>
            </Layout>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const { dataSet } = state;
    console.log("MEOW: " + JSON.stringify(dataSet));
    return {
        ...ownProps,
        dataSet,
    }
}

const mapDispatchToProps = {
    fetchDataSet,
    setDataSet
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
