import React, { useEffect, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import Input from '../../components/home/Input'
import Post from '../../components/home/Post'
import Loading from '../../components/Common/Loading'
import {Button } from '@mui/material'
import { useAllPostQuery } from '../../redux/service'
import { useSelector } from 'react-redux'

const Home = () => {
  const [page , setPage] = useState(1);
  const [showMore , setShowMore] = useState(true);
  const {data ,isLoading} = useAllPostQuery(page);
  const {allPosts} = useSelector(state=>state.service);
  useEffect(() => {
    if(data){
      if(data.posts.length < 3){
        setShowMore(false);
      }

    }
  } ,[data])

  
  return (
    <>
    <Input/>
    <Stack flexDirection={'column'} gap={2} mb={10} >
      {
        allPosts ? allPosts.length > 0 ? allPosts.map((e)=>{
          return <Post key={e._id} e={e}/>;
        }
      )
           : <Typography variant='h6' textAlign={'center'} mb={5}>No Post yet!</Typography>
           :isLoading?<Loading/> : null
      }
 
    </Stack>
    {
      showMore ? 
          <Button size="large" sx={{my:5 , p:3 , textDecoration:"underline", cursor:'pointer'}} ></Button>
          : allPosts?.length > 0 && 
          <Typography variant='caption' textAlign={'center'}>You have reached the end !</Typography>
    }

    </>
  )
}

export default Home