export default function(state = {}, action) {
    if (action.type == "RECEIVE_USERS") {
        state = {
            ...state,
            userrrs: action.users //action.users is an array check index.js
        };
    }
    if (action.type == "MAKE_HOT" || action.type == "MAKE_NOT") {
        state = {
            ...state,
            userrrs: state.userrrs.map(user => {
                //each user here is an object and wrapped in an array, ie state.userrrs see above. It is from action.users
                if (user.id != action.id) {
                    return user;
                }
                return {
                    ...user,
                    hot: action.type == "MAKE_HOT" //it is false in the case of "MAKE_NOT"
                };
            })
        };
    }
    return state;
}

//everytime state changes, rerender
//Reducers must be a pure function. That means they can have no side effects. They can't change anything that they did not create themselves.
//if state is undefined, it takes default which is {}
//see object.assign example on MDN to understand how state data is replaced and updated
