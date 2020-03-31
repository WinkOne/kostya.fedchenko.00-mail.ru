import React, {createRef} from 'react';


class App extends React.Component {
    state = {
        canvasX: '',
        canvasY: '',
        array: []
    };

    componentDidMount() {
        this.websocket = new WebSocket('ws://localhost:8000/chat');
        this.websocket.onmessage = (message) => {
            try {
                const data = JSON.parse(message.data);
                this.setState({array: data});
                const context = this.canvas.current.getContext("2d");
                this.state.array.forEach(item => {
                    context.fillStyle = "red";
                    context.fillRect(item.canvasX - 25, item.canvasY - 25, 50, 50);
                });
            } catch (e) {
                console.log(e);
            }
        };

    }

    onCanvasClick = e => {
        e.persist();
        const canvasElement = JSON.stringify({canvasX: e.clientX, canvasY: e.clientY});
        this.websocket.send(canvasElement);
    };

    canvas = createRef();

    render() {
        return <canvas id='canvasId' width="1900" height="850" ref={this.canvas} onClick={this.onCanvasClick}/>
    }
}

export default App;
