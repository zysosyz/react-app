import React from 'react'
import './Search.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

function Search() {
    const navigate = useNavigate()
    return (
        <div className='search'>
            <div className='search_con' onClick={() => {
                navigate('/search')
            }}>
                <FontAwesomeIcon icon={faMagnifyingGlass} beat />
                <input placeholder='请输入搜索关键词' />
            </div>
        </div>
    )
}

export default Search
