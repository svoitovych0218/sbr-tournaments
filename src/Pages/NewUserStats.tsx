import { Box, CircularProgress, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { EnvContext } from "../Layout/Layout";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { getBaseUrl } from "../utils/baseUrl";
import { getGameModeNameById, getMapNameById } from "../utils/enumToString";

interface UserActivityApiResponse {
    gameModeId: number,
    mapId: number,
    sessionStartAt: string;
}

interface UserStatsApiResponse {
    userId: BigInt,
    userName: string,
    createdAt: string,
    totalMatchesPlayed: number,
    deathMatchPlayedCount: number,
    teamDeathMatchPlayedCount: number,
    kingOfTheHillPlayedCount: number,
    teamKingOfTheHillPlayedCount: number,
    activities: UserActivityApiResponse[]
}

interface UserActivityState {
    gameMode: string,
    map: string,
    sessionStartAt: Date;
}

interface UserStatsState {
    userId: BigInt,
    userName: string,
    createdAt: Date,
    totalMatchesPlayed: number,
    deathMatchPlayedCount: number,
    teamDeathMatchPlayedCount: number,
    kingOfTheHillPlayedCount: number,
    teamKingOfTheHillPlayedCount: number,
    activities: UserActivityState[]
}

const getUserStatsData = async (env: string, from: Date, to: Date) => {
    const url = getBaseUrl(env);
    const res = await axios.get(`${url}/admin/get-new-user-stats?from=${from.toISOString()}&to=${to.toISOString()}`);
    const data = res.data.items as UserStatsApiResponse[];

    const response = data.map(s => ({
        userId: s.userId,
        userName: s.userName,
        createdAt: new Date(s.createdAt),
        totalMatchesPlayed: s.totalMatchesPlayed,
        deathMatchPlayedCount: s.deathMatchPlayedCount,
        teamDeathMatchPlayedCount: s.teamDeathMatchPlayedCount,
        kingOfTheHillPlayedCount: s.kingOfTheHillPlayedCount,
        teamKingOfTheHillPlayedCount: s.teamKingOfTheHillPlayedCount,
        activities: s.activities.map(q => ({ map: getMapNameById(q.mapId), gameMode: getGameModeNameById(q.gameModeId), sessionStartAt: new Date(q.sessionStartAt) }) as UserActivityState)
    } as UserStatsState));

    return { items: response, count: res.data.count };
}

const CustomRow = ({ row }: { row: UserStatsState }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="right">{row.userName}</TableCell>
                <TableCell align="right">{row.createdAt.toLocaleString()}</TableCell>
                <TableCell align="right">{row.totalMatchesPlayed}</TableCell>
                <TableCell align="right">{row.deathMatchPlayedCount}</TableCell>
                <TableCell align="right">{row.teamDeathMatchPlayedCount}</TableCell>
                <TableCell align="right">{row.kingOfTheHillPlayedCount}</TableCell>
                <TableCell align="right">{row.teamKingOfTheHillPlayedCount}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Activity
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>GameMode</TableCell>
                                        <TableCell>Map</TableCell>
                                        <TableCell align="right">At</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.activities.map((activity) => (
                                        <TableRow key={row.userId + activity.sessionStartAt.toISOString()}>
                                            <TableCell component="th" scope="row">
                                                {activity.gameMode}
                                            </TableCell>
                                            <TableCell>{activity.map}</TableCell>
                                            <TableCell align="right">{activity.sessionStartAt.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

export const NewUserStats = () => {
    const [userStats, setUserStats] = useState<UserStatsState[]>([]);
    const envCtx = useContext(EnvContext);

    const [fromDateTime, setFromDateTime] = useState<Dayjs | null>(dayjs(new Date(new Date().setHours(new Date().getHours() - 168, 0, 0, 0)).toISOString()))
    const [toDateTime, setToDateTime] = useState<Dayjs | null>(dayjs(new Date().toISOString()))
    const [totalCount, setTotalCount] = useState<number>(0);
    const [inProgress, setInProgress] = useState<boolean>(true);

    useEffect(() => {
        console.log('EnvContext:', envCtx);
    }, [envCtx])

    useEffect(() => {
        (async () => {
            setInProgress(true);
            const data = await getUserStatsData(envCtx, fromDateTime!.toDate(), toDateTime!.toDate());
            setUserStats(data.items);
            setTotalCount(data.count);
            setInProgress(false);
        })();
    }, [envCtx, fromDateTime, toDateTime]);

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
                </Paper>
                {inProgress
                    ? (<div style={{display: 'flex', justifyContent: 'center'}}><CircularProgress /></div>)
                    : (
                        <Paper sx={{ width: '100%', marginTop: '10px', marginBottom: '10px', padding: '10px 10px 10px 10px' }}>
                        <Typography align="right"><b>Total count: {totalCount}</b></Typography>
                    </Paper>
                    )}
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell align="right">UserName</TableCell>
                                <TableCell align="right">CreatedAt</TableCell>
                                <TableCell align="right">Total Matches Played</TableCell>
                                <TableCell align="right">Total DM Played</TableCell>
                                <TableCell align="right">Total Team DM Played</TableCell>
                                <TableCell align="right">Total KOH Played</TableCell>
                                <TableCell align="right">Total Team KOH Played</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userStats.map(s => (
                                <CustomRow row={s} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}