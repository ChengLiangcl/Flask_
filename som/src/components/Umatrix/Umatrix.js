import React, { Component } from 'react';
import HexagonVector from './HexagonVector';
import ExpandedVector from './HexagonExpand';
import { getSOM } from '../../somJS/SOM';
import Color from 'color';
import { Container, Row, Col } from 'reactstrap';
import { MapInteractionCSS } from 'react-map-interaction';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { IconButton, Button } from '@material-ui/core';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

/**
 * Generates the displayed U-Matrix.
 * The grid's coordinate system is inspired by https://www.redblobgames.com/grids/hexagons/. 
 * Check the topics 'Offset coordinates' and 'Doubled coordinates'.
 * 
 * Inspired by the above, there's two coordinate systems being simultaneously used in the code below:
 *  - The SOM coordinate system described by the SOM paper. The following variables refer to this coordinate system:
 *    - rowNum
 *    - colNum
 *    - xDim
 *    - yDim
 *  - The 'expanded' coordinate system which considers the intermediate hexagons between vectors, representing their distance.
 *    The following variables refer to this coordinate system:
 *    - expandedRowNum
 *    - expandedColNum
 *    - xExpandedDim
 *    - yExpandedDim
 */
class UMatrix extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hexagonGrid: null, // som
            value: {
                scale: 1,
                translation: { x: 0, y: 0 }
            },
            minDropdownOpen: false,
            maxDropdownOpen: false,
            minEndColor: '#3F7EBE',
            minColor: null,
            maxColor: null,
            displayRatio: 0.5
        }
        this.resetTransform = this.resetTransform.bind(this);
        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
        this.minToggle = this.minToggle.bind(this);
        this.maxToggle = this.maxToggle.bind(this);
    }

    resetTransform() {
        this.setState({
            value: {
                scale: 1,
                translation: { x: 0, y: 0 }
            }
        });
    }

    zoomIn() {
        this.setState(state => ({
            value: {
                scale: state.value.scale > 0.11 ? state.value.scale - 0.1 : state.value.scale,
                translation: { x: 0, y: 0 }
            }
        }));
    }

    zoomOut() {
        this.setState(state => ({
            value: {
                scale: state.value.scale + 0.1,
                translation: { x: 0, y: 0 }
            }
        }));
    }

    minToggle() {
        this.setState(state => ({
            minDropdownOpen: !state.minDropdownOpen
        }));
    }

    maxToggle() {
        this.setState(state => ({
            maxDropdownOpen: !state.maxDropdownOpen
        }));
    }

    //Load the hexagon grid into memory
    componentDidMount() {
        getSOM(this.props.model).then(grid => this.setState({
            hexagonGrid: grid,
            maxDistance: grid.getMaxDistance(),
            minDistance: grid.getMinDistance(),
            xExpandedDim: grid.xDim * 4 - 1,
            yExpandedDim: grid.yDim * 2 - 1,
            // Hexagon dimensions explained here https://www.redblobgames.com/grids/hexagons/
            hexagonWidth: Math.sqrt(3) * this.props.hexagonSize,
            hexagonHeight: 1.5 * this.props.hexagonSize
        }))
    }

    // Returns CSS to correctly place the hexagon in the grid
    getHexagonCSS(expandedRowNum, expandedColNum) {
        // CSS grid indices start from 1 instead of 0
        return {
            'grid-column-start': `${expandedColNum + 1}`,
            'grid-column-end': `${expandedColNum + 2}`,
            'grid-row-start': `${expandedRowNum + 1}`,
            'grid-row-end': `${expandedRowNum + 2}`,
        }
    }

    /**
     * @param {JSX.Element} hexagon 
     * @param {number} expandedRowNum 
     * @param {number} expandedColNum 
     * @returns a div that captures the hexagon's position in the displayed/expanded hexagon grid
     */
    getGridItem(hexagon, expandedRowNum, expandedColNum) {
        return <div key={expandedRowNum * this.state.xExpandedDim + expandedColNum}
            style={this.getHexagonCSS(expandedRowNum, expandedColNum)}>
            {hexagon}
        </div>
    }

    /**
     * Returns the coordinates of the hexagon (in the expanded space) representing the distance between
     * the hexagon at (expandedColNum, expandedRowNum) and its neighbour
     * @param {'bottom-left'|'bottom-right'|'right'} neighbour 
     * @param {number} expandedRowNum 
     * @param {number} expandedColNum 
     * @returns coordinates of the distance hexagon
     */
    getNeighbourCoordinates(neighbour, expandedRowNum, expandedColNum) {
        switch (neighbour) {
            case 'bottom-left':
                expandedRowNum++
                expandedColNum--
                break
            case 'bottom-right':
                expandedRowNum++
                expandedColNum++
                break
            case 'right':
                expandedColNum += 2
                break;
            default:
                throw new Error(`${neighbour} is not a valid neighbour`)
        }
        return [expandedColNum, expandedRowNum]
    }

    /**
     * Generates the hexagon at position (colNum, rowNum) in the grid, representing a codebook vector.
     * Also generates up to 3 hexagons to represent the vector's distances to three of its neighbours.
     * Check out the Components tab in React's Devtools plugin to see the order of hexagon generation.
     * @param {number} rowNum 
     * @param {number} colNum 
     * @returns a list of up to 4 JSX elements, 
     * 
     */
    generateHexagonNeighbourhood(rowNum, colNum) {
        const hexagon = this.state.hexagonGrid.grid[rowNum][colNum]
        //console.log("Umatrix hexagon: ", hexagon.vector);
        const vectorHexagon = <HexagonVector
            size={this.state.hexagonWidth}
            isVector={true}
            distanceRatio={hexagon.getAverageDistance() / this.state.maxDistance}
            minDistanceRatio={this.state.minDistance / this.state.maxDistance}
            maxDistanceRatio={this.state.maxDistance / this.state.maxDistance}
            averageDistance={hexagon.getAverageDistance()}
            hexagon={hexagon}
            label={hexagon.label}
            minColor={this.state.minColor}
            maxColor={this.state.maxColor}
            displayRatio={this.state.displayRatio}
        />

        // For odd-indexed rows we add 2 * (rowNum % 2) to shift it forward
        const expandedColNum = 4 * colNum + 2 * (rowNum % 2)
        const expandedRowNum = 2 * rowNum

        // First add the vector hexagon
        const neighbourhood = [this.getGridItem(vectorHexagon, expandedRowNum, expandedColNum)]
        // Then add the vector hexagon's neighbours (which are distance hexagons)
        for (const neighbour of ['bottom-left', 'bottom-right', 'right']) {
            if (hexagon.neighbours[neighbour]) {
                const distanceHexagon = <ExpandedVector
                    size={this.state.hexagonWidth}
                    isVector={false}
                    distanceRatio={hexagon.getDistance(neighbour) / this.state.maxDistance}
                    betweenDistance={hexagon.getDistance(neighbour)}
                    minDistanceRatio={this.state.minDistance / this.state.maxDistance}
                    maxDistanceRatio={this.state.maxDistance / this.state.maxDistance}
                    minColor={this.state.minColor}
                    maxColor={this.state.maxColor}
                    displayRatio={this.state.displayRatio}
                />
                const [x, y] = this.getNeighbourCoordinates(neighbour, expandedRowNum, expandedColNum)
                neighbourhood.push(this.getGridItem(distanceHexagon, y, x))
            }
        }

        return neighbourhood
    }

    render() {
        if (!this.state.hexagonGrid) {
            return null
        }

        const gridCssStyle = {
            'display': 'grid',
            'grid-template-columns': `repeat(${this.state.xExpandedDim}, ${0.5 * this.state.hexagonWidth}px)`,
            'grid-template-rows': `repeat(${this.state.yExpandedDim}, ${this.state.hexagonHeight}px)`,
            'height': '100vh'
        }

        const legendCssStyle = {
            'background': `linear-gradient(90deg, ${this.state.minColor == null ? '#FCFDFE' : this.state.minColor} 0%, 
                ${this.state.minColor == null && this.state.maxColor == null ? '#3D7AB7' : this.state.minColor} 50%,
                 ${this.state.maxColor == null ? '#1E3B59' : this.state.maxColor} 100%)`
        }

        let gridItems = []
        for (let rowNum = 0; rowNum < this.state.hexagonGrid.yDim; rowNum++) {
            for (let colNum = 0; colNum < this.state.hexagonGrid.xDim; colNum++) {
                const neighbourhood = this.generateHexagonNeighbourhood(rowNum, colNum)
                gridItems = gridItems.concat(neighbourhood)
            }
        }

        return (
            <div>
                <div className="d-flex justify-content-between">
                    <ButtonDropdown isOpen={this.state.minDropdownOpen} toggle={this.minToggle}>
                        <DropdownToggle caret size="sm" style={{ backgroundColor: "white", color: "grey", border: "none" }}>
                            Minimum distance: {this.state.minDistance.toFixed(4)}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem header>Color for minimum distance: </DropdownItem>
                            <DropdownItem>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#ffffff' })}><FiberManualRecordIcon style={{ color: '#ffffff' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#000000' })}><FiberManualRecordIcon style={{ color: '#000000' }} /></IconButton>
                            </DropdownItem>
                            <DropdownItem>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#E6B8AF' })}><FiberManualRecordIcon style={{ color: '#E6B8AF' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#F4CCCC' })}><FiberManualRecordIcon style={{ color: '#F4CCCC' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#FCE5CD' })}><FiberManualRecordIcon style={{ color: '#FCE5CD' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#FFF2CC' })}><FiberManualRecordIcon style={{ color: '#FFF2CC' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#D9EAD3' })}><FiberManualRecordIcon style={{ color: '#D9EAD3' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#D0E0E3' })}><FiberManualRecordIcon style={{ color: '#D0E0E3' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#C9DAF8' })}><FiberManualRecordIcon style={{ color: '#C9DAF8' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#CFE2F3' })}><FiberManualRecordIcon style={{ color: '#CFE2F3' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#D9D2E9' })}><FiberManualRecordIcon style={{ color: '#D9D2E9' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#EAD1DC' })}><FiberManualRecordIcon style={{ color: '#EAD1DC' }} /></IconButton>
                            </DropdownItem>
                            <DropdownItem>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#DD7E6B' })}><FiberManualRecordIcon style={{ color: '#DD7E6B' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#EA9999' })}><FiberManualRecordIcon style={{ color: '#EA9999' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#F9CB9C' })}><FiberManualRecordIcon style={{ color: '#F9CB9C' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#FFE599' })}><FiberManualRecordIcon style={{ color: '#FFE599' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#B6D7A8' })}><FiberManualRecordIcon style={{ color: '#B6D7A8' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#A2C4C9' })}><FiberManualRecordIcon style={{ color: '#A2C4C9' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#A4C2F4' })}><FiberManualRecordIcon style={{ color: '#A4C2F4' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#9FC5E8' })}><FiberManualRecordIcon style={{ color: '#9FC5E8' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#B4A7D6' })}><FiberManualRecordIcon style={{ color: '#B4A7D6' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#D5A6BD' })}><FiberManualRecordIcon style={{ color: '#D5A6BD' }} /></IconButton>
                            </DropdownItem>
                            <DropdownItem>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#A61C00' })}><FiberManualRecordIcon style={{ color: '#A61C00' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#CC0000' })}><FiberManualRecordIcon style={{ color: '#CC0000' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#E69138' })}><FiberManualRecordIcon style={{ color: '#E69138' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#F1C232' })}><FiberManualRecordIcon style={{ color: '#F1C232' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#6AA84F' })}><FiberManualRecordIcon style={{ color: '#6AA84F' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#45818E' })}><FiberManualRecordIcon style={{ color: '#45818E' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#3C78D8' })}><FiberManualRecordIcon style={{ color: '#3C78D8' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#3D85C6' })}><FiberManualRecordIcon style={{ color: '#3D85C6' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#674EA7' })}><FiberManualRecordIcon style={{ color: '#674EA7' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#A64D79' })}><FiberManualRecordIcon style={{ color: '#A64D79' }} /></IconButton>
                            </DropdownItem>
                            <DropdownItem>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#85200C' })}><FiberManualRecordIcon style={{ color: '#85200C' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#990000' })}><FiberManualRecordIcon style={{ color: '#990000' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#B45F06' })}><FiberManualRecordIcon style={{ color: '#B45F06' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#BF9000' })}><FiberManualRecordIcon style={{ color: '#BF9000' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#38761D' })}><FiberManualRecordIcon style={{ color: '#38761D' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#134F5C' })}><FiberManualRecordIcon style={{ color: '#134F5C' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#1155CC' })}><FiberManualRecordIcon style={{ color: '#1155CC' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#0B5394' })}><FiberManualRecordIcon style={{ color: '#0B5394' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#351C75' })}><FiberManualRecordIcon style={{ color: '#351C75' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#741B47' })}><FiberManualRecordIcon style={{ color: '#741B47' }} /></IconButton>
                            </DropdownItem>
                            <DropdownItem>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#980000' })}><FiberManualRecordIcon style={{ color: '#980000' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#FF0000' })}><FiberManualRecordIcon style={{ color: '#FF0000' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#FF9900' })}><FiberManualRecordIcon style={{ color: '#FF9900' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#FFFF00' })}><FiberManualRecordIcon style={{ color: '#FFFF00' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#00FF00' })}><FiberManualRecordIcon style={{ color: '#00FF00' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#00FFFF' })}><FiberManualRecordIcon style={{ color: '#00FFFF' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#4A86E8' })}><FiberManualRecordIcon style={{ color: '#4A86E8' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#0000FF' })}><FiberManualRecordIcon style={{ color: '#0000FF' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#9900FF' })}><FiberManualRecordIcon style={{ color: '#9900FF' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ minColor: '#FF00FF' })}><FiberManualRecordIcon style={{ color: '#FF00FF' }} /></IconButton>
                            </DropdownItem>
                        </DropdownMenu>
                    </ButtonDropdown>

                    <div>
                        <IconButton onClick={() => this.setState({ minColor: null, maxColor: null, minEndColor: '#3F7EBE', displayRatio: 0.5 })}><AutorenewIcon /></IconButton>
                    </div>

                    <ButtonDropdown isOpen={this.state.maxDropdownOpen} toggle={this.maxToggle}>
                        <DropdownToggle caret size="sm" style={{ backgroundColor: "white", color: "grey", border: "none" }}>
                            Maximum distance: {this.state.maxDistance.toFixed(4)}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem header>Color for maximum distance:</DropdownItem>
                            <DropdownItem>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#ffffff' })}><FiberManualRecordIcon style={{ color: '#ffffff' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#000000' })}><FiberManualRecordIcon style={{ color: '#000000' }} /></IconButton>
                            </DropdownItem>
                            <DropdownItem>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#E6B8AF' })}><FiberManualRecordIcon style={{ color: '#E6B8AF' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#F4CCCC' })}><FiberManualRecordIcon style={{ color: '#F4CCCC' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#FCE5CD' })}><FiberManualRecordIcon style={{ color: '#FCE5CD' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#FFF2CC' })}><FiberManualRecordIcon style={{ color: '#FFF2CC' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#D9EAD3' })}><FiberManualRecordIcon style={{ color: '#D9EAD3' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#D0E0E3' })}><FiberManualRecordIcon style={{ color: '#D0E0E3' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#C9DAF8' })}><FiberManualRecordIcon style={{ color: '#C9DAF8' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#CFE2F3' })}><FiberManualRecordIcon style={{ color: '#CFE2F3' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#D9D2E9' })}><FiberManualRecordIcon style={{ color: '#D9D2E9' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#EAD1DC' })}><FiberManualRecordIcon style={{ color: '#EAD1DC' }} /></IconButton>
                            </DropdownItem>
                            <DropdownItem>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#DD7E6B' })}><FiberManualRecordIcon style={{ color: '#DD7E6B' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#EA9999' })}><FiberManualRecordIcon style={{ color: '#EA9999' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#F9CB9C' })}><FiberManualRecordIcon style={{ color: '#F9CB9C' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#FFE599' })}><FiberManualRecordIcon style={{ color: '#FFE599' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxolor: '#B6D7A8' })}><FiberManualRecordIcon style={{ color: '#B6D7A8' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#A2C4C9' })}><FiberManualRecordIcon style={{ color: '#A2C4C9' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#A4C2F4' })}><FiberManualRecordIcon style={{ color: '#A4C2F4' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#9FC5E8' })}><FiberManualRecordIcon style={{ color: '#9FC5E8' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#B4A7D6' })}><FiberManualRecordIcon style={{ color: '#B4A7D6' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#D5A6BD' })}><FiberManualRecordIcon style={{ color: '#D5A6BD' }} /></IconButton>
                            </DropdownItem>
                            <DropdownItem>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#A61C00' })}><FiberManualRecordIcon style={{ color: '#A61C00' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#CC0000' })}><FiberManualRecordIcon style={{ color: '#CC0000' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#E69138' })}><FiberManualRecordIcon style={{ color: '#E69138' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#F1C232' })}><FiberManualRecordIcon style={{ color: '#F1C232' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#6AA84F' })}><FiberManualRecordIcon style={{ color: '#6AA84F' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#45818E' })}><FiberManualRecordIcon style={{ color: '#45818E' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#3C78D8' })}><FiberManualRecordIcon style={{ color: '#3C78D8' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#3D85C6' })}><FiberManualRecordIcon style={{ color: '#3D85C6' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#674EA7' })}><FiberManualRecordIcon style={{ color: '#674EA7' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#A64D79' })}><FiberManualRecordIcon style={{ color: '#A64D79' }} /></IconButton>
                            </DropdownItem>
                            <DropdownItem>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#85200C' })}><FiberManualRecordIcon style={{ color: '#85200C' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#990000' })}><FiberManualRecordIcon style={{ color: '#990000' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#B45F06' })}><FiberManualRecordIcon style={{ color: '#B45F06' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#BF9000' })}><FiberManualRecordIcon style={{ color: '#BF9000' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#38761D' })}><FiberManualRecordIcon style={{ color: '#38761D' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#134F5C' })}><FiberManualRecordIcon style={{ color: '#134F5C' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#1155CC' })}><FiberManualRecordIcon style={{ color: '#1155CC' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#0B5394' })}><FiberManualRecordIcon style={{ color: '#0B5394' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#351C75' })}><FiberManualRecordIcon style={{ color: '#351C75' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#741B47' })}><FiberManualRecordIcon style={{ color: '#741B47' }} /></IconButton>
                            </DropdownItem>
                            <DropdownItem>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#980000' })}><FiberManualRecordIcon style={{ color: '#980000' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#FF0000' })}><FiberManualRecordIcon style={{ color: '#FF0000' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#FF9900' })}><FiberManualRecordIcon style={{ color: '#FF9900' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#FFFF00' })}><FiberManualRecordIcon style={{ color: '#FFFF00' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#00FF00' })}><FiberManualRecordIcon style={{ color: '#00FF00' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#00FFFF' })}><FiberManualRecordIcon style={{ color: '#00FFFF' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#4A86E8' })}><FiberManualRecordIcon style={{ color: '#4A86E8' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#0000FF' })}><FiberManualRecordIcon style={{ color: '#0000FF' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#9900FF' })}><FiberManualRecordIcon style={{ color: '#9900FF' }} /></IconButton>
                                <IconButton size="small" onClick={() => this.setState({ maxColor: '#FF00FF' })}><FiberManualRecordIcon style={{ color: '#FF00FF' }} /></IconButton>
                            </DropdownItem>
                        </DropdownMenu>
                    </ButtonDropdown>
                </div>

                <Row style={legendCssStyle}>
                    <p></p>
                </Row>

                <div>
                    <React.Fragment>
                        <Button style={{ color: "grey" }}>Zoom: </Button>
                        <IconButton onClick={this.zoomOut}><AddBoxIcon /></IconButton>
                        <IconButton onClick={this.zoomIn}><IndeterminateCheckBoxIcon /></IconButton>
                        <IconButton onClick={this.resetTransform}>< SettingsBackupRestoreIcon /></IconButton>
                    </React.Fragment>
                    <MapInteractionCSS
                        value={this.state.value}
                        onChange={(value) => this.setState({ value })}>
                        <div style={gridCssStyle}>
                            {gridItems}
                        </div>
                    </MapInteractionCSS>
                </div>
            </div>
        )
    }
}

export default UMatrix;