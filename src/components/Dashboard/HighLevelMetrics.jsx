import { Card, CardContent, Typography, Grid2, IconButton } from '@mui/material';
import { Count, useListContext } from 'react-admin';
import { Refresh } from '@mui/icons-material';

const StatusOfAccount = ({filter}) => {
    const { data, isLoading, refetch } = useListContext();
    if (isLoading) return null;
    

    const totalUnits = data ? data.length : 0;
    const totalDollars = data
        ? data.reduce((sum, record) => sum + (parseFloat(record.totalAmountInvested) || 0), 0)
        : 0;

    return (
          <Card sx={{ p: 2, boxShadow: 1, borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Status of your Investments</Typography>
                <Grid2 container spacing={3}>
                    {/* Total Units */}
                    <Grid2 xs={6}>
                        <Typography variant="body2" color="textSecondary" display="flex" alignItems="center">
                            Total Investments
                            <IconButton size="small" onClick={refetch} disabled={isLoading}>
                                <Refresh fontSize="small" />
                            </IconButton>
                        </Typography>
                        <Typography variant="h4">
                            {isLoading ? '...' : totalUnits}
                        </Typography>
                    </Grid2>

                    {/* Total Investment Amount */}
                    <Grid2 xs={6}>
                        <Typography variant="body2" color="textSecondary" display="flex" alignItems="center">
                            Total Investment
                            <IconButton size="small" onClick={refetch} disabled={isLoading}>
                                <Refresh fontSize="small" />
                            </IconButton>
                        </Typography>
                        <Typography variant="h4">
                            {isLoading ? '...' : `$${totalDollars.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
                        </Typography>
                    </Grid2>
                </Grid2>
            </CardContent>
          </Card>
    );
};

export default StatusOfAccount;
