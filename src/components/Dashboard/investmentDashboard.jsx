import { List, ListBase, Datagrid, TextField, NumberField, DatagridConfigurable, 
  SearchInput, DateField, DateInput, ReferenceArrayInput, ReferenceInput, SelectInput, AutocompleteArrayInput,
  downloadCSV, useDataProvider } from 'react-admin';
import { Grid2, Stack, Card, useMediaQuery, FormControl, InputLabel, Select, MenuItem, TableContainer, Table } from '@mui/material';
import SimpleListLinkable from './SimpleListLinkable.jsx';

import StatusOfAccount from './HighLevelMetrics.jsx';
import FiscalQuarterChart from './fiscalQuarter.jsx';
import ChooseInvestorAccount from './chooseInvestorAccount.jsx';

import { useState, useEffect } from 'react';

import jsonExport from 'jsonexport/dist';

const exporter = investments => {
    const investmentsForExport = investments.map(inv => {
        const { StartupCorporateEntityID, InvestmentAmount, id, ...investmentsForExport } = inv; // omit StartupID and Syndicate Investment Total
        return investmentsForExport;
    });
    jsonExport(investmentsForExport, {
        //headers: ['investment'] // order fields in the export
    }, (err, csv) => {
        downloadCSV(csv, 'investments-startup_tnt'); // download as 'investments-startup_tnt.csv` file
    });
};

const postFilters = [
  <SearchInput source="search" alwaysOn />,
  <ReferenceArrayInput label="Startup" source="StartupCorporateEntityID" reference="startup" sort={
    { field: 'name', order: 'ASC' }
  } >
    <AutocompleteArrayInput label="Startup" />
  </ReferenceArrayInput>,
  <DateInput label="Deal Closed After Date" source="StartupLegalInvDate_gte" />,
  <DateInput label="Deal Closed Before Date" source="StartupLegalInvDate_lte" />,
];

const mergeFilters = (postFilters, filter) => {
  return postFilters.reduce((acc, filterComponent) => {
    const source = filterComponent.props.source;
    if (filter[source] !== undefined) {
      acc[source] = filter[source];
    }
    return acc;
  }, { ...filter});
};

const InvList = () => {
  const [filter, setFilter] = useState({});
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));
  const dataProvider = useDataProvider();
  const [investorAccounts, setInvestorAccounts] = useState([]);
  const [selectedInvestorAccount, setSelectedInvestorAccount] = useState("");

  useEffect(() => {
    dataProvider.getList('investoraccount', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'name', order: 'ASC' },
      filter: {},
    })
    .then(({ data }) => {
      setInvestorAccounts(data);
      if (data.length > 0 && !selectedInvestorAccount) {
        setSelectedInvestorAccount(data[0].id);
        setFilter(filter => ({ ...filter, investorAccount: data[0].id }));
      }
    })
    .catch(error => {
      console.error(error);
    });
  }, [dataProvider]);

  const handleInvestorAccountChange = (e) => {
    const value = e.target.value;
    setSelectedInvestorAccount(value);
    setFilter(filter => ({ ...filter, investorAccount: value }));
  };

  const combinedFilters = mergeFilters(postFilters, filter);
  
  return (
    
  <Stack spacing={2} sx={{ width: "100%", maxWidth: "100vw" }}>
    <Grid2 container direction="row" spacing={2} gap={2} sx={{ alignItems: "stretch", width: "100%", maxWidth: "100vw"}}>
      <Grid2 size={{ xs: 12, sm: "grow" }} sx={{ flexGrow: 1 }}>
        <Card sx={{ p: 2, boxShadow: 1, borderRadius: 3, height: "100%", textAlign: "center" }}>
          <img src="https://images.squarespace-cdn.com/content/v1/65300899aea2e046b25c31ab/65286b15-85bd-4ec1-b446-5f82b48bd76f/StartUp+TNT+-+New+Logo.png?format=1500w" alt="StartupTNT Logo" style={{width: "100%", height: "auto", maxWidth: "500px"}} />
          {isMobile && (
            <ChooseInvestorAccount 
            investorAccounts={investorAccounts}
            selectedInvestorAccount={selectedInvestorAccount}
            handleInvestorAccountChange={handleInvestorAccountChange} />
          )}
        </Card>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 4 }} sx={{ flexGrow: 1 }}>
        <ListBase filter={filter} pagination={true} perPage={1000}>
          <StatusOfAccount filter={combinedFilters} />
        </ListBase>
      </Grid2>
      {!isMobile && (
        <Grid2 size="grow" sx={{ flexGrow: 1 }}>
          <Card sx={{ p: 2, boxShadow: 1, borderRadius: 3, height: "100%", textAlign: "center" }}>
            <ChooseInvestorAccount 
              investorAccounts={investorAccounts}
              selectedInvestorAccount={selectedInvestorAccount}
              handleInvestorAccountChange={handleInvestorAccountChange} />
          </Card>
        </Grid2>
      )}
      
    </Grid2>
    {!isMobile && (
    <Grid2 size={12} container sx={{ display:"flex" }}>
      <ListBase filter={filter} pagination={true} perPage={1000}>
        <FiscalQuarterChart filter={combinedFilters} />
      </ListBase>
    </Grid2>
    )}
      <List filters={postFilters} filter={filter} exporter={exporter} sx={{ width: "100%", maxWidth: "100vw", overflowX: "auto" }}>
        {isMobile ? (
        <SimpleListLinkable
            filters={postFilters}
            perPage={5}
            primaryText={record => record.StartupName}
            secondaryText={record => record.StartupLegalInvDate.split("T")[0]}
            tertiaryText={record => `${record.totalAmountInvested} CAD`}
            rowClick={record => `/startup/${record.StartupCorporateEntityID}/show`}
           />
        ) : (
          <TableContainer>
        <Datagrid
          rowClick={(id, resource, record) => `/startup/${record.StartupCorporateEntityID}/show`}
          bulkActionButtons={false}
        >
          <TextField
            source="StartupName"
            label="Startup Name"
          />
          <TextField source="InvestmentSummit" />
          <TextField source="SPV" label="SPV" />
          <TextField source="SecondarySPV" label="Secondary SPV" />
          <TextField source="Series" />
          <NumberField
              source="totalAmountInvested"
              options={{
                style: "currency",
                currency: "CAD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }}
              label="Investment Amount"
            />
            <DateField source="StartupLegalInvDate" transform={value => new Date(value)} options={{month:"short", year: "numeric"}} label="Deal Closed Date" />
            <TextField source="SubscriptionDocumentsFolderURL" content="Visit site" label="Startup Subscription Doc" />
            <TextField source="Instrument" />
        </Datagrid>
        </TableContainer>

        )}
      </List>
  </Stack>
  );
};

export default InvList;