import { useContext, useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { Chip, CircularProgress } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { EnvContext } from '../Layout/Layout';
import { getBaseUrl } from '../utils/baseUrl';


const urls = {
    dev: 'https://dev-api.battle-royale.site/api/leaderboard/tournaments',
    stage: 'https://stage-api.battle-royale.site/api/leaderboard/tournaments',
    production: 'https://production-api.battle-royale.site/api/leaderboard/tournaments'
}

export const TournamentStats = () => {
    const [data, setData] = useState<any>(undefined);
    const [fromDateTime, setFromDateTime] = useState<Dayjs | null>(dayjs(new Date(new Date().setHours(new Date().getHours() - 24, 0, 0, 0)).toISOString()))
    const [toDateTime, setToDateTime] = useState<Dayjs | null>(dayjs(new Date().toISOString()))
    const ctxEnv = useContext(EnvContext);
    const [inProgress, setInProgress] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            setData({gameStats: []})
            setInProgress(true);
            let url = `${getBaseUrl(ctxEnv)}/leaderboard/tournaments`;
            if (fromDateTime || toDateTime) {
                url += '?';
            }

            if (fromDateTime) {
                url += `from=${fromDateTime.toISOString()}`
            }

            if (fromDateTime && toDateTime) {
                url += `&to=${toDateTime.toISOString()}`;
            }

            if (toDateTime && !fromDateTime) {
                url += `to=${toDateTime.toISOString()}`;
            }

            const response = await axios.get(url);
            setData(response.data);
            setInProgress(false);
        })();
    }, [ctxEnv, fromDateTime, toDateTime]);

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{width: '1200px'}}>
            <Paper sx={{ width: '100%', marginTop: '50px', padding: '0 10px 10px 10px', borderBottom: '1px solid #909090', display: 'flex', justifyContent: 'space-between' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                        <DateTimePicker value={fromDateTime} onChange={(newValue) => setFromDateTime(newValue)} label="From" />
                    </DemoContainer>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                        <DateTimePicker value={toDateTime} onChange={(newValue) => setToDateTime(newValue)} label="From" />
                    </DemoContainer>
                </LocalizationProvider>
            </Paper>
            {inProgress && (<div style={{display: 'flex', justifyContent: 'center'}}><CircularProgress /></div>)}
            {data && <TableContainer sx={{ maxWidth: 1200 }} component={Paper}>
                <Table sx={{ minWidth: 800 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Played At</TableCell>
                            <TableCell align="right">Team Points</TableCell>
                            <TableCell align="right">Team Players</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.gameStats.map((row: any, i: number) => {
                            const isTeam1Winner = row.teamStats[0]?.totalPoints > row.teamStats[1]?.totalPoints;

                            return <>
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell rowSpan={2} component="th" scope="row">
                                        {i + 1}
                                    </TableCell>
                                    <TableCell rowSpan={2} component="th" scope="row">
                                        {new Date(row.playedAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ backgroundColor: isTeam1Winner ? '#abf4ab' : '#f0c4c4' }} align="right">{Math.trunc(row.teamStats[0]?.totalPoints)}</TableCell>
                                    <TableCell sx={{ backgroundColor: isTeam1Winner ? '#abf4ab' : '#f0c4c4' }} align="right">{row.teamStats[0]?.userNames.map((s: string) => (<Chip label={s} variant="outlined" />))}</TableCell>
                                </TableRow>
                                <TableRow
                                    key={i.toString() + row.userId}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell sx={{ backgroundColor: isTeam1Winner ? '#f0c4c4' : '#abf4ab' }} align="right">{Math.trunc(row.teamStats[1]?.totalPoints)}</TableCell>
                                    <TableCell sx={{ backgroundColor: isTeam1Winner ? '#f0c4c4' : '#abf4ab' }} align="right">{row.teamStats[1]?.userNames.map((s: string) => (<Chip label={s} variant="outlined" />))}</TableCell>
                                </TableRow>
                            </>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>}
            </div>
        </div>
    );
}