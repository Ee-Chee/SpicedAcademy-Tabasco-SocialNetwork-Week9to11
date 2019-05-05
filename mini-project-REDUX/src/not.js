import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { makeHot, receiveUsers } from "./actions";

class Not extends React.Component {
    componentDidMount() {
        !this.props.usssers && this.props.dispatch(receiveUsers()); //!undefined => true. !this.props.usssers is not necessary here
    }
    render() {
        console.log(usssers);
        const { usssers } = this.props;
        if (!usssers) {
            return null;
        }
        const notUsers = (
            <div className="users">
                {usssers.map(user => (
                    <div className="user" key={user.id}>
                        <img src={user.image} />
                        <div className="buttons">
                            <button
                                onClick={e =>
                                    this.props.dispatch(makeHot(user.id))
                                }
                            >
                                Hot
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
        return (
            <div id="not">
                {!usssers.length && <div>Nobody is not hot!</div>}
                {!!usssers.length && notUsers}
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/hot">See who&apos;s hot</Link>
                </nav>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        usssers:
            state.userrrs &&
            state.userrrs.filter(user => user.hot != undefined && !user.hot)
        //user.hot != undefined to make sure no images appears on NOT-HOT page in the very beginning
    };
}

export default connect(mapStateToProps)(Not);
