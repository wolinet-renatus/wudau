import Button from "@/extra/Button";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import ToggleSwitch from "@/extra/ToggleSwitch";
import {
  deleteCurrency,
  getAllCurrency,
  setDefaultCurrency,
} from "@/store/currencySlice";
import { RootStore, useAppDispatch, useAppSelector } from "@/store/store";
import {  warning } from "@/util/Alert";
import dayjs from "dayjs";
import NewTitle from "../../extra/Title";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import EditIcon from "../../assets/icons/EditBtn.svg";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { openDialog } from "@/store/dialogSlice";
import CustomButton from "@/extra/Button";
import Image from "next/image";

const CurrencyTable = () => {
  const { currency } = useSelector((state: RootStore) => state.currency);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  useEffect(() => {
    dispatch(getAllCurrency());
  }, [dispatch]);

  useEffect(() => {
    setData(currency);
  }, [currency]);


  const handleDeleteCurrency = (id: any) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          dispatch(deleteCurrency(id));
        }
      })
      .catch((err) => console.log(err));
  };

  const contactUsTable = [
    {
      Header: "NO",
      body: "name",
      Cell: ({ index }) => <span>{index + 1}</span>,
    },

    {
      Header: "Name",
      body: "name",
      Cell: ({ row }) => <span className="text-capitalize">{row?.name}</span>,
    },

    {
      Header: "Symbol",
      body: "symbol",
      Cell: ({ row }) => <span className="text-capitalize">{row?.symbol}</span>,
    },
    {
      Header: "Currency code",
      body: "currencyCode",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.currencyCode}</span>
      ),
    },
    {
      Header: "Country code",
      body: "countryCode",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.countryCode}</span>
      ),
    },
    {
      Header: "Is Default",
      body: "isActive",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isDefault}
          disabled={row?.isDefault === true ? true : false}
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
              <Image src={EditIcon} alt="Edit Icon" width={25} height={25} />
            }
            onClick={() => handleEditCurrency(row)}
          />
          <CustomButton
            btnIcon={
              <Image src={TrashIcon} alt="Trash Icon" width={25} height={25} />
            }
            onClick={() => handleDeleteCurrency(row?._id)}
          />
        </div>
      ),
    },
  ];

  const handleOpenNew = (type: any) => {
    dispatch(openDialog({ type: "currency" }));

    let dialogueData_ = {
      dialogue: true,
      type: type,
    };
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData_));
  };

  const handleEditCurrency = (data: any) => {
    dispatch(openDialog({ type: "currency", data: data }));
  };

  const handleIsActive = (row: any) => {

    dispatch(setDefaultCurrency(row?._id));
  };

  return (
    <>
      <div className="userPage withdrawal-page">
        <div className="dashboardHeader primeHeader mb-3 p-0">
          <NewTitle
            dayAnalyticsShow={false}
            titleShow={true}
            name={`Currency`}
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
                onClick={() => handleOpenNew("currency")}
              />
            </div>
          </div>
          <div className="mt-3">
            <Table
              data={data}
              mapData={contactUsTable}
              PerPage={size}
              Page={page}
              type={"client"}
            />
            <div className="mt-3">
              <Pagination
                type={"client"}
                activePage={page}
                rowsPerPage={size}
                userTotal={currency?.length}
                setPage={setPage}
                setData={setData}
                data={data}
                actionShow={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrencyTable;
