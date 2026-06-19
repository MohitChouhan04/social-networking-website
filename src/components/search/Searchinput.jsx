import { useEffect, useState } from 'react'
import {InputAdornment, TextField} from '@mui/material'
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useLazySearchUserQuery } from '../../redux/service';
import { addToSearchedUsers } from '../../redux/slice';
const Searchinput = () => {
    const {darkMode} = useSelector((state)=>state.service);
    const [query , setQuery] = useState('');

    const [searchUser , searchUserData] = useLazySearchUserQuery();
    const dispatch = useDispatch();

    const handleSearch = async (e) =>{
        if(query && e.key === 'Enter'){
            await searchUser(query);
        }

    };
    useEffect(()=>{
        if(searchUserData.isSuccess && searchUserData.data){
            dispatch(addToSearchedUsers(searchUserData.data.users));
        }
    },[searchUserData.isSuccess, searchUserData.data, dispatch])
  return (
    <>

    <TextField sx={{
        width:'90%',
        maxWidth:'750px',
        boxShadow:'5px 5px 5px grey',
       
        borderRadius:'15px',
        px:2,
        py:1,
        my:5,
        mx:'55rem',

        '& .MuiOutlinedInput-root':{
            color:darkMode?'whitesmoke':'black',
            '& fieldset':{
                border:'none',

            },
        },

    }}
    placeholder='search user..'
    InputProps={{
        startAdornment:(
            <InputAdornment position='start' sx={{color:darkMode?'whitesmoke':'black'}}>
            <FaSearch size={28}/>
            </InputAdornment>
        ),
    }} 
    onChange={(e) => setQuery(e.target.value)}
    onKeyUp={handleSearch}
    />
  
    </>
  )
}

export default Searchinput;
