import { NavLink } from "react-router-dom";
import { PATH } from "../../router/PATH";

export function Sidebar() {
    return (
        <div className='d-flex flex-column border' style={{ width: '150px' }}>
            <NavLink className="py-2 mx-3 border-bottom" to={PATH.AWS_AUTH}> AWS Auth </NavLink>
            <NavLink className="py-2 mx-3 border-bottom" to={PATH.SPEECH_LIST}> Speech </NavLink>
        </div>
    );
};