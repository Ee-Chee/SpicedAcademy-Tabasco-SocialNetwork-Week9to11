import React from "react";
import { connect } from "react-redux";
import { socket } from "./socket";

class Snowman extends React.Component {
    constructor(props) {
        super(props);
        this.updateStartingPoint = [{ x: 0, y: 0 }, false]; //initialization important. Otherwise, undefine gives error
    }
    //use ref to getelementbyId/class
    componentDidMount() {
        if (this.cvs) {
            // console.log(this.cvs);
            // let temp = this; //bind it to use inside nested function
            var ctx = this.cvs.getContext("2d");
            ctx.lineWidth = 3;
            var drawing = false;
            var mousePos = { x: 0, y: 0 };
            var lastPos = mousePos;
            ///////////////////////////////
            ctx.beginPath();
            ctx.arc(250, 150, 100, 0.5 * Math.PI, 2.5 * Math.PI);
            ctx.lineTo(250, 350);
            ctx.lineTo(50, 220);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(450, 220);
            ctx.lineTo(250, 350);
            ctx.lineTo(250, 550);
            ctx.lineTo(400, 700);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(250, 550);
            ctx.lineTo(100, 700);
            ctx.stroke();
            ///////////////////////////////////

            this.cvs.addEventListener("mousedown", function(e) {
                drawing = true;
                lastPos = getMousePos(e);
                socket.emit("snowmanMouseDown", [lastPos, drawing]);
            });

            this.cvs.addEventListener("mouseup", function() {
                drawing = false;
                socket.emit("snowmanMouseUp", [{}, drawing]); //updateStartingPoint will be set to origin point. Empty obj so that It moves no way.
            });

            this.cvs.addEventListener("mousemove", function(e) {
                mousePos = getMousePos(e);
                renderCanvas();
                socket.emit("snowmanMouseMove", [mousePos, drawing]);
            });
            function getMousePos(mouseEvent) {
                return {
                    x: mouseEvent.offsetX,
                    y: mouseEvent.offsetY
                };
            }

            function renderCanvas() {
                if (drawing) {
                    ctx.beginPath();
                    ctx.moveTo(lastPos.x, lastPos.y);
                    ctx.lineTo(mousePos.x, mousePos.y);
                    ctx.stroke();
                    lastPos = mousePos; //this line makes sure the drawn line is continuous, the last coordinat back to first coordinate
                }
            }
        }
    }

    reset() {
        socket.emit("reset");
    }

    render() {
        const snowman = (
            <div className="row">
                <canvas
                    id="canvas"
                    ref={snowman => (this.cvs = snowman)}
                    width={500}
                    height={800}
                />
                <button onClick={this.reset}>Again</button>
            </div>
        );
        if (!this.props.startingCoordinate || !this.props.movingCoordinate) {
            //this handles undefined init array data
            // console.log("return none");
            return <div>{snowman}</div>;
        }
        //the following must be placed here so that, rerender occurs when props change
        var ctx2 = this.cvs.getContext("2d");
        ctx2.lineWidth = 3;
        ctx2.beginPath();
        ctx2.moveTo(
            this.updateStartingPoint[0].x || this.props.startingCoordinate[0].x,
            this.updateStartingPoint[0].y || this.props.startingCoordinate[0].y
        );
        ctx2.lineTo(
            this.props.movingCoordinate[0].x,
            this.props.movingCoordinate[0].y
        );
        ctx2.stroke();
        //the last coor is saved as starting coor
        // this.props.dispatch(start(this.props.movingCoordinate)); //cannot use this line because of infinite stateChange-render loop
        this.updateStartingPoint = this.props.movingCoordinate;
        if (this.props.movingCoordinate[1] === false) {
            this.updateStartingPoint = this.props.startingCoordinate;
        }
        return <div>{snowman}</div>;
    }
}

const mapStateToProps = function(state) {
    // console.log("start:", state.startingCoordinate);
    // console.log("end: ", state.movingCoordinate);
    return {
        startingCoordinate: state.startingCoordinate,
        movingCoordinate: state.movingCoordinate
    };
};

export default connect(mapStateToProps)(Snowman);
