import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import EditIcon from "../../assets/icons/EditBtn.svg";
import Pagination from "../../extra/Pagination";
import Button from "../../extra/Button";
import Table from "../../extra/Table";
import dayjs from "dayjs";
import { openDialog } from "../../store/dialogSlice";
import {  warning } from "../../util/Alert";
import { allVideo, deleteFakeVideo } from "../../store/videoSlice";
import { RootStore, useAppDispatch } from "../../store/store";
import Image from "next/image";
import { useRouter } from "next/router";
import { baseURL } from "@/util/config";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
import VideoDialogue from "./VideoDialogue";

interface VideoProps {
  startDate: string;
  endDate: string;
}

const Video: React.FC<VideoProps> = (props) => {
  const router = useRouter();
  const { realVideo, totalRealVideo } = useSelector(
    (state: RootStore) => state.video
  );
  const { dialogueType, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );


  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [selectCheckData, setSelectCheckData] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  useClearSessionStorageOnPopState("multiButton");
  const { startDate, endDate } = props;

  useEffect(() => {
    const payload: any = {
      type: "realVideo",
      start: page,
      limit: size,
      startDate: startDate,
      endDate: endDate,
    };
    dispatch(allVideo(payload));
  }, [page, size, startDate, endDate]);

  useEffect(() => {
    setData(realVideo);
  }, [realVideo]);

  const handleSelectCheckData = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: any
  ) => {

    const checked = e.target.checked;
    if (checked) {
      setSelectCheckData((prevSelectedRows) => [...prevSelectedRows, row]);
    } else {
      setSelectCheckData((prevSelectedRows) =>
        prevSelectedRows.filter((selectedRow) => selectedRow._id !== row._id)
      );
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    setSelectAllChecked(checked);
    if (checked) {
      setSelectCheckData([...data]);
    } else {
      setSelectCheckData([]);
    }
  };

  const handleEdit = (row: any) => {
    router.push({
      pathname: "/viewProfile",
      query: { id: row?.userId },
    });


    localStorage.setItem("postData", JSON.stringify(row));
  };

  const videoTable = [
    {
      Header: "NO",
      body: "name",
      Cell: ({ index }: { index: number }) => (
        <span>{(page - 1) * size + index + 1}</span>
      ),
    },
    {
      Header: "Video",
      body: "video",
      Cell: ({ row }: { row: any }) => (
        <>
          <button
            className="viewbutton mx-auto"
            onClick={() =>
              dispatch(openDialog({ type: "viewVideo", data: row }))
            }
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
      Header: "Image",
      body: "videoImage",
      Cell: ({ row }: { row: any }) => (
        <img
          src={baseURL + row?.videoImage}
          width="50px"
          height="50px"
          alt="Video Image"
        />
      ),
    },
    {
      Header: "User",
      body: "name",
      Cell: ({ row }: { row: any }) => (
        <div
          className="text-capitalize userText fw-bold d-flex align-items-center"
          style={{
            cursor: "pointer",
          }}
          onClick={() => handleEdit(row)}
        >
          <img src={baseURL + row?.userImage} width="50px" height="50px" />
          <span className="text-capitalize fw-bold ms-3 cursorPointer text-nowrap">
            {row?.name}
          </span>
        </div>
      ),
    },

    {
      Header: "Likes",
      body: "totalLikes",
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
          {row?.createdAt ? dayjs(row?.createdAt).format("DD MMMM YYYY") : ""}
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
              <Image src={EditIcon} alt="EditIcon" width={25} height={25} />
            }
            onClick={() => {
              dispatch(openDialog({ type: "fakeVideo", data: row }));
            }}
          />
          <Button
            btnIcon={
              <Image src={TrashIcon} alt="TrashIcon" width={25} height={25} />
            }
            onClick={() => handleDeleteVideo(row)}
          />
        </div>
      ),
    },
  ];

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value: number) => {
    setPage(1);
    setSize(value);
  };

  const handleDeleteVideo = (row: any) => {

    const data = warning();
    data
      .then((logouts: any) => {
        const yes = logouts;
        if (yes) {
          dispatch(deleteFakeVideo(row?._id));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="user-table mb-3">
        {dialogueType == "viewVideo" && <VideoDialogue />}
        <div className="user-table-top">
          <div className="row align-items-start">
            <div className="col-6">
              <h5
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginTop: "5px",
                  marginBottom: "4px",
                }}
              >
                Video
              </h5>
            </div>
          </div>
        </div>

        <Table
          data={data}
          mapData={videoTable}
          serverPerPage={size}
          serverPage={page}
          handleSelectAll={handleSelectAll}
          selectAllChecked={selectAllChecked}
          type={"server"}
        />
        <div className="mt-3">
          <Pagination
            type={"server"}
            activePage={page}
            rowsPerPage={size}
            userTotal={totalRealVideo}
            setPage={setPage}
            handleRowsPerPage={handleRowsPerPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Video;
