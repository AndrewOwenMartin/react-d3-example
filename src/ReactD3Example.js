import React, {
    useCallback,
    useState,
} from 'react';
import {
    useReactD3,
    ReactD3,
} from "./ReactD3"
import * as d3 from "d3";

const renderCircles = (svg, svgBounds, data, d3Props) => {

    const {width, height} = svgBounds

    const {circles, setCircles} = data

    const circlesGroup = svg.selectAll("#circles")
        .data([null])
        .join("g")
        .attr("id","circles")

    const radius = 20


    const transition = d3.transition()
        .duration(2500)

    if(circles !== null){

        const extentX = d3.extent(circles, d => d.x)
        const extentY = d3.extent(circles, d => d.y)
        const scaleX = d3.scaleLinear([0, Math.max(width, extentX[1])], [radius, width-radius])
        const scaleY = d3.scaleLinear([0, Math.max(height, extentY[1])], [height-radius, radius])

        circlesGroup.selectAll("circle")
            .data(circles, (d,i) => i)
            .join("circle")
            .attr("r", radius)
            .transition(transition)
            .attr("cx", d => scaleX(d.x))
            .attr("cy", d => scaleY(d.y))

        const simulation = d3Props.current.simulation || d3.forceSimulation()

        simulation
            .nodes(circles)
            .force("charge", 
                d3.forceManyBody()
                    .strength(100)
                    .distanceMin(radius)
                    .distanceMax(width)
            )
            .force("collide",
                d3.forceCollide(radius)
            )
            .on("tick", () => circlesGroup
                .selectAll("circle")
                .attr("cx", d => scaleX(d.x))
                .attr("cy", d => scaleY(d.y))
            ) 
            .stop()

        console.log("resetting simulation", {simulation, circles, d3Props})

        d3Props.current = {
            ...d3Props.current,
            simulation,
        }

    }

    console.log("resetting flip", {circles})

    const flip = (circles) => {
        
        const newCircles = circles.map(c => ({...c, x: width - c.x}))

        console.log("flip",{circles, newCircles, d3Props})

        setCircles(newCircles)
    }

    d3Props.current = {
        ...d3Props.current,
        bounds:svgBounds,
        flip,
    }


        
}

const useReactD3Example = ({initCircleCount}) => {

    const [circleCount, setCircleCount] = useState(initCircleCount)

    const [circles, setCircles] = useState(null)

    const {d3Container, d3Props} = useReactD3({
        data:{
            circles,
            setCircles,
        },
        render:renderCircles,
        initProps:{
            simulation: null,
            bounds: null,
        }
    })

    const initCircles = useCallback(
        (effect) => {
            const {width, height} = d3Props.current.bounds
            const newCircles = circleCount !== null
                ? Array(circleCount).fill().map((_,i) => ({x:Math.random() * width, y:Math.random() * height}))
                : []
            setCircles(newCircles)
        },
        [circleCount, d3Props]
    )

    return {
        d3Container,
        d3Props,
        circles,
        setCircles,
        circleCount,
        setCircleCount,
        initCircles,
    }
}

export const ReactD3Example = ({height, initCircleCount}) => {

    const {
        d3Container,
        d3Props,
        circles,
        //setCircles,
        circleCount,
        setCircleCount,
        initCircles,
    } = useReactD3Example({
        initCircleCount,
    })

    const d3ExampleState = {
        d3Container,
        height,
    }

    const startSimulation = useCallback(
        (event) => {
            const simulation = d3Props.current.simulation
            
            simulation.alpha(1).restart()
        },
        [d3Props]
    )

    const stopSimulation = useCallback(
        (event) => {
            const simulation = d3Props.current.simulation
            
            simulation.stop()
        },
        [d3Props]
    )

    const flip = useCallback(
        (event) => {
            d3Props.current.flip(circles)
        },
        [circles, d3Props]
    )

    return <div>
        <h2>React D3 Example</h2>
        <ReactD3 {...d3ExampleState} />
        <button onClick={initCircles}>Init circles</button>
        <button onClick={(event) => setCircleCount(circleCount > 1 ? circleCount-1 : 1)}>-</button>
        <span>Circles: {circleCount}</span>
        <button onClick={(event) => setCircleCount(circleCount < 100 ? circleCount+1 : 100)}>+</button>
        <button disabled={circles === null} onClick={startSimulation}>Start simulation</button>
        <button disabled={circles === null} onClick={stopSimulation}>Stop simulation</button>
        <button disabled={circles === null} onClick={flip}>Flip circles horizontally</button>
    </div>
}

