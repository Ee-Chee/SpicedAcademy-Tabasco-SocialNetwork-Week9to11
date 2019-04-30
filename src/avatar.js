import React from "react";

export default function Avatar(props) {
    return (
        <img
            onClick={props.clickHandler}
            src={props.imageUrl || "default-user.png"}
            height={props.hi}
            width={props.wif}
        />
    );
}

//export default function ProfilePic({ image, first, last, clickHandler }) {
//     return <img onClick={clickHandler} src={image || '/default.jpg'} />
// }
