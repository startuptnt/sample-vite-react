import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ChooseInvestorAccount = ({ investorAccounts, selectedInvestorAccount, handleInvestorAccountChange }) => {

    return (
        <FormControl fullWidth>
        <InputLabel id="investor-account-label">Investor Account</InputLabel>
        <Select
        labelId="investor-account-label"
        id="investor-account-select"
        value={selectedInvestorAccount}
        onChange={handleInvestorAccountChange}
        label="Investor Account"
        sx={{textAlign: "left", width: "fit-content", maxWidth: "100%", minWidth: 175}}
        >
        {
        investorAccounts.map(account => (
            <MenuItem key={account.id} value={account.id}>
            {account.name}
            </MenuItem>
        ))}
        </Select>
        </FormControl>
    );
};

export default ChooseInvestorAccount;