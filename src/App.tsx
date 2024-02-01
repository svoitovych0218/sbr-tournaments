import { useEffect, useState } from 'react';

import './App.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Chip } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

const urls = {
  dev: 'https://dev-api.battle-royale.site/api/leaderboard/tournaments',
  stage: 'https://stage-api.battle-royale.site/api/leaderboard/tournaments',
  production: 'https://production-api.battle-royale.site/api/leaderboard/tournaments'
}

function App() {
  const [data, setData] = useState<any>(undefined);
  const [env, setEnv] = useState<string>('3');
  const [dateTime, setDateTime] = useState<Dayjs | null>(dayjs(new Date(new Date().setHours(new Date().getHours() - 5, 0, 0, 0)).toISOString()))
  useEffect(() => {
    (async () => {
      let url = env === '1' ? urls.dev : env === '2' ? urls.stage : urls.production;
      if (dateTime) {
        url+=`?from=${dateTime.toISOString()}`;
      }
      const response = await axios.get(url);
      setData(response.data);
    })();
  }, [env, dateTime]);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Paper sx={{ width: 300, marginRight: 'auto' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker value={dateTime} onChange={(newValue) => setDateTime(newValue)} label="From" />
                </DemoContainer>
              </LocalizationProvider>
            </Paper>
            <Paper sx={{ width: 100, marginLeft: 'auto' }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">ENV</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={env}
                  label="Env"
                  onChange={(e: any) => {
                    setEnv(e.target.value.toString());
                  }}
                >
                  <MenuItem value={1}>Dev</MenuItem>
                  <MenuItem value={2}>Playtest</MenuItem>
                  <MenuItem value={3}>Prod</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </div>
          {data && <TableContainer sx={{ maxWidth: 1200 }} component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Played At</TableCell>
                  <TableCell align="right">Team1 Points</TableCell>
                  <TableCell align="right">Team2 Points</TableCell>
                  <TableCell align="right">Team1 Players</TableCell>
                  <TableCell align="right">Team2 Players</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.gameStats.map((row: any, i: number) => (
                  <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {i + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {new Date(row.playedAt).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">{row.teamStats[0]?.totalPoints.toFixed()}</TableCell>
                    <TableCell align="right">{row.teamStats[1]?.totalPoints.toFixed()}</TableCell>
                    <TableCell align="right">{row.teamStats[0]?.userNames.map((s: string) => (<Chip label={s} variant="outlined" />))}</TableCell>
                    <TableCell align="right">{row.teamStats[1]?.userNames.map((s: string) => (<Chip label={s} variant="outlined" />))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>}
        </div>
      </header>
    </div>
  );
}

export default App;
