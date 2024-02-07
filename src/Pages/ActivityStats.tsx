import axios from "axios";
import { getBaseUrl } from "../utils/baseUrl"
import { getGameModeNameById, getMapNameById } from "../utils/enumToString";
import { Checkbox, CircularProgress, FormControlLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { EnvContext } from "../Layout/Layout";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { formatTimeSpan } from "../utils/timespan";

interface IGameModeMapStatsApiResponse {
    gameModeId: number,
    mapId: number,
    totalPlayersCount: number,
    uniquePlayersCount: number,
    totalTimePlayed: number,
}

interface IGameModeMapStatsState {
    gameMode: string,
    map: string,
    totalPlayersCount: number,
    uniquePlayersCount: number,
    totalTimePlayed: number,
}

const getGameModeMapStats = async (env: string, from: Date, to: Date, newUsersOnly: boolean) => {
    const url = getBaseUrl(env);
    const res = await axios.get(`${url}/admin/get-game-mode-map-stats?from=${from.toISOString()}&to=${to.toISOString()}&newUsersOnly=${newUsersOnly}`);

    const response = (res.data.items as IGameModeMapStatsApiResponse[]).map(s => ({
        gameMode: getGameModeNameById(s.gameModeId),
        map: getMapNameById(s.mapId),
        totalPlayersCount: s.totalPlayersCount,
        uniquePlayersCount: s.uniquePlayersCount,
        totalTimePlayed: s.totalTimePlayed
    } as IGameModeMapStatsState));

    return { items: response, totalTimePlayed: res.data.totalPlayedTime };
}

export const ActivityStats = () => {
    const [activityStats, setActivityStats] = useState<IGameModeMapStatsState[]>([]);
    const [totalTimePlayed, setTotalTimePlayed] = useState<string>('');
    const envCtx = useContext(EnvContext);
    const [fromDateTime, setFromDateTime] = useState<Dayjs | null>(dayjs(new Date(new Date().setHours(new Date().getHours() - 168, 0, 0, 0)).toISOString()))
    const [toDateTime, setToDateTime] = useState<Dayjs | null>(dayjs(new Date().toISOString()))
    const [newUsersOnly, setNewUsersOnly] = useState<boolean>(false);
    const [inProgress, setInProgress] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            setInProgress(true);
            const data = await getGameModeMapStats(envCtx, fromDateTime!.toDate(), toDateTime!.toDate(), newUsersOnly);
            setActivityStats(data.items);
            setTotalTimePlayed(formatTimeSpan(data.totalTimePlayed));
            setInProgress(false);
        })();
    }, [envCtx, fromDateTime, toDateTime, newUsersOnly]);

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
                            <DateTimePicker value={toDateTime} onChange={(newValue) => setToDateTime(newValue)} label="To" />
                        </DemoContainer>
                    </LocalizationProvider>
                    <FormControlLabel control={<Checkbox checked={newUsersOnly} onChange={(e) => setNewUsersOnly(e.target.checked)} />} label="New Users Only" />
                </Paper>
                {inProgress
                    ? (<div style={{display: 'flex', justifyContent: 'center'}}><CircularProgress /></div>)
                    : (
                        <Paper sx={{ width: '100%', marginTop: '10px', marginBottom: '10px', padding: '10px 10px 10px 10px' }}>
                            <Typography align="right"><b>Total Time Played: {totalTimePlayed}</b></Typography>
                        </Paper>
                    )}
                < TableContainer component={Paper}>
                    <Table sx={{ minWidth: 800 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Game Mode</TableCell>
                                <TableCell align="left">Map</TableCell>
                                <TableCell align="left">Total Players Count</TableCell>
                                <TableCell align="left">Unique Players Count</TableCell>
                                <TableCell align="left">Total Time Played</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activityStats.map(s => (
                                <TableRow>
                                    <TableCell>{s.gameMode}</TableCell>
                                    <TableCell>{s.map}</TableCell>
                                    <TableCell>{s.totalPlayersCount}</TableCell>
                                    <TableCell>{s.uniquePlayersCount}</TableCell>
                                    <TableCell>{s.totalTimePlayed}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div >
    )
}