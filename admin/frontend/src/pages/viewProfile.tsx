import RootLayout from "@/component/layout/Layout";
import React, { useEffect, useState } from "react";
import NewTitle from "../extra/Title";
import { useSelector } from "react-redux";
import { RootStore, useAppDispatch } from "@/store/store";
import Table from "@/extra/Table";
import Pagination from "@/extra/Pagination";
import { useRouter } from "next/router";
import { baseURL } from "@/util/config";
import Button from "@/extra/Button";
import Image from "next/image";
import TrashIcon from "../assets/icons/trashIcon.svg";
import { warning } from "@/util/Alert";
import { deleteFakePost, getUserPost } from "@/store/postSlice";
import PostDialogue from "@/component/post/PostDialogue";
import { closeDialog, openDialog } from "@/store/dialogSlice";
import VideoDialogue from "@/component/video/VideoDialogue";
import { deleteFakeVideo, getUserVideo } from "@/store/videoSlice";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
import UserProfile from "@/component/user/UserProfile";

export default function viewProfile(props) {
  useClearSessionStorageOnPopState("multiButton");

  const router = useRouter();
  console.log("router", router);
  const [multiButtonSelect, setMultiButtonSelect] = useState<string>("Profile");
  const { dialogueType, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );

  const [imageShow, setImageShow] = useState<string>("");
  const { userPostData } = useSelector((state: RootStore) => state.post);

  const { userVideoData } = useSelector((state: RootStore) => state.video);

  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);

  const postData =
    typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("postData")); 

    const userId = router?.query?.id
    const id =    typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("postData"));

  const dispatch = useAppDispatch();

  useEffect(() => {
    const payload: any = {
      start: page,
      limit: size,
      id: id?._id || userId,
    };
    dispatch(getUserPost(payload));
    dispatch(getUserVideo(id?._id || userId));
  }, [dispatch]);

  useEffect(() => {
    setImageShow(baseURL + postData?.image || "");
  }, [postData]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value: number) => {
    setPage(1);
    setSize(value);
  };

  const handlePostDetails = async (row: any) => {
    dispatch(openDialog({ type: "viewPost", data: row }));
  };

  const handleVideoDetails = async (row: any) => {
    dispatch(openDialog({ type: "viewVideo", data: row }));
  };

  const handleDeletePost = (row: any) => {
    const data = warning();
    data
      .then((logouts: any) => {
        if (logouts) {
          dispatch(deleteFakePost(row?._id));
        }
      })
      .catch((err: any) => console.log(err));
  };

  const handleDeleteVideo = (row: any) => {
    const data = warning();
    data
      .then((logouts: any) => {
        if (logouts) {
          dispatch(deleteFakeVideo(row?._id));
        }
      })
      .catch((err: any) => console.log(err));
  };

  const handleClose = () => {
    if (dialogueData) {
      dispatch(closeDialog());
    } else {
      router.back();
    }

    localStorage.setItem("multiButton", JSON.stringify("Fake User"));
  };

  const postTable = [
    {
      Header: "NO",
      body: "name",
      Cell: ({ index }: { index: number }) => (
        <span>{(page - 1) * size + index + 1}</span>
      ),
    },
    {
      Header: "image",
      body: "soundImage",
      Cell: ({ row }: { row: any }) => (
        <>
          <button
            className="viewbutton mx-auto"
            onClick={() => handlePostDetails(row)}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30 11.175H0V25C0 27.7625 2.2375 30 4.9875 30H25C27.75 30 30 27.7625 30 25V11.175ZM15.05 23.85H7.3125C6.6125 23.85 6.0625 23.3 6.0625 22.6C6.0625 21.9125 6.6125 21.35 7.3125 21.35H15.05C15.7375 21.35 16.3 21.9125 16.3 22.6C16.3 23.3 15.7375 23.85 15.05 23.85ZM22.7875 17.3H7.3125C6.6125 17.3 6.0625 16.7375 6.0625 16.05C6.0625 15.3625 6.6125 14.8 7.3125 14.8H22.7875C23.475 14.8 24.0375 15.3625 24.0375 16.05C24.0375 16.7375 23.475 17.3 22.7875 17.3ZM30 5C30 2.2375 27.75 0 25 0H4.9875C2.2375 0 0 2.2375 0 5V8.675H30V5ZM6.5375 5.4875C5.86625 6.02375 5.19875 5.91125 4.775 5.4875C4.65677 5.3719 4.56284 5.23384 4.4987 5.08144C4.43457 4.92903 4.40153 4.76535 4.40153 4.6C4.40153 4.43465 4.43457 4.27097 4.4987 4.11856C4.56284 3.96615 4.65677 3.8281 4.775 3.7125C4.97921 3.5084 5.24812 3.38179 5.53554 3.35442C5.82296 3.32704 6.11093 3.40062 6.35 3.5625C6.835 3.855 7.205 4.74625 6.5375 5.4875ZM11.2375 5.4875C10.5837 6.01 9.925 5.92625 9.4625 5.4875C8.92 4.885 9.05375 4.12125 9.4625 3.7125C9.925 3.25 10.775 3.25 11.2375 3.7125C11.6562 4.13 11.7875 4.87625 11.2375 5.4875ZM15.9375 5.4875C15.525 5.9 14.84 6.03125 14.1625 5.4875C13.9304 5.25039 13.8004 4.9318 13.8004 4.6C13.8004 4.2682 13.9304 3.94961 14.1625 3.7125C14.8337 3.1725 15.5087 3.28375 15.9375 3.7125C16.4062 4.18125 16.4338 4.9625 15.9375 5.4875Z"
                fill="white"
              />
            </svg>

            <span>View Post</span>
          </button>
        </>
      ),
    },

    {
      Header: "Likes",
      body: "Likes",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.totalLikes}</span>
      ),
    },

    {
      Header: "Comments",
      body: "Comments",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.totalComments}</span>
      ),
    },

    {
      Header: "Created date",
      body: "createdAt",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">
          {row?.createdAt ? row?.createdAt.split("T")[0] : ""}
        </span>
      ),
    },
    {
      Header: "Action",
      body: "action",
      Cell: ({ row }: { row: any }) => (
        <div className="action-button">
          <Button
            btnIcon={
              <Image src={TrashIcon} alt="trashIcon" width={25} height={25} />
            }
            onClick={() => handleDeletePost(row)}
          />
        </div>
      ),
    },
  ];

  const videoTable = [
    {
      Header: "NO",
      body: "name",
      Cell: ({ index }: { index: number }) => (
        <span>{(page - 1) * size + index + 1}</span>
      ),
    },
    {
      Header: "image",
      body: "soundImage",
      Cell: ({ row }: { row: any }) => (
        <>
          <button
            className="viewbutton mx-auto"
            onClick={() => handleVideoDetails(row)}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 34 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.2319 0.012207H3.71991C1.67396 0.012207 0 1.68617 0 3.73212V16.2682C0 18.3142 1.67396 19.9881 3.71991 19.9881H19.2319C21.2779 19.9881 22.9519 18.3142 22.9519 16.2682V3.73212C22.9519 1.64897 21.2779 0.012207 19.2319 0.012207ZM31.2473 2.05816C31.0241 2.09536 30.8009 2.20695 30.6149 2.31855L24.8118 5.66647V14.2967L30.6521 17.6446C31.7309 18.277 33.07 17.905 33.7024 16.8262C33.8884 16.4914 34 16.1194 34 15.7102V4.21571C34 2.83934 32.698 1.72337 31.2473 2.05816Z"
                fill="white"
              />
            </svg>

            <span>View Video</span>
          </button>
        </>
      ),
    },

    {
      Header: "Likes",
      body: "Likes",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.totalLikes}</span>
      ),
    },

    {
      Header: "Comments",
      body: "Comments",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.totalComments}</span>
      ),
    },

    {
      Header: "Created date",
      body: "createdAt",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">
          {row?.createdAt ? row?.createdAt.split("T")[0] : ""}
        </span>
      ),
    },
    {
      Header: "Action",
      body: "action",
      Cell: ({ row }: { row: any }) => (
        <div className="action-button">
          <Button
            btnIcon={
              <Image src={TrashIcon} alt="trashIcon" width={25} height={25} />
            }
            onClick={() => handleDeleteVideo(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {dialogueType == "viewPost" && <PostDialogue />}
      {dialogueType == "viewVideo" && <VideoDialogue />}
      {/* {dialogueType == "viewVideo" && <VideoDialogue />} */}
      <div
        className="dashboardHeader primeHeader mb-3 p-0 row align-items-center"
        style={{ padding: "20px" }}
      >
        <div className="col-10" style={{ padding: "5px" }}>
          <NewTitle
            dayAnalyticsShow={false}
            name={`viewProfile`}
            titleShow={false}
            multiButtonSelect={multiButtonSelect}
            setMultiButtonSelect={setMultiButtonSelect}
            labelData={["Profile", "Post", "Video"]}
          />
        </div>

        <div
          className="col-2"
          style={{ marginTop: "20px", display: "flex", justifyContent: "end" }}
        >
          <Button
            btnName={"Back"}
            newClass={"back-btn"}
            onClick={handleClose}
          />
        </div>
        {multiButtonSelect !== "Profile" ? (
          <Table
            data={multiButtonSelect == "Post" ? userPostData : userVideoData}
            mapData={multiButtonSelect == "Post" ? postTable : videoTable}
            serverPerPage={size}
            serverPage={page}
            type={"server"}
          />
        ) : (
          ""
        )}

        {multiButtonSelect === "Profile" && <UserProfile />}
      </div>
      <div className="mt-3">
        <Pagination
          type={"server"}
          activePage={page}
          rowsPerPage={size}
          // userTotal={totalRealPost}
          setPage={setPage}
          handleRowsPerPage={handleRowsPerPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

viewProfile.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};
