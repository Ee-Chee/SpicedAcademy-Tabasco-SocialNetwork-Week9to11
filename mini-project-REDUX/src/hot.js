import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { makeNot, receiveUsers } from "./actions";

class Hot extends React.Component {
    componentDidMount() {
        !this.props.usssers && this.props.dispatch(receiveUsers()); //!undefined => true. !this.props.usssers is not necessary here
    }
    render() {
        const { usssers } = this.props;
        if (!usssers) {
            return null;
        }
        const hotUsers = (
            <div className="users">
                {usssers.map(user => (
                    <div className="user" key={user.id}>
                        <img src={user.image} />
                        <div className="buttons">
                            <button
                                onClick={e =>
                                    this.props.dispatch(makeNot(user.id))
                                }
                            >
                                Not
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
        return (
            <div id="hot">
                {!usssers.length && <div>Nobody is hot!</div>}
                {!!usssers.length && hotUsers}
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/not">See who&apos;s not</Link>
                </nav>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        usssers: state.userrrs && state.userrrs.filter(user => user.hot)
    };
}

export default connect(mapStateToProps)(Hot);
