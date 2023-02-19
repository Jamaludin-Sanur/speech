import Card from 'react-bootstrap/Card';
import { PATH } from '../../router/PATH';
import { NavLink } from "react-router-dom";
import { CommonUtility } from '../../utilities';

export const CardSpeech = ({ speech, onClickDelete }) => {
    if (!speech) return null;
    return (
        <Card className='mb-4'>
            <Card.Body className='d-flex justify-content-between'>
                <span>{CommonUtility.excludeExtension(speech)}</span>
                <div className='d-flex'>
                    <NavLink className='me-3' to={PATH.SPEECH_EDIT + "?id=" + speech}>
                        Edit
                    </NavLink>
                    <NavLink onClick={() => onClickDelete(speech)}>
                        Delete
                    </NavLink>
                </div>
            </Card.Body>

        </Card>
    )
}