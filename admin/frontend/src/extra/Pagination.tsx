import React, { useEffect, useState } from "react";
import { IconButton, makeStyles, useTheme, Box, FormControl, MenuItem, InputLabel, Select } from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import TablePagination from "react-js-pagination";
import Button from "./Button";
import Selector from "./Selector";

export default function Pagination(props: any) {

  const {

    type,
    setPage,
    userTotal,
    rowsPerPage,
    activePage,

  } = props;

  const [clientData, setClientData] = useState<any>();

  const handlePage = (pageNumber: any) => {
    setPage(pageNumber);
  };

  const totalPages = Math.ceil(userTotal / rowsPerPage);

  return (
    <>
      {userTotal > rowsPerPage && (
        <div className=" row gx-0 custom-pagination m-0 w-100 px-3">
          <>
            <div className="col-12 pagination d-flex flex-column mt-3 mb-3" style={{ marginRight: "10px" }}>
              {type === "server" && userTotal > rowsPerPage && (
                <>
                  <div>
                    <p style={{ marginBottom: "0px", color: "1F1F1F", fontSize: "16px", fontWeight: "500" }}>
                      Showing {activePage} out of {totalPages} pages
                    </p>
                    <TablePagination
                      activePage={activePage}
                      itemsCountPerPage={rowsPerPage}
                      totalItemsCount={userTotal}
                      pageRangeDisplayed={3}
                      onChange={(page) => handlePage(page)}
                      itemClass="page-item"
                    />
                  </div>
                </>
              )}
              <div>
                {type === "client" && userTotal > rowsPerPage && (
                  <>
                    <p style={{ marginBottom: "0px", color: "1F1F1F", fontSize: "16px", fontWeight: "500" }}>
                      Showing {activePage} out of {totalPages} pages
                    </p>
                    <TablePagination
                      activePage={activePage}
                      itemsCountPerPage={rowsPerPage}
                      totalItemsCount={userTotal}
                      pageRangeDisplayed={3}
                      onChange={handlePage}
                      itemClass="page-item"
                    />
                  </>
                )}
              </div>
            </div>
          </>
        </div>
      )}
    </>
  );
};
