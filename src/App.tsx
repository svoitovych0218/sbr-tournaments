import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout/Layout";
import { TournamentStats } from "./Pages/TournamentStats";
import { NewUserStats } from "./Pages/NewUserStats";
import { ActivityStats } from "./Pages/ActivityStats";
import { UserTournamentPointsPage } from "./Pages/TournamentPoints";

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate replace to="new-users-stats" />} />
          <Route path="new-users-stats" element={<NewUserStats />} />
          <Route path="tournaments" element={<TournamentStats />} />
          <Route path="activity-stats" element={<ActivityStats />} />
          <Route path='tournament-points' element={<UserTournamentPointsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
