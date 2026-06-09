import { useState } from "react";

function CemeterySelector({
  cemeteries,
  selectedProvince,
  selectedCemetery,
  setSelectedCemetery,
}) {
  const [search, setSearch] =
    useState("");

  const filteredCemeteries =
    cemeteries.filter(
      (cemetery) =>
        cemetery.provinceName ===
          selectedProvince &&
        cemetery.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const cemetery =
    cemeteries.find(
      (c) =>
        c.id === selectedCemetery
    );

  return (
    <>
      {!selectedCemetery && (
        <>
          <input
            type="text"
            placeholder="Search Cemetery"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          {search.trim() !== "" && (
            <div
              style={{
                border:
                  "1px solid #ddd",
                borderRadius:
                  "8px",
                marginTop: "10px",
                maxHeight:
                  "250px",
                overflowY:
                  "auto",
              }}
            >
              {filteredCemeteries.map(
                (
                  cemetery
                ) => (
                  <div
                    key={
                      cemetery.id
                    }
                    onClick={() => {
                      setSelectedCemetery(
                        cemetery.id
                      );

                      setSearch(
                        ""
                      );
                    }}
                    style={{
                      padding:
                        "12px",
                      cursor:
                        "pointer",
                      borderBottom:
                        "1px solid #eee",
                    }}
                  >
                    <strong>
                      {
                        cemetery.name
                      }
                    </strong>

                    <br />

                    {
                      cemetery.cityName
                    }
                  </div>
                )
              )}

              {filteredCemeteries.length ===
                0 && (
                <div
                  style={{
                    padding:
                      "12px",
                  }}
                >
                  No cemeteries
                  found
                </div>
              )}
            </div>
          )}
        </>
      )}

      {cemetery && (
        <div
          style={{
            background:
              "#f5f5f5",
            padding:
              "15px",
            borderRadius:
              "10px",
            marginTop:
              "15px",
          }}
        >
          <h3>
            Selected Cemetery
          </h3>

          <p>
            <strong>
              {
                cemetery.name
              }
            </strong>
          </p>

          <p>
            City:{" "}
            {
              cemetery.cityName
            }
          </p>

          <p>
            Province:{" "}
            {
              cemetery.provinceName
            }
          </p>

          <button
            type="button"
            onClick={() =>
              setSelectedCemetery(
                ""
              )
            }
          >
            Clear Selection
          </button>
        </div>
      )}
    </>
  );
}

export default CemeterySelector;