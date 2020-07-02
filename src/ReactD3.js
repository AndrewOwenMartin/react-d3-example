import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import * as d3 from "d3";

export const useReactD3 = ({data, render, initProps, resizeRerenderTimeout=1000}) => {

    const d3Container = useRef(null)
    const [myTimeout, setMyTimeout] = useState(null)
    const d3Props = useRef(initProps)

    const reRender = useCallback(
        () => {
            const containerElement = d3Container.current || null
            if(containerElement){
                const svg = d3.select(containerElement)
                const svgBounds = containerElement.getBoundingClientRect()
                render(svg, svgBounds, data, d3Props)
            }
        },
        [data, render]
    )

    useEffect(
        () => {
            reRender()
        },
        [reRender]
    )

    useEffect(
        () => {
            const handleResize = () => {

                const timer = setTimeout(() => {
                    reRender()
                }, resizeRerenderTimeout);

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
        [myTimeout, reRender, resizeRerenderTimeout]
    )

    return {
        d3Container,
        d3Props,
    }
}


export const ReactD3 = ({d3Container, height}) => {
    return <div style={{height}} >
        <svg ref={d3Container} width="100%" height="100%" />
    </div>
}

