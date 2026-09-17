"use client";
import RootLayout from "../component/layout/Layout";
import React, { useEffect, useState } from "react";
import VideoIcon from "../assets/icons/VideoIcon.svg";
import UserTotalIcon from "../assets/icons/UserSideBarIcon.svg";
import SongIcon from "../assets/icons/songIcon.svg";
import TotalChannelIcon from "../assets/icons/ChannelIcon.svg";
import NewTitle from "../extra/Title";
import Image from "next/image";
import { useSelector } from "react-redux";
import {  dashboardCount, getChartUser, getChartVideo, getChartPost } from "../store/dashSlice";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/store/store";
import { ApexOptions } from "apexcharts";

const Dashboard = (props) => {
  const {
    dashCount,
    chartAnalyticOfVideos,
    chartAnalyticOfPosts,
    chartAnalyticOfUsers,
  } = useSelector((state: any) => state.dashboard);
  const router = useRouter();
  const dispatch = useAppDispatch();

  let label = [];
  let dataPost = [];
  let dataVideo = [];
  let dataUser = [];

  const [startDate, setStartDate] = useState<string>("All");
  const [endDate, setEndDate] = useState<string>("All");

  useEffect(() => {
    let payload: any = {
      startDate: startDate,
      endDate: endDate,
    };
    dispatch(dashboardCount(payload));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    let payload: any = {
      startDate: startDate,
      endDate: endDate,
      type: "Post",
    };
    dispatch(getChartPost(payload));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    let payload: any = {
      startDate: startDate,
      endDate: endDate,
      type: "Video",
    };
    dispatch(getChartVideo(payload));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    let payload: any = {
      startDate: startDate,
      endDate: endDate,
      type: "User",
    };
    dispatch(getChartUser(payload));
  }, [dispatch, startDate, endDate]);

  chartAnalyticOfUsers?.forEach((data_: any) => {
    
    const newDate = data_?._id;
    if (newDate) {
      label?.push(newDate);
      dataUser?.push(data_?.count);
    }
  });

  chartAnalyticOfVideos?.forEach((data_: any) => {
    
    const newDate = data_?._id;
    if (newDate) {
      label?.push(newDate);
      dataVideo?.push(data_?.count);
    }
  });

  chartAnalyticOfPosts?.forEach((data_: any) => {
    
    const newDate = data_?._id;
    if (newDate) {
      label?.push(newDate);
      dataPost?.push(data_?.count);
    }
  });


let labelSet:any = new Set(label);
// Convert labelSet back to array and sort
label = [...labelSet].sort(
  (a: any, b: any) => new Date(a).getTime() - new Date(b).getTime()
);

  // Ensure all arrays have the same length and are aligned properly with labels
  const maxLength = label?.length;

  for (let i = 0; i < maxLength; i++) {
    
    if (dataUser[i] === undefined) {
      
      dataUser[i] = 0;
    }
    if (dataVideo[i] === undefined) {
      
      dataVideo[i] = 0;
    }
    if (dataPost[i] === undefined) {
      
      dataPost[i] = 0;
    }
  }

  const totalSeries = {
    labels: label,
    dataSet: [
      {
        name: "Total User",
        data: dataUser,
      },
      {
        name: "Total Video",
        data: dataVideo,
      },
      {
        name: "Total Short",
        data: dataPost,
      },
    ],
  };
  const optionsTotal: ApexOptions = {
    chart: {
      type: "area",
      stacked: false,
      height: "200px",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      categories: label,
      // rotate: 0,
      // rotateAlways: true,
      // minHeight: 50,
      // maxHeight: 100,
      labels: {
        offsetX: -4, // Adjust the offset vertically
        // fontSize: 10,
      },
    },

    tooltip: {
      shared: true,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetX: -10,
    },
    colors: ["#FF4B1F", "#FF9F00", "#FF6B4A"],
  };

  const optionsGradient: ApexOptions = {
    chart: {
      height: 400,
      width: 200,
      type: "radialBar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 365,
        hollow: {
          margin: 0,
          size: "55%",
          background: "#fff",
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: "front",
          dropShadow: {
            enabled: false,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: "#FFF0EB", // Soft warm background for radial track
          strokeWidth: "90%",
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: false,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },
        dataLabels: {
          show: true,
          name: {
            show: true,
            fontFamily: undefined,
            fontWeight: 700,
            fontSize: "17px",
            color: "#404040",
            offsetY: -10,
          },
          value: {
            formatter: function (val: any) {
              return parseInt(val) + "%";
            },
            color: "#FF4B1F",
            fontWeight: 600,
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    labels: ["Active User"],
    fill: {
      type: "solid",
      colors: ["#FF4B1F"],
    },
    stroke: {
      lineCap: "round",
    },
  };

  // Log the chartAnalyticOfUsers array to check its contents

  // Function to check if a value is a valid number
  const isValidNumber = (value: any) =>
    typeof value === "number" && !isNaN(value);

  // Calculate activeUserData
  const activeUserData =
    chartAnalyticOfUsers?.reduce((acc, obj) => {
      const count = obj?.count;
      return isValidNumber(count) ? acc + count : acc;
    }, 0) || 0;

  // Calculate userData
  const userData =
    chartAnalyticOfUsers?.reduce((acc, obj) => {
      const count = obj?.count;
      return isValidNumber(count) ? acc + count : acc;
    }, 0) || 0;

  // Calculate percentage
  const percentage =
    activeUserData && userData ? (activeUserData / userData) * 100 : 0;

  // Create the series data
  const seriesGradient = [percentage ? Number(percentage.toFixed(0)) : 0];

  const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

  return (
    <>
      <div className="dashboard " style={{ padding: "15px" }}>
        <div className="dashboardHeader primeHeader mb-3 p-0">
          <NewTitle
            dayAnalyticsShow={true}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            startDate={startDate}
            endDate={endDate}
            titleShow={true}
            name={`Dashboard`}
          />
        </div>
        <div className="dashBoardMain px-4 pt-2">
          <div className="row dashboard-count-box">
            <div
              className="  adminProfileBox px-2   col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => router.push("/userTable")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <Image src={UserTotalIcon} alt="UserTotalIcon" />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total User</h5>
                  <h6 className="text-center pt-3 fw-bold custom-text-color">
                    {dashCount?.totalUsers ? dashCount?.totalUsers : 0}
                  </h6>
                </div>
              </div>
            </div>
            <div
              className="  adminProfileBox px-2   col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => router.push("/postTable")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <Image src={TotalChannelIcon} alt="TotalChannelIcon" />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Post</h5>
                  <h6 className="text-center pt-3 fw-bold  custom-text-color">
                    {dashCount?.totalPosts ? dashCount?.totalPosts : 0}
                  </h6>
                </div>
              </div>
            </div>
            <div
              className="  adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12  cursor"
              onClick={() => router.push("/videoTable")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <Image src={VideoIcon} alt="videoIcon" />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Video</h5>
                  <h6 className="text-center pt-3  fw-bold custom-text-color">
                    {dashCount?.totalVideos ? dashCount?.totalVideos : 0}
                  </h6>
                </div>
              </div>
            </div>

            <div
              className="  adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => router.push("/songTable")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <Image src={SongIcon} alt="SongIcon" />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Song </h5>
                  <h6 className="text-center pt-3  fw-bold custom-text-color">
                    {dashCount?.totalSongs ? dashCount?.totalSongs : 0}
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-analytics">
            <h6>Data Analytics</h6>
            <div className="row dashboard-chart justify-content-between">
              <div
                className="col-lg-9 col-md-12 col-sm-12 mt-lg-0 mt-4 dashboard-chart-box"
                style={{ position: "relative" }}
              >
                <div
                  id="chart"
                  className="dashboard-user-count"
                  style={{ height: "100%" }}
                >
                  <div className="date-range-picker mb-2 pb-2"></div>
                  <div className="pt-3">
                    <Chart
                      options={optionsTotal}
                      series={
                        totalSeries.dataSet.length > 1
                          ? totalSeries.dataSet
                          : [{ data: [] }]
                      }
                      type="area"
                      height={450}
                    />
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: "46%",
                      right: "40%",
                      fontWeight: "500",
                    }}
                  ></span>
                </div>
              </div>
              <div className="col-lg-3 col-md-12  col-sm-12 mt-3 mt-lg-0 dashboard-total-user">
                <div className="user-activity">
                  <h6>Total User Activity</h6>
                  <div
                    id="chart"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Chart
                      options={optionsGradient}
                      series={seriesGradient}
                      type="radialBar"
                      width={450}
                      height={"360px"}
                    />
                  </div>
                  <div className="total-user-chart">
                    <span></span>
                    <h5>Total User</h5>
                  </div>
                  <div className="total-active-chart">
                    <span></span>
                    <h5>Total Block User</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Dashboard;
