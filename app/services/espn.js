import axios from "axios";

const relevantMatchupPeriodIds = [15,16,17];
// const relevantMatchupPeriodIds = [13,14,15];
const relevantTeamIds = [6, 8];

const ApiViews = {
    mTeam: 'mTeam',
    mMatchup: 'mMatchup',
    mRoster: 'mRoster',
    mSettings: 'mSettings',
    mBoxscore: 'mBoxscore',
    mMatchupScore: 'mMatchupScore',
    kona_player_info: 'kona_player_info',
    player_wl: 'player_wl',
    mSchedule: 'mSchedule',
    mScoreboard: 'mScoreboard',
}

const FantasyApiClient = axios.create({
    baseURL: 'https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/2024/segments/0/leagues/884074',
    timeout: 20000,
    headers: {
        Accept: 'application/json',
    }
})

const getFantasyData = async (url) => {
    try {
        const response = await FantasyApiClient.get(url)
        if (response.status !== 200) {
          console.error(
            `Error ${response.status}: Unable to fetch data from ESPN API.\n${response.message}`
          );
          return null;
        }
        const data = response.data;
        debugger
        return data;
      } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
      }
}

const roundToTwoDecimalPlaces = (number) => Math.round(number * 100)/100;

const isTeamInvolvedInMatchup = (matchup, teamId) => matchup?.away?.teamId === teamId || matchup?.home?.teamId === teamId
const getTeamMatchupScore = (matchup, teamId) => {
    const team = matchup?.away?.teamId === teamId ? matchup.away : matchup.home;
    if (team.totalPoints > 0) {
        return roundToTwoDecimalPlaces(team.totalPoints)
    } else if (team.rosterForMatchupPeriod.appliedStatTotal) {
        return roundToTwoDecimalPlaces(team.rosterForMatchupPeriod.appliedStatTotal)
    } else {
        return 0;
    }

}
const normalizeTeamCumulativeScore = (matchupData, matchupPeriodIds, teamIds) => {
    const relevantMatchups = matchupData.schedule.filter(matchup => matchupPeriodIds.includes(matchup.matchupPeriodId));
    const teamScoreDataConfig = {};
    teamIds.forEach(teamId => {
        relevantMatchups.forEach(matchup => {
            if (!teamScoreDataConfig[teamId]) {
                teamScoreDataConfig[teamId] = {
                    cumulativeScore: 0,
                    matchupPeriodScores: {},
                }
            }
            if (isTeamInvolvedInMatchup(matchup, teamId)) {
                const matchupScore = getTeamMatchupScore(matchup, teamId);
                teamScoreDataConfig[teamId].matchupPeriodScores[matchup.matchupPeriodId] = matchupScore
                teamScoreDataConfig[teamId].cumulativeScore = roundToTwoDecimalPlaces(teamScoreDataConfig[teamId].cumulativeScore + matchupScore)
            }
        })
    })
    return teamScoreDataConfig;
}

export const getCumulativeScoreData = async () => {
    const teamDataUrl = `?view=${ApiViews.mTeam}`;
    const matchupDataUrl = `?view=${ApiViews.mMatchup}`;
    const [teamData, matchupData] = await Promise.all([getFantasyData(teamDataUrl), getFantasyData(matchupDataUrl)])
    const teamCumulativeScores = normalizeTeamCumulativeScore(matchupData, relevantMatchupPeriodIds, relevantTeamIds)
    for (const teamId in teamCumulativeScores) {
        teamCumulativeScores[teamId].teamData = teamData.teams.find(team => team.id === parseInt(teamId));
    }
    return Object.values(teamCumulativeScores);
}