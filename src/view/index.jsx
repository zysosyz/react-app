import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
function Index() {
    return (
        <div className='box' style={{height:'100%'}}>
            <Outlet />
            <Navbar />
        </div>
    )
}

export default Index
