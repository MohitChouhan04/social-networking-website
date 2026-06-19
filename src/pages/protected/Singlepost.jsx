import React, { useEffect, useState } from 'react'
import { Stack, TextField } from '@mui/material'
import Post from '../../components/home/Post'
import Comments from '../../components/home/post/Comments'
import { useParams } from 'react-router-dom'
import { useAddCommentMutation, useSinglePostQuery } from '../../redux/service'
const Singlepost = () => {
  const params = useParams();
  // console.log(params);
  const [comment ,setCommment] = useState('');
  const {data , refetch} = useSinglePostQuery(params?.id);
  const [addComment , addCommentData] = useAddCommentMutation();
  const handleAddComment = async (e) =>{
    if(data && e.key === 'Enter'){
      const info = {
        id: data.post._id,
        text : comment,
      };
      await addComment(info);

    }
  };
  useEffect(() => {
    if(addCommentData.isSuccess){
      setCommment('');
      refetch();
    }
  }, [addCommentData.isSuccess, refetch]);







  return (
    <>
    <Stack flexDirection={'column'} my={5} gap={2}>
        <Post e={data?.post }/>

        <Stack flexDirection={'column'} gap={2} width={'80%'} mx={'auto'}>
            {
              data ? data?.post.comments?.length > 0 ? 
              data.post.comments.map((e)=>{
                return <Comments key={e._id} e={e} postId ={data?.post._id}/>;
              }):null:null
            }
        </Stack>
        <TextField variant='outlined' autoFocus placeholder='comment here...' id='comment' sx={{width:'50%',
          margin:'0 auto', 
          my:5,
          p:1
         

        } }
        onChange={(e)=>setCommment(e.target.value)}
        onKeyUp={handleAddComment}
        value={comment ? comment : ''}
        />


    </Stack>
    </>
  )
}

export default Singlepost
