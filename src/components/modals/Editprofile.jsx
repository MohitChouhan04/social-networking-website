import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { editProfileModel } from "../../redux/slice";
import { useParams } from "react-router-dom";
import { useUpdateProfileMutation, useUserDetailsQuery } from "../../redux/service";
import Loading from '../Common/Loading'


const Editprofile = () => {
  const {openEditProfileModel , myInfo} = useSelector(state => state.service);
  const _700 = useMediaQuery("(min-width:700px)");

  const [pic, setPic] = useState();
  const [bio, setBio] = useState();
  const params = useParams();
  const imgRef = useRef();
  const dispatch = useDispatch();
  const [updateProfile , updateProfileData] = useUpdateProfileMutation();
  const {refetch} = useUserDetailsQuery(params?.id);
  const handlephoto = () => {
    imgRef.current.click();
  };

  const handleclose = () => {
    dispatch(editProfileModel(false))
  };
  const handleupdate = async () => {
    if(pic || bio){
      const data = new FormData();
      if(bio){
        data.append('text' , bio);

      }
      if(pic){
        data.append('media' , pic);
        
      }
      await updateProfile(data);
    }
    dispatch(editProfileModel(false));
  };
  useEffect(()=>{
    if(updateProfileData.isSuccess){
      refetch();
    }
  },[updateProfileData.isSuccess, refetch]);
  return (
    <>
      <Dialog
        open={openEditProfileModel}
        onClose={handleclose}
        fullWidth
        fullScreen={_700 ? false : true}
      >
        {
          updateProfileData.isLoading?<Stack height={'60vh'}> 
          <Loading/>

          </Stack> :
          <>
          
        
        <Box position={"absolute"} top={20} right={20} onClick={handleclose}>
          <ImCross size={28} className="image-icon"/>
        </Box>
        <DialogTitle textAlign={"center"} mb={5}>
          Edit profile
        </DialogTitle>

        <DialogContent>
          <Stack flexDirection={"column"} gap={1}>
            <Avatar
              src={pic ? URL.createObjectURL(pic) : myInfo ? myInfo.profilePic : ''}
              alt={myInfo ? myInfo.userName : ' '}
              sx={{ width: 96, height: 96, alignSelf: "center" }}
            />
            <Button
              size="large"
              sx={{
                border: "2px solid gray",
                borderRadius: "10px",
                width: 96,
                height: 40,
                alignSelf: "center",
                my: 2,
                ":hover": {
                  cursor: "pointer",
                },
              }}
              onClick={handlephoto}
            >
              Change
            </Button>

            <input
              type="file"
              className="file-input"
              accept='image/*'
              ref={imgRef}
              onChange={(e) => setPic(e.target.files[0])}
            />
            <Typography
              variant="subtitled"
              fontWeight={"bold"}
              fontSize={"1.2rem"}
              my={2}
            >
            
              Username
            </Typography>

            <input
              type="text"
              value={myInfo ? myInfo.userName : ''}
              readOnly
              className="text1"
            />
          </Stack>
          <Stack flexDirection={"column"} gap={1}>
            <Typography
              variant="subtitled"
              fontWeight={"bold"}
              fontSize={"1.2rem"}
              my={2}
            >
              {" "}
              email
            </Typography>

            <input
              type="text"
              value={myInfo ? myInfo.email : ''}
              readOnly
              className="text1"
            />
          </Stack>
          <Stack flexDirection={"column"} gap={1}>
            <Typography
              variant="subtitled"
              fontWeight={"bold"}
              fontSize={"1.2rem"}
              my={2}
            >
              {" "}
              Bio
            </Typography>

            <input
              type="text"
              
            
              className="text1 "
              placeholder={myInfo ? myInfo.bio : ' '}
              value={bio ? bio : ''}
              onChange={(e) => setBio(e.target.value)}
            />
          </Stack>
          <Button
            size="large"
            sx={{
              border: "2px solid gray",
              borderRadius: "10px",
              bgcolor: "GrayText",
              color: "white",
              width: "100%",
              my: 2,
              fontSize: "1.2rem",
              ":hover": { cursor: "pointer", bgcolor: "gray" },
            }}
            onClick={handleupdate}
          >
            Update
          </Button>
        </DialogContent>
          </>
        }
      </Dialog>
    </>
  );
};

export default Editprofile;
