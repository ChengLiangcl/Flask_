import React, { useState, useRef } from 'react';
import { InputGroup, InputGroupText, InputGroupAddon, Input } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';

function SearchFile(props) {
    const [inputValue, setInput] = useState('');
    const el = useRef(); // accesing input element

    const handleChange = (event) => {
        const userInput = event.target.value;
        console.log("the user input: ", userInput);
        setInput(event.target.value);
    };

    const handleClick = () => {
        console.log("the current input value: ", inputValue);
        props.queryDatasets(inputValue, sessionStorage.getItem('verifiedUsername'));
    };

    return (
        <Col md={{ size: 7 }}>
            <InputGroup style={{ width: '6' }} >
                <Input ref={el} onChange={handleChange} placeholder="Search similar datasets here" />
                <InputGroupAddon addonType="append">
                    <Button onClick={handleClick} style={{ backgroundColor: '#378CC6' }}>Search</Button>
                </InputGroupAddon>
            </InputGroup>
        </Col>
    );
}

export default SearchFile;