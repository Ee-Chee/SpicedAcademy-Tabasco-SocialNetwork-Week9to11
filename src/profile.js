import React from "react";
// import Avatar from "./avatar"; //not necessarry if we're using the short-cut approach here, i.e. passing the whole component in props.

export default function(props) {
    return (
        <div className="profile">
            {props.profilePic}
            <div className="profile-details">
                <div>
                    {props.firstN} {props.lastN}
                </div>
                {props.bio}
            </div>
        </div>
    );
}
