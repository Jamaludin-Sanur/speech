import { createBrowserRouter } from "react-router-dom";
import { PATH } from "./PATH";
import { HomePage } from "../pages";
import {
    ListSpeech,
    CreateSpeech,
    EditSpeech,
    SetAwsAuth
} from "../containers"
export const browserRouter = () => createBrowserRouter([
    {
        path: PATH.HOME_PAGE,
        element: <HomePage />,
        children: [
            {
                path: '/',
                element: <SetAwsAuth />,
            },
            {
                path: PATH.AWS_AUTH,
                element: <SetAwsAuth />,
            },
            {
                path: PATH.SPEECH_LIST,
                element: <ListSpeech />,
            },
            {
                path: PATH.SPEECH_CREATE,
                element: <CreateSpeech />,
            },
            {
                path: PATH.SPEECH_EDIT,
                element: <EditSpeech />,
            },
        ],

    },
]);