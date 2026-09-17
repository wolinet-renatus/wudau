import React, { useState } from "react";
import NewTitle from "../extra/Title";
import Video from "../component/video/Video";
import FakeVideo from "../component/video/FakeVideo";
import CreateFakeVideo from "../component/video/CreateFakeVideo";
import { useSelector } from "react-redux";
import { RootStore } from "../store/store";
import RootLayout from "@/component/layout/Layout";

const ManageVideo = (props) => {
  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);

  const [dayAnalytics, setDayAnalytics] = useState<string>("today");
  const [multiButtonSelect, setMultiButtonSelect] =
    useState<string>("Real Video");
  const [startDate, setStartDate] = useState<string>("All");
  const [endDate, setEndDate] = useState<string>("All");

  return (
    <div className="userPage channelPage">
      {dialogueType === "fakeVideo" && <CreateFakeVideo />}
      <div>
        <div className="dashboardHeader primeHeader mb-3 p-0">
          <NewTitle
            dayAnalyticsShow={true}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            startDate={startDate}
            endDate={endDate}
            name={`Sound`}
            titleShow={false}
            multiButtonSelect={multiButtonSelect}
            setMultiButtonSelect={setMultiButtonSelect}
            labelData={["Real Video", "Fake Video"]}
          />
        </div>
      </div>
      {multiButtonSelect === "Real Video" && (
        <Video startDate={startDate} endDate={endDate} />
      )}
      {multiButtonSelect === "Fake Video" && (
        <FakeVideo startDate={startDate} endDate={endDate} />
      )}
    </div>
  );
};

ManageVideo.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default ManageVideo;
