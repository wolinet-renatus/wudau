import RootLayout from "@/component/layout/Layout";
import Button from "@/extra/Button";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { RootStore, useAppDispatch } from "@/store/store";
import { openDialog } from "@/store/dialogSlice";
import { useSelector } from "react-redux";
import { Store } from "@reduxjs/toolkit";
import CreateLiveVideo from "@/component/liveVideo/CreateLiveVideo";
import Table from "@/extra/Table";
import {
  activeVideo,
  deleteLiveFakeVideo,
  getLiveVideo,
} from "@/store/liveVideoSlice";
import Pagination from "@/extra/Pagination";
import NewTitle from "../extra/Title";
import { baseURL } from "@/util/config";
import VideoDialogue from "@/component/video/VideoDialogue";
import EditIcon from "../assets/icons/EditBtn.svg";
import Image from "next/image";
import ToggleSwitch from "@/extra/ToggleSwitch";
import {  warning } from "@/util/Alert";
import TrashIcon from "@/assets/icons/trashIcon.svg";

export default function liveVideo() {

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const dispatch = useAppDispatch();
  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);
  const [startDate, setStartDate] = useState<string>("All");
  const [endDate, setEndDate] = useState<string>("All");
  const { liveVideoData, totalLiveVideo } = useSelector(
    (state: RootStore) => state.liveVideo
  );

  useEffect(() => {
    const payload: any = {
      start: page,
      limit: size,
      startDate: startDate,
      endDate: endDate,
    };
    dispatch(getLiveVideo(payload));
  }, [dispatch, page, size, startDate, endDate]);

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
          dispatch(deleteLiveFakeVideo(row?._id));
        }
      })
      .catch((err) => console.log(err));
  };

  const liveVideoTable = [
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
      Header: "User",
      body: "name",
      Cell: ({ row }) => (
        <div
          className="d-flex align-items-center "
          style={{ cursor: "pointer" }}
          // onClick={() => handleEdit(row, "manageUser")}
        >
          <img src={baseURL + row?.userImage} width="50px" height="50px" />
          <span className="text-capitalize fw-bold ms-3 cursorPointer text-nowrap">
            {row?.name}
          </span>
        </div>
      ),
    },

    {
      Header: "Is Live",
      body: "isActive",
      sorting: { type: "client" },
      Cell: ({ row }: { row: any }) => (
        <ToggleSwitch
          value={row?.isLive}
          onClick={() => {
            const id: any = row?._id;
            
            dispatch(activeVideo(id));
          }}
        />
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
              dispatch(openDialog({ type: "liveVideo", data: row }));
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

  return (
    <>
      <div className="dashboardHeader primeHeader mb-3">
        <NewTitle
          dayAnalyticsShow={true}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          startDate={startDate}
          endDate={endDate}
          name={`liveVideo`}
        />
      </div>
      {dialogueType == "liveVideo" && <CreateLiveVideo />}
      {dialogueType == "viewVideo" && <VideoDialogue />}

      <div className="user-table-top user-table">
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
              Live Video
            </h5>
          </div>
          <div
            className="col-6 d-flex justify-content-end"
            style={{ paddingRight: "20px", paddingTop: "20px" }}
          >
            <div className="ms-auto mt-2">
              <div className="new-fake-btn d-flex ">
                <Button
                  btnIcon={<AddIcon />}
                  btnName={"New"}
                  onClick={() => {
                
                    dispatch(openDialog({ type: "liveVideo" }));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <Table
          data={liveVideoData}
          mapData={liveVideoTable}
          serverPerPage={size}
          serverPage={page}
          type={"server"}
        />

        <Pagination
          type={"server"}
          activePage={page}
          rowsPerPage={size}
          userTotal={totalLiveVideo}
          setPage={setPage}
          handleRowsPerPage={handleRowsPerPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  );
}

liveVideo.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};
