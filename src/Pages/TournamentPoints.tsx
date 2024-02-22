import { Button, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import axios from "axios";
import { useCallback, useContext } from "react";
import { useEffect, useState } from "react";
import { EnvContext } from "../Layout/Layout";
import { getBaseUrl } from "../utils/baseUrl";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import JSONbig from 'json-bigint';

interface UserTournamentPointsApiResponse {
    userId: BigInt,
    userName: string,
    createdAt: string,
    tournamentPoints: number,
    tournamentPlayedCount: number
}

interface UserTournamentPoints {
    userId: BigInt,
    userName: string,
    createdAt: Date,
    tournamentPoints: number,
    tournamentPlayedCount: number
}

const getTournamentsPointsData = async (env: string, userName: string | undefined) => {
    let url = `${getBaseUrl(env)}/admin/user-tournament-points`;
    if (userName) {
        url += `?userName=${userName}`;
    }
    const res = await axios.get(url, { transformResponse: [data => data] });
    const data = JSONbig.parse(res.data) as UserTournamentPointsApiResponse[];

    const response = data.map(s => ({
        userId: s.userId,
        userName: s.userName,
        createdAt: new Date(s.createdAt),
        tournamentPoints: s.tournamentPoints,
        tournamentPlayedCount: s.tournamentPlayedCount,
    } as UserTournamentPoints));

    return response;
}

const CustomRow = ({ row }: { row: UserTournamentPoints }) => {
    const [pointsCount, setPointsCount] = useState<number>(row.tournamentPoints);
    const [playedClount, setPlayedCount] = useState<number>(row.tournamentPlayedCount);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const envCtx = useContext(EnvContext);

    const handleChange = useCallback(async () => {
        setIsLoading(true);
        const url = `${getBaseUrl(envCtx)}/admin/set-toournament-points`;
        await axios.post(url, { tournamentPoints: [{ userId: row.userId, tournamentPoints: pointsCount, tournamentPlayedCount: playedClount }] });
        setIsLoading(false);
        setIsEditing(false);
    }, [envCtx, pointsCount, playedClount, row.userId]);

    return (
        <TableRow key={`${row.userName}-${row.userId}`} sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell align="left">{row.userName}</TableCell>
            <TableCell align="left">{row.createdAt.toLocaleString()}</TableCell>
            <TableCell align="right">
                <TextField
                    id={`points-${row.userId}`}
                    onChange={(e) => setPointsCount(+e.target.value)}
                    label="Points"
                    type='number'
                    value={pointsCount}
                    variant="outlined"
                    disabled={!isEditing}
                    sx={{marginRight: 2}}
                />

                <TextField
                    id={`played-count-${row.userId}`}
                    onChange={(e) => setPlayedCount(+e.target.value)}
                    label="Played Count"
                    type='number'
                    value={playedClount}
                    variant="outlined"
                    disabled={!isEditing}
                />


                {isLoading ? <CircularProgress /> : isEditing ? (
                    <IconButton onClick={handleChange}>
                        <DoneIcon />
                    </IconButton>
                ) : (
                    <IconButton onClick={() => setIsEditing(true)}>
                        <EditIcon />
                    </IconButton>
                )}
            </TableCell>
        </TableRow>
    )
}

export const UserTournamentPointsPage = () => {
    const [userStats, setUserStats] = useState<UserTournamentPoints[]>([]);
    const envCtx = useContext(EnvContext);

    const [userNameFilter, setUserNameFilter] = useState<string | undefined>(undefined)
    const [inProgress, setInProgress] = useState<boolean>(true);
    const [userNameTextField, setUserNameTextField] = useState<string | undefined>(undefined);

    useEffect(() => {
        console.log('EnvContext:', envCtx);
    }, [envCtx])

    useEffect(() => {
        (async () => {
            setInProgress(true);
            setUserStats([]);
            const data = await getTournamentsPointsData(envCtx, userNameFilter);
            setUserStats(data);
            setInProgress(false);
        })();
    }, [envCtx, userNameFilter]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '1200px' }}>
                <Paper sx={{ width: '100%', marginTop: '50px', padding: '0 10px 10px 10px', borderBottom: '1px solid #909090', display: 'flex', justifyContent: 'space-around' }}>
                    <TextField value={userNameTextField} id="standard-basic" onChange={(e) => setUserNameTextField(e.target.value)} label="UsetName" variant="standard" />
                    <Button variant="contained" onClick={() => setUserNameFilter(userNameTextField)}>Search</Button>
                </Paper>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">UserName</TableCell>
                                <TableCell align="left">CreatedAt</TableCell>
                                <TableCell align="right">Points</TableCell>
                            </TableRow>
                        </TableHead>
                        {inProgress ? <CircularProgress /> : (
                            <TableBody>
                                {userStats.map(s => (
                                    <CustomRow key={s.userId.toString()} row={s} />
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}