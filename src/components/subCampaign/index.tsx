import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Container,
  Fab,
  FormControlLabel,
  FormLabel,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  TextField,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import { useMemo, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./style.css";
import { useForm } from "react-hook-form";
import EnhancedTable from "./tableCampaign/TableCampaign";
interface SubCampaignProps {
  register?: any;
  name?: string;
  subCampaign?: any;
  setSubCampaign?: any;
}

const SubCampaign = (props: SubCampaignProps) => {
  // const { register } = useForm();
  const { name, register, subCampaign, setSubCampaign } = props;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tempValue, setTempValue] = useState("Chiến dịch con 1");
  const [checked, setChecked] = useState(true);

  const handleAddSubCompaign = () => {
    setSubCampaign([
      ...subCampaign,
      {
        id: subCampaign.length + 1,
        label: `Chiến dịch con ${subCampaign.length + 1}`,
        count: 0,
        isActive: true,
        ads: [
          {
            name: "Quảng cáo 1",
            id: 1,
            quantity: 0,
          },
        ],
      },
    ]);
    setSelectedIndex(subCampaign.length + 1);
    setChecked(true);
  };

  useMemo(() => {
    subCampaign.find((el: any) =>
      el.id === selectedIndex ? setTempValue(el.label) : null
    );
  }, [selectedIndex]);

  const handleChange = (e: any) => {
    setTempValue(e.target.value);
    setSubCampaign((pre: any) => {
      return pre.map((el: any) =>
        el.id === selectedIndex
          ? {
              ...el,
              label: e.target.value,
            }
          : el
      );
    });
  };

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    subCampaign.find((el: any) => {
      if (el.id === index) {
        setTempValue(el.label);
        setChecked(el.isActive);
        return;
      }
    });
  };

  const handleChangeStatus = (e: any) => {
    setSubCampaign((pre: any) => {
      return pre.map((preItem: any) =>
        preItem.id === selectedIndex
          ? {
              ...preItem,
              isActive: e.target.checked ?? false,
            }
          : preItem
      );
    });
    setChecked(!checked);
  };

  return (
    <Box sx={{ flexGrow: 5 }} height={"auto"}>
      <Grid container spacing={4}>
        <Grid item container>
          <List
            sx={{
              maxWidth: "100%",
              bgcolor: "background.paper",
              gap: 5,
              display: "flex",
              overflowX: "auto",
            }}
            style={{
              whiteSpace: "nowrap",
            }}
            disablePadding
          >
            <Fab
              color="primary"
              aria-label="add"
              size="small"
              onClick={handleAddSubCompaign}
              sx={{ minWidth: 50, minHeight: 50 }}
              style={{ boxShadow: "none" }}
            >
              <AddIcon />
            </Fab>
            {Array.from(subCampaign).map((el: any, index) => (
              // <Grid item md={24} key={index}>
              <ListItemButton
                selected={selectedIndex === el.id}
                onClick={(event) => handleListItemClick(event, el.id)}
                style={{ padding: 0 }}
                sx={{ minWidth: 180, minHeight: 130 }}
                // onChange={(e) => handleChangeValue(e, el.id)}
              >
                <Paper
                  sx={{ minWidth: 180, minHeight: 130 }}
                  style={{
                    cursor: "pointer",
                    border:
                      selectedIndex === el.id
                        ? "2px solid rgb(33, 150, 243)"
                        : "",
                  }}
                  // onClick={handleChangeValue}
                >
                  <div>
                    <div>
                      {el.label}
                      <CheckCircleIcon
                        fontSize="small"
                        style={{ fill: el.isActive ? "green" : "" }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      fontSize: 25,
                      color: "black",
                    }}
                  >
                    {el.count}
                  </div>
                </Paper>
              </ListItemButton>
              // </Grid>
            ))}
          </List>
        </Grid>
        <Grid container spacing={2} item>
          <Grid item xs={8} style={{ padding: 16 }}>
            <TextField
              sx={{ padding: "10px" }}
              error={name && name.length ? true : false}
              id="subCampaigns"
              label="Tên chiến dịch con"
              required
              variant="standard"
              fullWidth
              value={tempValue}
              {...register("subCampaigns")}
              onChange={handleChange}
              helperText={name}
              size="small"
              className="MuiInputLabel"
            />
          </Grid>
          <Grid item xs={4} style={{ padding: 0 }}>
            <FormControlLabel
              sx={{
                justifyContent: "center",
                width: "100%",
                alignItems: "center",
                height: "100%",
              }}
              control={<Checkbox checked={checked} />}
              label="Đang hoạt động"
              onChange={handleChangeStatus}
            />
          </Grid>
        </Grid>
        <EnhancedTable
          subCampaign={subCampaign}
          setSubCampaign={setSubCampaign}
          register={register}
          selectedIndex={selectedIndex}
        />
      </Grid>
    </Box>
  );
};

export default SubCampaign;
