import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Card, Typography } from '@mui/material';
import { useListContext } from 'react-admin';

const FiscalQuarterChart = ({filter, postFilters}) => {
    const [chartData, setChartData] = useState([]);

    const { data, isLoading, refetch } = useListContext();

    useEffect(() => {
        if (data) {
            // Sort by date first
            const sortedData = data.sort((a, b) => new Date(a.StartupLegalInvDate) - new Date(b.StartupLegalInvDate));
                
            // Group by fiscal quarter
            const aggregatedData = sortedData.reduce((acc, transaction) => {
                const date = new Date(transaction.StartupLegalInvDate);
                const year = date.getFullYear();
                const quarter = `Q${Math.ceil((date.getMonth() + 1) / 3)} - ${year}`;

                acc[quarter] = (acc[quarter] || 0) + parseFloat(transaction.totalAmountInvested || 0);
                return acc;
            }, {});

            const chartInfo = Object.entries(aggregatedData)
                .map(([quarter, total]) => ({ quarter, total }))

            setChartData(chartInfo);
        }
    }, [data]);

    return (
        <Card sx={{ p: 2, boxShadow: 1, borderRadius: 3, flexGrow: 1, display: "flex", flexDirection: "column"}}>
            <Typography variant="h6" gutterBottom>
                Dollars per Fiscal Quarter
            </Typography>

            <svg width="0" height="0">
                <defs>
                    <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="0">
                        <stop offset="0%" stopColor="#1f69d0" />
                        <stop offset="100%" stopColor="#4185e3" />
                    </linearGradient>
                </defs>
            </svg>

            <BarChart
                xAxis={[{ scaleType: 'band', data: chartData.map(d => d.quarter) }]}
                yAxis={[{
                    valueFormatter: (value) => {
                        if (value >= 1000) {
                            return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
                        }
                        return `$${value}`;
                    }
                }]}
                series={[{ data: chartData.map(d => d.total), color: 'url(#barGradient)' }]}
                height={300}
                responsive="true"
                margin={{ left: 80 }}
                borderRadius={4}
            />
        </Card>
    );
};

export default FiscalQuarterChart;
