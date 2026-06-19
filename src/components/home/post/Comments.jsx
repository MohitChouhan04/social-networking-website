
import {Avatar, Stack, Typography, useMediaQuery ,Menu , MenuItem} from '@mui/material'
import { useState } from 'react';
import { IoIosMore } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useDeleteCommentMutation, useSinglePostQuery } from '../../../redux/service';
const Comments = ({e , postId} ) => {
    const [anchorEl , setAnchorEl] = useState(null);
    const {darkMode , myInfo} = useSelector((state=>state.service));
    const _700 = useMediaQuery("(min-width:700px)");
    const [deleteComment] = useDeleteCommentMutation();
    const {refetch} = useSinglePostQuery(postId);
    const isAdmin = e?.admin?._id === myInfo?._id;

    const handleDeletcomment= async () =>{
        const info = {
            postId,
            id: e?._id,
        };
        await deleteComment(info);
        handleclose();
        refetch();
    };
    const handleclose = () => {
        setAnchorEl(null);
    };
   
  return (
    <>
    <Stack flexDirection={'row'} justifyContent={'space-between'} px={2}
    pb={4}
    borderBottom={'1px solid gray'}
    margin={'0 auto'}
    // display={'block'}
    width={'90%'}
    >
        <Stack flexDirection={'row'} gap={_700?2 :1}>
            <Avatar src={e? e.admin.profilePic : ''}  alt={e? e.admin.userName : ''}/>
            <Stack flexDirection={'column'}
            >
                <Typography variant='h6' fontWeight={'bold'} fontSize={'0.9rem'}>={e? e.admin.userName : ''}</Typography>
                <Typography variant='subtitled2' fontSize={'0.9rem'}>
                    ={e? e.text : ''}
                </Typography>

            </Stack>

        </Stack>
        <Stack 
        flexDirection={'row'} 
        gap={1} 
        alignItems={'center'} 
        color={darkMode?'white':'GrayText'} 
        fontSize={'0.9rem'}
        >
            <p>24min</p>
           {
            isAdmin ?  <IoIosMore size={_700 ?28:20} onClick={(e)=>setAnchorEl(e.currentTarget)} className='image-icon'/> :
             <IoIosMore size={_700 ?28:20} className='image-icon'/>
           }

        </Stack>

    </Stack>
    <Menu
          anchorEl={anchorEl}
          open={anchorEl!==null? true:false}
          onClose={handleclose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <MenuItem onClick={handleDeletcomment}>Delete</MenuItem>
        </Menu>
    </>
  )
}

export default Comments
