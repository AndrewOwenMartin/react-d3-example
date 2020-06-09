import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import * as d3 from "d3";

export const useD3 = ({renderD3, data, reRenderTimeout=1000}) => {

    if(!renderD3){
        throw new Error("useD3.renderD3 was falsy")
    }
    if(!data){
        throw new Error("useD3.data was falsy")
    }

    const container = useRef(null)

    const [myTimeout, setMyTimeout] = useState(null)

    const reRenderD3 = useCallback(
        () => {

            if (!(data && container.current)) {
                return
            }

            const containerElement = container.current

            const svg = d3.select(containerElement)

            const {width, height} = containerElement.getBoundingClientRect()

            return renderD3({svg, width, height, data})
        },
        [renderD3, data]
    )

    useEffect(
        () => reRenderD3(),
        [data, reRenderD3]
    )

    useEffect(
        () => {
            const handleResize = () => {

                const timer = setTimeout(() => {
                    reRenderD3()
                }, reRenderTimeout);

                setMyTimeout(timer)
            }

            window.addEventListener('resize', handleResize)

            return _ => {
                window.removeEventListener('resize', handleResize)
                if(myTimeout){
                    clearTimeout(myTimeout)
                }
            }
        },
        [myTimeout, reRenderD3, reRenderTimeout]
    )

    return {
        container,
        reRenderD3,
    }
}

export const D3 = ({d3Container, svgContents}) => {

    if(!d3Container){
        throw new Error("D3.d3Container was falsy")
    }
    if(!svgContents){
        throw new Error("D3.svgContents was falsy")
    }
    
    return <svg
        ref={d3Container}
        style={{width:"100%", height:"100%"}}
    >
        {svgContents}
    </svg>
}

const randomInt = (max) => Math.floor(Math.random() * Math.floor(max))

const svgContents = <g className="foo">
    <rect className="backgroundRect"></rect>
    <g className="bar" />
    <g className="baz" />
</g>

export const D3Example = (props) => {


    const newData = useCallback(
        () => {
            return Array(randomInt(5)+5).fill().map(
                () => [Math.random(), Math.random()]
            )
        },
        []
    )


    const [dataA, setDataA] = useState([
        [0.25, 0.25],
        [0.5, 0.1],
    ])
    const [dataB, setDataB] = useState([
        [0.75, 0.75],
        [0.5, 0.5],
    ])

    const renderD3 = useCallback(
        ({svg, width, height, data}) => {

            svg.select(".backgroundRect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", width)
                .attr("height", height)
                .style("fill", "#888888")

            const barRects = svg.select(".bar").selectAll("rect").data(data)

            const myTransition = d3.transition()
                .duration(750)
                .ease(d3.easeCubic)

            barRects.enter()
                .append("rect")
                .attr("x", ([x,y]) => x * width * 0.9)
                .attr("y", ([x,y]) => y * height * 0.9)
                .attr("width", width/10)
                .attr("height", height/10)
                .attr("opacity", 0)
                .transition(myTransition)
                .attr("opacity", 1)

            barRects
                .transition(myTransition)
                .attr("x", ([x,y]) => x * width * 0.9)
                .attr("y", ([x,y]) => y * height * 0.9)
                .attr("width", width/10)
                .attr("height", height/10)
            
            barRects.exit()
                .transition(myTransition)
                .attr("opacity", 0)
                .remove()
                
        },
        []
    )

    const {
        container: d3ContainerA,
    } = useD3({
        renderD3,
        data:dataA,
        reRenderTimeout: 1000,
    })

    const {
        container: d3ContainerB,
    } = useD3({
        renderD3,
        data:dataB,
        reRenderTimeout: 1000,
    })

    return <div>
        <h2>D3 Example</h2>
        <div style={{height:400, width:"90%"}} >
            <D3 {...{d3Container:d3ContainerA, svgContents}} />
        </div>
        <button onClick={() => setDataA(newData())}>New data</button>
        <hr />
        <div style={{height:400, width: 400}} >
            <D3 {...{d3Container:d3ContainerB, svgContents}} />
        </div>
        <button onClick={() => setDataB(newData())}>New data</button>
    </div>
}
