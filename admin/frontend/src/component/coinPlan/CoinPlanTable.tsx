import Button from "@/extra/Button";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import ToggleSwitch from "@/extra/ToggleSwitch";
import {
  activeCoinPlan,
  deleteCoinPlan,
  getAllCoinPlan,
} from "@/store/coinPlanSlice";
import { openDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch, useAppSelector } from "@/store/store";
import {  warning } from "@/util/Alert";
import dayjs from "dayjs";
import NewTitle from "../../extra/Title";
import Image from "next/image";
import EditIcon from "../../assets/icons/EditBtn.svg";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "@/extra/Button";
import AddIcon from "@mui/icons-material/Add";
import { baseURL } from "@/util/config";

const CoinPlanTable = () => {
  const { dialogue, dialogueType, dialogueData } = useAppSelector(
    (state: RootStore) => state.dialogue
  );

  const { coinPlan } = useSelector((state: RootStore) => state.coinPlan);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  useEffect(() => {
    dispatch(getAllCoinPlan());
  }, [dispatch]);

  useEffect(() => {
    setData(coinPlan);
  }, [coinPlan]);


  const coinPlanTable = [
    {
      Header: "NO",
      body: "name",
      Cell: ({ index }) => <span>{index + 1}</span>,
    },

    {
      Header: "Icon",
      body: "icon",
      Cell: ({ row }) => (
        <img
          src={baseURL + row?.icon}
          width="50px"
          height="50px"
        />
      ),
    },
    {
      Header: "Coin",
      body: "coin",
      Cell: ({ row }) => <span className="text-capitalize">{row?.coin}</span>,
    },

    {
      Header: "Amount",
      body: "amount",
      Cell: ({ row }) => <span className="text-capitalize">{row?.amount}</span>,
    },
    {
      Header: "Product key",
      body: "productKey",
      Cell: ({ row }) => (
        <span className="">{row?.productKey ? row?.productKey : "-"}</span>
      ),
    },

    {
      Header: "Is Active",
      body: "isActive",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isActive}
          onChange={() => handleIsActive(row)}
        />
      ),
    },
    {
      Header: "Created date",
      body: "createdAt",
      Cell: ({ row }) => (
        <span className="text-capitalize">
          {row?.createdAt ? dayjs(row?.createdAt).format("DD MMMM YYYY") : ""}
        </span>
      ),
    },
    {
      Header: "Action",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <CustomButton
            btnIcon={
              <Image
                src={EditIcon}
                alt="Edit Icon"
                width={25}
                height={25}
              />
            }
            onClick={() => handleEditCoinPlan(row)}
          />
        
        </div>
      ),
    },
  ];

  const handleOpenNew = (type: any) => {
    dispatch(openDialog({ type: "coinPlan" }));

    let dialogueData_ = {
      dialogue: true,
      type: type,
    };
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData_));
  };

  const handleEditCoinPlan = (data: any) => {
    dispatch(openDialog({ type: "coinPlan", data: data }));
  };

  const handleIsActive = (row: any) => {

    let payload: any = {
      coinPlanId: row?._id,
    };
    dispatch(activeCoinPlan(payload));
  };
  return (
    <div className="userPage withdrawal-page">
      <div className="dashboardHeader primeHeader mb-3 p-0">
        <NewTitle
          dayAnalyticsShow={false}
          titleShow={true}
          name={`coinPlan`}
        />
      </div>
      <div className="payment-setting-box user-table">
        <div className="row align-items-center mb-2 p-3 ml-1">
          <div className="col-12 col-sm-6 col-md-6 col-lg-6"></div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 mt-2 m-sm-0 new-fake-btn d-flex justify-content-end">
            <Button
              btnIcon={<AddIcon />}
              newClass={"rounded"}
              btnName={"New"}
              onClick={() => handleOpenNew("coinPlan")}
            />
          </div>
        </div>
        <div className="mt-3">
          <Table
            data={data}
            mapData={coinPlanTable}
            PerPage={size}
            Page={page}
            type={"client"}
          />
          <div className="mt-3">
            <Pagination
              type={"client"}
              activePage={page}
              rowsPerPage={size}
              userTotal={coinPlan?.length}
              setPage={setPage}
              setData={setData}
              data={data}
              actionShow={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinPlanTable;
