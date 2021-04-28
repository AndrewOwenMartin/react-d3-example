# An example of using D3 with React

This package provides an example of using D3 with React in a where they play nicely together.

The file [Reactd3.js](src/ReactD3.js) exports one hook `useD3`, and two components `D3` and `D3Example`.

## useD3 (hook)

This hook takes in some data and a rendering function and returns a `ref` to the D3 container element, this ref can then be passed to the `D3` component.

This hook expects to receive an object with these members.

- renderD3: a function which takes `{svg, width, height, data}` and renders the D3 object. 
- data: The data which D3 will use to bind to elements.
- reRenderTimeout (optional): Number of milliseconds to wait before rerendering after a window resize event.

## D3 (component)

This component takes in a `ref` to the D3 container provided by `useD3` and some initial svg structure and renders the D3 object.

## D3Example (component)

This component takes no arguments but can be inspected to see an example of how to use the hook `useD3` with the component `D3`. This component actually renders two diffeD3 objects to demonstrate that it's possible.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

