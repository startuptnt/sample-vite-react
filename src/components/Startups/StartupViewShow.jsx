import { ShowContextProvider, ShowView, useShowController, useRecordContext, WithRecord, SimpleShowLayout, ReferenceManyField, WithListContext } from 'react-admin';
import { Typography, Box, Alert } from '@mui/material';
import StartupUpdates from './StartupUpdates';


const PostTitle = () => {
  const record = useRecordContext();
  // the record can be empty while loading
  if (!record) return null;
  return <span>{record.name}</span>;
};

const StartupViewShow = (props) => {
    const controllerProps = useShowController();
    
    return (
  <ShowContextProvider value={controllerProps}>
    <ShowView title={<PostTitle />}>

        <WithRecord label="author" render={record => <Typography variant="h3" gutterBottom padding={2}>{record.name}</Typography>} />

        {/* Example Startup Info for the future */}
            {/* <SimpleShowLayout>
            <TextField source="name" label="Startup Name" />
            <TextField source="description" label="Description" />
            <TextField source="website" label="Website" />
            <TextField source="industry" label="Industry" />
            <TextField source="founded" label="Founded" />
            <TextField source="location" label="Location" />
            <TextField source="status" label="Status" />
            <TextField source="stage" label="Stage" />
            <TextField source="valuation" label="Valuation" />
            <TextField source="investors" label="Investors" />
            <TextField source="founders" label="Founders" />
            </SimpleShowLayout> */}

        <ReferenceManyField 
            reference="startupupdates" 
            target="startupId"
            pagination={true}
        >
            <WithListContext render={listContext => {
                const { data, isLoading } = listContext;
                if (isLoading) return <div>Loading...</div>;
                return <StartupUpdates data={data} />;
            }} />
        </ReferenceManyField>


    </ShowView>
  </ShowContextProvider>
  
)};

export default StartupViewShow;

