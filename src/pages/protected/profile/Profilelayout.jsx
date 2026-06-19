import { Avatar, Button, Chip, Stack, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import { FaInstagram } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useParams } from 'react-router-dom';
import { editProfileModel } from '../../../redux/slice';
import { useFollowUserMutation, useUserDetailsQuery } from '../../../redux/service';
import Editprofile from '../../../components/modals/Editprofile'



const Profilelayout = () => {
  const _300 = useMediaQuery("(min-width:300px)");
  const _500 = useMediaQuery("(min-width:500px)");

  const _700 = useMediaQuery("(min-width:700px)");

  const dispatch = useDispatch();

  const params = useParams();
  const {data} = useUserDetailsQuery(params?.id);
  const [followUser] =  useFollowUserMutation();
  const {darkMode , myInfo} = useSelector((state) => state.service);
  const myAccount = data?.user?._id === myInfo?._id;
  const isFollowing = Boolean(data?.user?.followers?.some((e) => e._id === myInfo?._id));

  const handleFollow = async () =>{
    if(data){
      await followUser(data.user._id);
    }
  };
  const handleOpenEditModel = () =>{
    dispatch(editProfileModel(true));
  }


  return (
   <>
   <Stack 
   flexDirection={'column'} gap={2} p={2} m={2}
   mx={'auto'}
   width={_700 ? '800px' :" 90%"} >
    <Stack 
    flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Stack flexDirection={'column'} gap={1} >
            <Typography 
            variant='h2' fontWeight={'bold'} fontSize={_300?'2rem':'1rem'}>{data ? data.user ?data.user.userName : '' :''}</Typography>
            <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
            
            <Typography 
            variant='h2' fontSize={_300? '1rem' : '0.8rem'}>{data ? data.user ?data.user.email : '' :''}</Typography>

            <Chip label='my.net' size="small" sx={{fontSize: _300?"0.8rem":'0.6rem'}}/>
            </Stack>


        </Stack>
        <Avatar src={data ? data.user ?data.user.profilePic : 'bio' :'bio'} alt={data ? data.user ?data.user.userName : '' :''} sx={{width:_300?60 :40, height:_300?60:40}}/>
    </Stack>
    <Typography variant='subtitled2'>{data ? data.user ? data.user.bio:'':''}</Typography>
    <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
      <Typography variant='subtitled2' color='gray'>{
        data ? data.user ? data.user.followers.length > 0 ? `${data.user.followers.length} followers`: 'No Followers':'':''
}</Typography>
      <FaInstagram size={_300?40:24}
      />
      
    </Stack>

   </Stack>

   <Button size='large' sx={{color:darkMode? 'whitesmoke' :'black' ,
   width:_700?'800px':'90%',
   margin:'0 auto',
   display:'block',
  
   textAlign:'center',
   border:'1px solid gray',
   borderRadius:'10px',
   ':hover':{
    cursor:'pointer',

   }


   }} onClick={myAccount ? handleOpenEditModel : handleFollow}>{myAccount ? 'Edit Profile' : isFollowing ? 'unfollow' : 'Follow user' }</Button>
   <Stack flexDirection={'row'} justifyContent={'space-evenly'} my={5}
   pb={2} borderBottom={'2px solid gray'}
   fontSize={_500?'1.2rem':_300?'1.1rem':"0.9rem"}
   width={_700?'800px':'90%'}
   mx={'auto'}
   
   > 
   <Link to={`/profile/threads/${data?.user._id}`} className={`link ${darkMode ? 'mode' :'' }`}>Posts</Link>
   <Link to={`/profile/replies/${data?.user._id}`} className={`link ${darkMode ? 'mode' :'' }`}>Replies</Link>
   <Link to={`/profile/repost/${data?.user._id}`} className={`link ${darkMode ? 'mode' :'' }`}>Reposts</Link>
   </Stack>
   <Outlet/>
   <Editprofile/>
   </>
   
  )
}

export default Profilelayout
