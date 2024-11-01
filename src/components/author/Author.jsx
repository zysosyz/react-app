import React from 'react'
import { Navigate } from 'react-router-dom'
function Author(props) {
    let { Oldpath, OldElement } = props
    let token = localStorage.getItem('token')
    // console.log(OldElement);
    if (token) {
        return (
            <>
                {OldElement}
            </>
        )
    }
    return (
        <Navigate to={`/login?redirectUrl=${Oldpath}`} replace={true}></Navigate>
    )
}

export default Author
