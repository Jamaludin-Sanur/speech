import { createContext, useState, useEffect } from 'react';
const items = JSON.parse(localStorage.getItem('AWS_AUTH'));

export const AWSContext = createContext({
    auth: {
        accessKey: '',
        secretKey: '',
        bucketName: '',
    },
    setAuth: () => { }
});

export const AWSContextProvider = ({ children }) => {

    const [auth, setAuth] = useState({
        accessKey: items?.accessKey || '',
        secretKey: items?.secretKey || '',
        bucketName: items?.bucketName || '',
    });

    useEffect(() => {
        localStorage.setItem('AWS_AUTH', JSON.stringify(auth))
    }, [auth])

    return (
        <AWSContext.Provider value={{ auth, setAuth }}>
            {children}
        </AWSContext.Provider>
    )
}