import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import EditIcon from "../../assets/icons/EditBtn.svg";
import Pagination from "../../extra/Pagination";
import Button from "../../extra/Button";
import Table from "../../extra/Table";
import dayjs from "dayjs";
import { RootStore, useAppDispatch } from "../../store/store";
import { openDialog } from "../../store/dialogSlice";
import { allPost, deleteFakePost } from "../../store/postSlice";
import AddIcon from "@mui/icons-material/Add";
import {  warning } from "../../util/Alert";
import Image from "next/image";
import { baseURL } from "@/util/config";
import { useRouter } from "next/router";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
import PostDialogue from "./PostDialogue";

interface FakePostProps {
  startDate: string;
  endDate: string;
}

const FakePost: React.FC<FakePostProps> = (props) => {
  const router = useRouter();
  const { fakePostData, totalFakePost } = useSelector(
    (state: RootStore) => state.post
  );


  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectCheckData, setSelectCheckData] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  useClearSessionStorageOnPopState("multiButton");

  useEffect(() => {
    const payload: any = {
      type: "fakePost",
      start: page,
      limit: size,
      startDate: props.startDate,
      endDate: props.endDate,
    };
    dispatch(allPost(payload));
  }, [page, size, props.startDate, props.endDate]);

  useEffect(() => {
    setData(fakePostData);
  }, [fakePostData]);


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

    let dialogueData_ = {
      dialogue: true,
      dialogueData: row,
    };
    localStorage.setItem("postData", JSON.stringify(row));
    localStorage.removeItem("multiButton");
  };

  const postTable = [
    {
      Header: "NO",
      body: "NO",
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
            onClick={() =>
              dispatch(openDialog({ type: "viewPost", data: row }))
            }
          >
            <svg
              width="30"
              height="30"
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
      Header: "User",
      body: "planBenefit",
      Cell: ({ row }: { row: any }) => (
        <div
          className="d-flex align-items-center"
          style={{
            cursor: "pointer",
            display: "flex",
            columnGap: "20px",
          }}
          onClick={() => handleEdit(row)}
        >
          <img src={baseURL + row?.userImage} width="50px" height="50px" />
          <span className="text-capitalize fw-bold">
            {row?.userId?.name ? row?.userId?.name : row?.name}
          </span>
        </div>
      ),
    },

    {
      Header: "Share count",
      body: "shareCount",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.shareCount}</span>
      ),
    },
    {
      Header: "Likes",
      body: "totalLikes",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">
          {row?.totalLikes ? row?.totalLikes : 0}
        </span>
      ),
    },

    {
      Header: "Comments",
      body: "totalLikes",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">
          {row?.totalComments ? row?.totalComments : 0}
        </span>
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
              <Image src={EditIcon} alt="editIcon" width={25} height={25} />
            }
            onClick={() => {
              dispatch(openDialog({ type: "fakePost", data: row }));
            }}
          />
          <Button
            btnIcon={
              <Image src={TrashIcon} alt="TrashIcon" width={25} height={25} />
            }
            onClick={() => handleDeletePost(row)}
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

  return (
    <div>
      <div className="user-table mb-3">
        {dialogueType == "viewPost" && <PostDialogue />}

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
                Fake Post
              </h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <div className="ms-auto mt-2">
                <div className="new-fake-btn d-flex ">
                  <Button
                    btnIcon={<AddIcon />}
                    btnName={"New"}
                    onClick={() => {
                      dispatch(openDialog({ type: "fakePost" }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Table
          data={data}
          mapData={postTable}
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
            userTotal={totalFakePost}
            setPage={setPage}
            handleRowsPerPage={handleRowsPerPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default FakePost;
