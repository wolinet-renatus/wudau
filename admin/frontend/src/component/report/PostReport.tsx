import React, { useEffect, useState } from "react";
import Searching from "../../extra/Searching";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import { useSelector } from "react-redux";
import { deleteReport, getReport, solvedReport } from "../../store/reportSlice";
import dayjs from "dayjs";
import Button from "../../extra/Button";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import TrueArrow from "../../assets/icons/TrueArrow.svg";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {  warning } from "../../util/Alert";
import { RootStore, useAppDispatch } from "@/store/store";
import Image from "next/image";
import { baseURL } from "@/util/config";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";

const PostReport = (props) => {
  const { postReport, totalPostReport } = useSelector(
    (state: RootStore) => state.report
  );

  const startDate = props?.startDate;
  const endDate = props?.endDate;

  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(20);
  const [type, setType] = useState<any>("All");
  const [search, setSearch] = useState<string>();
  useClearSessionStorageOnPopState("multiButton");

  useEffect(() => {
    let payload: any = {
      start: page,
      limit: size,
      status: type,
      startDate: startDate,
      endDate: endDate,
      type: 2,
    };
    dispatch(getReport(payload));
  }, [page, size, , type, startDate, endDate]);

  useEffect(() => {
    setData(postReport);
  }, [postReport]);

  const postReportTable = [
    {
      Header: "NO",
      body: "no",
      Cell: ({ index }: { index: number }) => (
        <span className="  text-nowrap">{(page - 1) * size + index + 1}</span>
      ),
    },
    {
      Header: "Post image",
      body: "image",
      Cell: ({ row, index }: { row: any; index: number }) => (
        <img
          src={baseURL + row?.postImage}
          width="48px"
          height="48px"
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      Header: "Post id",
      body: "uniqueVideoId",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.uniqueId}</span>
      ),
    },

    {
      Header: "User",
      body: "userName",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.userName}</span>
      ),
    },
    {
      Header: "Post report reason",
      body: "reportType",
      Cell: ({ row }: { row: any }) => (
        <>{<span className="text-capitalize">{row?.reportReason}</span>}</>
      ),
    },
    {
      Header: "Status",
      body: "status",
      Cell: ({ row }: { row: any }) => (
        <>
          {row?.status === 1 && (
            <span className="text-capitalize badge badge-primary p-2">
              Pending
            </span>
          )}
          {row?.status === 2 && (
            <span className="text-capitalize badge badge-success p-2">
              Solved
            </span>
          )}
        </>
      ),
    },
    {
      Header: "Post reported",
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
          {row.status === 2 ? (
            ""
          ) : (
            <Button
              btnIcon={
                <Image src={TrueArrow} alt="TrueArrow" width={25} height={25} />
              }
              onClick={() => handleSolved(row?._id)}
            />
          )}
          <Button
            btnIcon={
              <Image src={TrashIcon} alt="TrashIcon" width={25} height={25} />
            }
            onClick={() => handleDeleteReport(row)}
          />
        </div>
      ),
    },
  ];

  const selectType = (type: number) => {
    setType(type);
  };

  const handleFilterData = (filteredData: any) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value: number) => {
    setPage(1);
    setSize(value);
  };

  const handleSolved = (id: any) => {


    const payload: any = {
      reportId: id,
      reportType: 2,
    };
    dispatch(solvedReport(payload));
  };

  const handleDeleteReport = (row: any) => {


    const data = warning();
    data
      .then((logouts: any) => {
        if (logouts) {
          const payload: any = {
            reportId: row?._id,
            reportType: 2,
          };
          dispatch(deleteReport(payload));
        }
      })
      .catch((err: any) => console.log(err));
  };

  return (
    <>
      <div className="userPage p-0">
        <div className="payment-setting-box user-table ">
          <div style={{ padding: "12px", position: "relative" }}>
            <h5
              style={{
                fontWeight: "500",
                fontSize: "20px",
                marginBottom: "5px",
                marginTop: "5px",
                padding: "3px",
              }}
            >
              Post Report Table
            </h5>
            <Searching
              placeholder={"Search..."}
              data={postReport}
              label={"Search for ID, Keyword, Username,Name,Title,Reported "}
              type={"client"}
              setData={setData}
              onFilterData={handleFilterData}
              searchValue={search}
              actionShow={false}
            />
            <div style={{ position: "absolute", top: "50%", right: "6px" }}>
              <FormControl sx={{ width: "100px" }}>
                <InputLabel
                  id="demo-simple-select-label"
                  style={{
                    fontWeight: "500",
                    fontSize: "17px",
                    marginBottom: "10px",
                  }}
                >
                  Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  label="Type"
                  onChange={(e) => selectType(e.target.value as number)}
                >
                  <MenuItem value="All" key="All">
                    All
                  </MenuItem>
                  <MenuItem value={1} key="Pending">
                    Pending
                  </MenuItem>
                  <MenuItem value={2} key="Solved">
                    Solved
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="mt-3">
            <Table
              data={data}
              mapData={postReportTable}
              serverPerPage={size}
              serverPage={page}
              type={"server"}
            />
            <div className="mt-3">
              <Pagination
                type={"server"}
                activePage={page}
                rowsPerPage={size}
                userTotal={totalPostReport}
                setPage={setPage}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostReport;
