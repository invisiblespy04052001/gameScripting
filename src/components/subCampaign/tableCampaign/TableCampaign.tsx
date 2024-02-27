import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { Checkbox, Container, FormLabel, Grid, TextField } from "@mui/material";
import Button from "@mui/material/Button/Button";

function createData(id: number, name: string, quantity: number) {
  return {
    id,
    name,
    quantity,
  };
}

// const rows = [createData(0, "Quảng cáo 1", 0)];

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: any;
  numeric: boolean;
  actions?: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Tên quảng cáo*",
  },
  {
    id: "quantity",
    numeric: false,
    disablePadding: false,
    label: "Số lượng*",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  setSubCampaign: any;
  selectedIndex: number;
  selected: number[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    numSelected,
    rowCount,
    setSubCampaign,
    selectedIndex,
    selected,
  } = props;
  console.log("🚀 ~ EnhancedTableHead ~ setSubCampaign:", setSubCampaign);

  const handleFilterData = () => {
    setSubCampaign((pre: any[]) => {
      return pre.map((item: { id: number; ads: any[] }) =>
        item.id === selectedIndex
          ? {
              ...item,
              ads: item.ads.filter(
                (el: { id: any }) => !selected.includes(el.id)
              ),
            }
          : item
      );
    });
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell, index) => {
          return (
            <>
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? "right" : "left"}
                padding={headCell.disablePadding ? "none" : "normal"}
              >
                <TableHead>
                  {numSelected > 0 && index !== 2 ? (
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleFilterData()}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    headCell.label
                  )}
                </TableHead>
              </TableCell>
            </>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable(props: any) {
  const { subCampaign, setSubCampaign, nameAdvice, selectedIndex } = props;
  const [selected, setSelected] = React.useState<number[]>([]);
  const [editedRows, setEditedRows] = React.useState<any>([]);

  React.useMemo(() => {
    //Kiểm tra xem đang ở chiến dịch nào
    const res =
      subCampaign.find(
        (el: {
          id: number;
          ads: { id: number; name: string; quantity: number }[];
        }) => el.id === selectedIndex
      )?.ads || [];

    const row = res.map((el: { id: number; name: string; quantity: number }) =>
      createData(el.id, el.name, el.quantity)
    );

    setEditedRows(row);
  }, [subCampaign, selectedIndex]);

  //Hàm thêm quảng cáo
  const handleAddAdvertise = () => {
    const row = [
      ...editedRows,
      {
        name: `Quảng cáo ${editedRows.length + 1}`,
        id: editedRows.length + 1,
        quantity: 0,
      },
    ];

    setSubCampaign((pre: any) => {
      return pre.map((preItem: any) => {
        if (preItem.id === selectedIndex) {
          return {
            ...preItem,
            ads: row,
          };
        }

        return preItem;
      });
    });
  };

  // Thêm hàm xử lý sự kiện cho sự thay đổi giá trị của TextField
  const handleRowFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: number,
    field: string
  ) => {
    const newValue = event.target.value;
    // xử lý tìm kiếm giá trị hợp lệ
    subCampaign.forEach(
      (el: {
        id: number;
        ads: { id: number; name: string; quantity: number }[];
      }) => {
        if (el.id === selectedIndex) {
          el.ads = el.ads.map(
            (pre: { id: number; name: string; quantity: number }) =>
              pre.id === id
                ? {
                    ...pre,
                    [field]: newValue,
                  }
                : pre
          );
        }
      }
    );

    const updatedCampaign = subCampaign.find(
      (el: { id: number; ads: any[] }) => el.id === selectedIndex
    );

    const updatedAds = updatedCampaign ? updatedCampaign.ads : [];

    //gán lại giá trị cho table
    setEditedRows(updatedAds);

    // Set lại giá trị count cho
    setSubCampaign((pre: any[]) => {
      return pre.map((item: { id: any }) =>
        item.id === selectedIndex
          ? {
              ...item,
              count: updatedAds.reduce(
                (total: number, ad: { quantity: string }) => {
                  // Chuyển đổi quantity thành số nguyên, nếu không hợp lệ thì trả về 0
                  return total + (parseInt(ad.quantity) || 0);
                },
                0
              ),
            }
          : item
      );
    });
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = editedRows.map((n: { id: any }) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleDeleteRow = (id: number) => {
    const updatedRows = editedRows.filter(
      (row: { id: number }) => row.id !== id
    );

    setSubCampaign((pre: any[]) => {
      return pre.map((item: { ads: any; id: any }) =>
        item.id === selectedIndex
          ? {
              ...item,
              count: updatedRows.reduce(
                (total: number, ad: { quantity: string }) => {
                  // Chuyển đổi quantity thành số nguyên, nếu không hợp lệ thì trả về 0
                  return total + (parseInt(ad.quantity) || 0);
                },
                0
              ),
              ads: updatedRows,
            }
          : item
      );
    });
  };

  const handleDeleteAll = (editedRows: any, setSubCampaign: any) => {};

  return (
    <Container sx={{ padding: 0, margin: 0, height: "auto" }}>
      <Grid container spacing={2}>
        <Grid item width="100%" xs={12}>
          <FormLabel
            sx={{ fontSize: 25, fontWeight: 500 }}
            style={{ padding: "16px", justifyContent: "space-around" }}
          >
            Danh sách quảng cáo
          </FormLabel>
          <Button onClick={handleAddAdvertise}>Thêm</Button>
        </Grid>
        <Grid width={"100%"} item>
          <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    numSelected={selected.length}
                    onSelectAllClick={handleSelectAllClick}
                    rowCount={editedRows.length}
                    setSubCampaign={setSubCampaign}
                    selectedIndex={selectedIndex}
                    selected={selected}
                  />
                  <TableBody>
                    {editedRows.map(
                      (
                        row: { id: number; name: string; quantity: number },
                        index: any
                      ) => {
                        const isItemSelected = isSelected(row.id);

                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                            sx={{ cursor: "pointer" }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                                onChange={(event) => handleClick(row.id)}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                              content={row.name}
                            >
                              <TextField
                                fullWidth
                                value={row.name}
                                variant="standard"
                                onChange={(
                                  event: React.ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                  >
                                ) =>
                                  handleRowFieldChange(event, row.id, "name")
                                }
                                error={
                                  nameAdvice && nameAdvice.length ? true : false
                                }
                                helperText={nameAdvice}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <TextField
                                type="number"
                                fullWidth
                                variant="standard"
                                value={row.quantity}
                                onChange={(
                                  event: React.ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                  >
                                ) =>
                                  handleRowFieldChange(
                                    event,
                                    row.id,
                                    "quantity"
                                  )
                                }
                              />
                            </TableCell>

                            <TableCell align="right">
                              <IconButton
                                onClick={() => handleDeleteRow(row.id)}
                                disabled={isItemSelected}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
