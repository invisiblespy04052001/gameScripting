import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import MainCampaign from "./components/mainCampaign";
import SubCampaign from "./components/subCampaign";
import { Button, Container, Divider, Grid } from "@mui/material";
import { useForm } from "react-hook-form";

interface campaignProps {
  id: number;
  label: string;
  count: number;
  isActive: boolean;

  ads: [
    {
      name: string;
      id: number;

      quantity: number;
    }
  ];
}

function App() {
  const [value, setValue] = React.useState("1");
  const [campaign, setCampaign] = React.useState("");
  const [subCampaigns, setSubCampaigns] = React.useState("");
  const { register, handleSubmit } = useForm();
  const [subCampaign, setSubCampaign] = React.useState<campaignProps[]>([
    {
      id: 0,
      label: "Chiến dịch con 1",
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
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const innitMenu = [
    {
      label: "Thông tin",
      value: "1",
    },
    {
      label: "Chiến dịch con",
      value: "2",
    },
  ];
  const handleFormSubmit = (formData: any) => {
    let formCheck = false;
    console.log("🚀 ~ handleFormSubmit ~ formData:", formData);
    if (!formData.name || !formData.name.length) {
      setCampaign("Chưa điền tên chiến dịch");
      formCheck = true;
    } else setCampaign("");
    if (!formData.subCampaigns || !formData.subCampaigns.length) {
      setSubCampaigns("Chưa điền tên chiến dịch con");
      formCheck = true;
    } else setSubCampaigns("");
    if (!formCheck) {
      alert({
        campaign: {
          information: {
            name: formData.name,
            describe: formData.desc,
          },
          subCampaigns: [
            {
              name: formData.subCampaigns,
              status: formData.status,
              ads: [
                {
                  name: formData.ads,
                  quantity: formData.quantity,
                },
              ],
            },
          ],
        },
      });
      return true;
    }
  };
  return (
    <Container maxWidth="xl">
      <Box
        sx={{ width: "100%", typography: "body1" }}
        border={"gray"}
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
      >
        <Grid xs={12} md={4} style={{ padding: 10, justifyContent: "end" }}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Grid>
        <Divider />
        <Box
          sx={{
            borderBottom: 1,
            // borderColor: "divider",
            border: "1px solid #0000001f",
            margin: "20px 40px",
          }}
        >
          <TabContext value={value}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {innitMenu.map((el) => (
                <Tab label={el.label} value={el.value} />
              ))}
            </TabList>
            <Divider />

            <TabPanel value="1">
              <MainCampaign register={register} name={campaign} />
            </TabPanel>
            <TabPanel value="2">
              <SubCampaign
                register={register}
                name={subCampaigns}
                setSubCampaign={setSubCampaign}
                subCampaign={subCampaign}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
