import { useState, Fragment } from 'react';
import { useListContext, Pagination, ShowBase, WithRecord } from 'react-admin';
import { Card, CardContent, Typography, CircularProgress, ListItem, Grid2, ListItemButton, ListItemText, useMediaQuery, IconButton, Alert } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const formatDate = (date) => {
    try {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });
    } catch (e) {
        return "Invalid Date"
    }
    
};

const StartupUpdates = () => {
    const { data, isPending } = useListContext();

    
    if (isPending) return <CircularProgress />;

    const [selectedUpdate, setSelectedUpdate] = useState(null);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));

    if ( selectedUpdate === null && !isMobile ) {
        setSelectedUpdate(data[0])
    }

    const updateSelectedUpdate = (update) => {
        setSelectedUpdate(update);
        // refetch();
    }

    // const { dataMessage, isPendingMessage, error, refetch } = useGetOne(
    //     'startupupdates',
    //     selectedUpdate ? { id: selectedUpdate.id } : { id: '1' },
    // );
  
    return (
        <>
            <Alert severity="warning" sx={{ mb: 2 }}>
                These messages are not from Startup TNT. Please be cautious with any links or attachments as they could be malicious.
            </Alert>
            <CardContent>
                { !isMobile || isMobile && !selectedUpdate ? (
                    <Typography variant="h6" gutterBottom>
                        Latest Updates
                    </Typography>
                ) : (
                    <IconButton onClick={() => setSelectedUpdate(null)} sx={{ paddingLeft: 0, marginLeft: -1 }}>
                        <ChevronLeftIcon /> Back
                    </IconButton>
                )}
                {data.length === 0 ? (
                    <Typography variant="body1">
                        We didn't find any updates from this portfolio company. If you think this was an error, refresh the page to try again.
                    </Typography>
                ) : (
                    <Grid2 container spacing={2}>
    
                        {(isMobile && !selectedUpdate) || !isMobile ? (
                            <Grid2 size={{ xs: 12, sm: selectedUpdate ? 4 : 12 }}>
                                {data.map(update => (
                                    <ListItem key={update.id} disablePadding>
                                        <ListItemButton
                                            onClick={ () => setSelectedUpdate(update)}
                                            selected={selectedUpdate?.id === update.id}
                                        >
                                            <ListItemText
                                                secondary={formatDate(new Date(update.date))}
                                                primary={update.subject}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                                <Pagination />
                            </Grid2>
                        ) : null}
                        {selectedUpdate ? (
                                <Grid2 size={{ xs: 12, sm: selectedUpdate ? 8 : 12 }}>
                                    <ShowBase id={selectedUpdate.id} >
                                        <WithRecord label="fullMessage" render={record => (
                                            <Typography variant="h6" gutterBottom>
                                                {record.subject}
                                            </Typography>
                                            )} 
                                        />
                                        <WithRecord label="fullMessage" render={record => (
                                            <Typography variant="body2" sx={{ wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                                {record.fullMessage ? (record.fullMessage.split('\n').map((paragraph, index, paragraphs) => (
                                                    <Fragment key={index}>
                                                        {paragraph}
                                                        {index < paragraphs.length - 1 && <br />}
                                                    </Fragment>
                                                ))) : ( <CircularProgress />)}
                                            </Typography>
                                            )}
                                        />
                                        
                                    </ShowBase>
                                    {/* <Typography variant="h6" gutterBottom>
                                        {dataMessage.subject}
                                    </Typography>
                                    <Typography variant="body2" sx={{ wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                        {dataMessage.fullMessage &&
                                            dataMessage.fullMessage.split('\n').map((paragraph, index, paragraphs) => (
                                                <Fragment key={index}>
                                                    {paragraph}
                                                    {index < paragraphs.length - 1 && <br />}
                                                </Fragment>
                                            ))
                                        }
                                    </Typography>  */}
                                </Grid2>

                        ) : null}
    
                    </Grid2>
                )}
            </CardContent>
        </>
    );
};

export default StartupUpdates;