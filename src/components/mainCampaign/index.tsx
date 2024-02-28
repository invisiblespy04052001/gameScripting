import { FormHelperText, TextField } from "@mui/material";
import React from "react";

interface propsType {
  register: any;
  name?: string;
  des?: string;
}

const MainCampaign = (props: propsType) => {
  const { register, name } = props;
  return (
    <div>
      <TextField
        error={name && name.length ? true : false}
        id="name"
        label="Tên chiến dịch"
        variant="standard"
        required
        fullWidth
        helperText={name}
        {...register("name")}
      />
      <TextField
        label="Mô tả"
        variant="standard"
        fullWidth
        {...register("desc")}
      />
    </div>
  );
};

export default MainCampaign;
