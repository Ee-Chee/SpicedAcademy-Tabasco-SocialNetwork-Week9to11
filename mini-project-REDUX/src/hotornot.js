import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { receiveUsers, makeHot, makeNot } from "./actions";

class HotOrNot extends React.Component {
    componentDidMount() {
        this.props.dispatch(receiveUsers());
    }
    render() {
        // console.log("what is this: ", this.props);
        const { usssers } = this.props;
        if (!usssers) {
            //to handle async behavior while waiting for axios getting data
            // console.log("return null");
            return null;
        }
        const user = usssers[0] && (
            <div className="user">
                <img src={usssers[0].image} />
                <div className="buttons">
                    <button
                        onClick={e =>
                            this.props.dispatch(makeHot(usssers[0].id))
                        }
                    >
                        Hot
                    </button>
                    <button
                        onClick={e =>
                            this.props.dispatch(makeNot(usssers[0].id))
                        }
                    >
                        Not
                    </button>
                </div>
            </div>
        );
        return (
            <div id="hot-or-not">
                {user || <div>Everybody is hot or not already!</div>}
                <nav>
                    <Link to="/hot">See who&apos;s hot</Link>
                    <Link to="/not">See who&apos;s not</Link>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        usssers: state.userrrs && state.userrrs.filter(user => user.hot == null)
    };
};
//everytime state changes, rerender
export default connect(mapStateToProps)(HotOrNot);
//connect store with components. states from store is passed to props to components
//Store stores all states data
//Provider&connect passes stored states data and make them accessible to all components
//Connect connects the state information held by Redux with React components
//By means of "connect", passing props using constructor is not necessary here
//Props also have a method dispatch (inherits from store) to pass action to Reduce to update the states and stored in "store"
////////////////////////Note for why we need state.users && in mapStateToProps function:
//To prevent undefined users data prompting error. state.users.filter is not working if state.users is undefined.
//eg. undefined && fhkudhgfdigdfgdf => undefined OR false && huashuhdahfdafhia => false OR "fadfdsfds" && "abcd" => "abcd"
//undefined users data happen everytime reloading because mounted() and render() are async.
//Although axios in Mounted() used to retrieve users data is a promised function but it is nested. So render() will run. Undefined users data obtained
//state.users && and if(!users) return null are used to handle this error
