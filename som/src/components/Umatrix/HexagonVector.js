import React, { useState } from 'react';
import { Card, CardTitle, CardBody, Row, Col } from 'reactstrap';
import Color from 'color';
import { IconButton } from '@material-ui/core';

/**
 * @param {*} props 
 * @returns A single display hexagon in the U-Matrix
 */
function HexagonVector(props) {

    let color;
    if (props.minColor == null && props.maxColor == null) {
        color = Color('#FCFDFE').darken(props.distanceRatio)
    }
    else {
        let minDistanceColor = props.minColor == null ? '#FCFDFE' : props.minColor;
        let maxDistanceColor = props.maxColor == null ? '#1E3B59' : props.maxColor;
        color = Color(minDistanceColor).mix(Color(maxDistanceColor), props.distanceRatio);
    }

    const [isShown, setIsShown] = useState(false);

    let centre;
    if (props.isVector) {
        if (props.label) {
            //console.log("HexagonVector label: ", props.label);
            centre = <rect x="6" y="6" width="4" height="4"
                fill={props.distanceRatio > 0.5 ? "white" : "yellow"} />
        }
        else {
            centre = <circle cx="8" cy="8" r="1.5"
                fill={props.distanceRatio > 0.5 ? "white" : "black"} />
        }

    } else {
        centre = null
    }

    const vector = (hexagon) => {
        return hexagon.map((elem, index) => {
            if (index < hexagon.length - 1) {
                return String(elem) + " | ";
            }
            else {
                return String(elem);
            }
        });
    };

    return (
        <Row>
            <IconButton style={{ zIndex: "1" }}
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}>
                <svg xmlns="http://www.w3.org/2000/svg"
                    width={props.size}
                    class="bi bi-hexagon-fill"
                    viewBox="0 0 16 16">
                    <path fill={color} fill-rule="evenodd"
                        d="M8.5.134a1 1 0 0 0-1 0l-6 3.577a1 1 0 0 0-.5.866v6.846a1 1 0 0 0 .5.866l6 3.577a1 1 0 0 0 1 0l6-3.577a1 1 0 0 0 .5-.866V4.577a1 1 0 0 0-.5-.866L8.5.134z"
                    />
                    {centre}
                </svg>
            </IconButton>

            <Col>
                {isShown && (
                    <Card style={{ backgroundColor: "white", zIndex: "2", width: "27vw", height: "auto" }}>
                        <CardBody>
                            {props.label && (<div><strong>Codebook Label: </strong>{props.label}</div>)}
                            <br />
                            <div><strong>Average distance: </strong></div>
                            <div>{props.averageDistance}</div>
                            <div>-------------------------------------------</div>
                            <div><strong>Codebook vector: </strong></div>
                            {vector(props.hexagon.vector)}<br />
                        </CardBody>
                    </Card>
                )}
            </Col>
        </Row>
    );
}

export default HexagonVector;