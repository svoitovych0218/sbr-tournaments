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

interface IGameStats {
    gameId: string;
    playedAt: Date;
    teamStats: {
        totalPoints: number;
        isWinner: boolean;
        userNames: string[]
    }[];
};

const getGameStats = async (env: string, from: Dayjs | null, to: Dayjs | null) => {
    let url = `${getBaseUrl(env)}/leaderboard/tournaments`;
    if (from || to) {
        url += '?';
    }

    if (from) {
        url += `from=${from.toISOString()}`
    }

    if (from && to) {
        url += `&to=${to.toISOString()}`;
    }

    if (to && !from) {
        url += `to=${to.toISOString()}`;
    }

    const apiResponse = await axios.get(url);

    const response: IGameStats[] = apiResponse.data.gameStats.map((s: any) => ({
        gameId: s.gameId,
        playedAt: new Date(s.playedAt),
        teamStats: s.teamStats.map((q: any) => ({
            totalPoints: q.totalPoints,
            userNames: [...q.userNames],
            isWinner: q.totalPoints === Math.max(...s.teamStats.map((t: any) => t.totalPoints))
        }))
    } as IGameStats));

    console.log(response);
    return response;
}

export const TournamentStats = () => {
    const [data, setData] = useState<IGameStats[]>([]);
    const [fromDateTime, setFromDateTime] = useState<Dayjs | null>(dayjs(new Date(new Date().setHours(new Date().getHours() - 24, 0, 0, 0)).toISOString()))
    const [toDateTime, setToDateTime] = useState<Dayjs | null>(dayjs(new Date().toISOString()))
    const ctxEnv = useContext(EnvContext);
    const [inProgress, setInProgress] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            setData([])
            setInProgress(true);
            const gameStats = await getGameStats(ctxEnv, fromDateTime, toDateTime);
            setData(gameStats);
            setInProgress(false);
        })();
    }, [ctxEnv, fromDateTime, toDateTime]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '1200px' }}>
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
                {inProgress && (<div style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></div>)}
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
                            {data.map((row, i: number) => {
                                const teamsAmount = row.teamStats.length;
                                return <>

                                    <TableRow
                                        key={i}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell rowSpan={teamsAmount} component="th" scope="row">
                                            {i + 1}
                                        </TableCell>
                                        <TableCell rowSpan={teamsAmount} component="th" scope="row">
                                            {new Date(row.playedAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: row.teamStats[0].isWinner ? '#abf4ab' : '#f0c4c4' }} align="right">{Math.trunc(row.teamStats[0]?.totalPoints)}</TableCell>
                                        <TableCell sx={{ backgroundColor: row.teamStats[0].isWinner ? '#abf4ab' : '#f0c4c4' }} align="right">{row.teamStats[0]?.userNames.map((s: string) => (<Chip label={s} variant="outlined" />))}</TableCell>
                                    </TableRow>

                                    {row.teamStats.slice(1).map((ts, k) => (
                                        <TableRow
                                            key={(i + k).toString() + ts.totalPoints}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell sx={{ backgroundColor: ts.isWinner ? '#abf4ab' : '#f0c4c4' }} align="right">{Math.trunc(ts.totalPoints)}</TableCell>
                                            <TableCell sx={{ backgroundColor: ts.isWinner ? '#abf4ab' : '#f0c4c4' }} align="right">{ts.userNames.map((s: string) => (<Chip label={s} variant="outlined" />))}</TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>}
            </div>
        </div>
    );
}