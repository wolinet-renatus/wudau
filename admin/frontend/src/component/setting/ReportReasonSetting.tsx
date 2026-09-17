import Button from "@/extra/Button";
import Input from "@/extra/Input";
import {
  deleteReportSetting,
  getReportSetting,
  getSetting,
  settingSwitch,
  updateSetting,
} from "@/store/settingSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { useTheme } from "@emotion/react";
import { FormControlLabel, Switch, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { openDialog } from "@/store/dialogSlice";
import ReportReasonDialogue from "../reportreason/ReportReasonDialogue";
import Table from "@/extra/Table";
import Image from "next/image";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import EditIcon from "../../assets/icons/EditBtn.svg";
import {  warning } from "@/util/Alert";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";


type ThemeType = "dark" | "light";
const ReportReasonSetting = () => {
  const { settingData } = useSelector((state: RootStore) => state.setting);


  const dispatch = useAppDispatch();

  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);

  const [size, setSize] = useState(20);
  const [page, setPage] = useState(1);
  useClearSessionStorageOnPopState("multiButton");

  const theme: any = useTheme() as ThemeType;

  useEffect(() => {
    const payload: any = {};
    dispatch(getReportSetting(payload));
  }, [dispatch]);

  const handleDelete = (row) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          const id = row?._id;
          dispatch(deleteReportSetting(id));
        }
      })
      .catch((err) => console.log(err));
  };

  const reportReasonTable = [
    {
      Header: "No",
      body: "name",
      Cell: ({ index }) => <span>{index + 1}</span>,
    },
    {
      Header: "Title",
      body: "name",
      Cell: ({ row }) => <span className="text-capitalize">{row?.title}</span>,
    },

    {
      Header: "Action",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={
              <Image src={EditIcon} alt="Edit Icon" width={25} height={25} />
            }
            onClick={() => {
              dispatch(openDialog({ type: "editreportreason", data: row }));
            }}
          />

          <Button
            btnIcon={
              <Image src={TrashIcon} alt="Trash Icon" width={25} height={25} />
            }
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {dialogueType == "reportreason" && <ReportReasonDialogue />}
      {dialogueType == "editreportreason" && <ReportReasonDialogue />}

      <div className="payment-setting p-0">
        <div className="payment-setting-box">
          <div className="row" style={{ padding: "19px" }}>
            <div className="col-6">
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 mt-2 m-sm-0 new-fake-btn">
                <Button
                  btnIcon={<AddIcon />}
                  btnName={"New"}
                  onClick={() => {
                    dispatch(openDialog({ type: "reportreason" }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row px-4 pb-4">
            <div className="col-1fake2">
              <div className="withdrawal-box">
                <h6>Report Reason Setting</h6>
                <Table
                  data={settingData}
                  mapData={reportReasonTable}
                  PerPage={size}
                  Page={page}
                  type={"client"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportReasonSetting;
