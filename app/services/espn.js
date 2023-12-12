import axios from "axios";

const SWID = '{9B9BAB6D-5376-4E03-9BAB-6D53769E03F6}'
const ESPN_S2 = 'AEBa8ekRzG7oqzI2XmJV/hxJfRZ+dXwnBwfOOxixxpVzqxDGPM1Xz+iB1nFfWvpwoBILILaJabV96cZxi34+3slkqGHyKoBjZ7DBAvDSwrmFhQokm786qJq1sFZ4DTTlmCcfqwp/th4AOv8zgdEg+xFUNerkMZ0CRsHdzokqsHVPLZfqSoFtPxhEjzlYmRexm7D5EAALG+xIsYzOHt/Z4opijrLH5rfQ9YC0FnmuEefdsjep/B7helNibfI4CKlYNqsfwTqOaI8HKVOmkkFaTcXd';
const leagueId = 884074
const cookie = `swid=${SWID}; espn_s2=${ESPN_S2}`;

const relevantMatchupPeriodIds = [12,13,14];
const relevantTeamIds = [5, 7, 9];

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
    baseURL: 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2023/segments/0/leagues',
    timeout: 1000,
    headers: {
        Accept: 'application/json',
        cookie: cookie,
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
        return data;
      } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
      }
}

const normalizeTeamData = (teamData) => {
    const dataConfig = {};
    teamData.teams.forEach(team => {
        dataConfig[team.id] = team;
    })
}

const roundToTwoDecimalPlaces = (number) => Math.round(number * 100)/100;

const isTeamInvolvedInMatchup = (matchup, teamId) => matchup.away.teamId === teamId || matchup.home.teamId === teamId
const getTeamMatchupScore = (matchup, teamId) => {
    const team = matchup.away.teamId === teamId ? matchup.away : matchup.home;
    if (team.totalPoints > 0) {
        return roundToTwoDecimalPlaces(team.totalPoints)
    } else {
        return roundToTwoDecimalPlaces(team.rosterForMatchupPeriod.appliedStatTotal)
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
    const teamDataUrl = `/${leagueId}?view=${ApiViews.mTeam}`;
    const matchupDataUrl = `/${leagueId}?view=${ApiViews.mMatchup}`;
    const [teamData, matchupData] = await Promise.all([getFantasyData(teamDataUrl), getFantasyData(matchupDataUrl)])
    const teamIdMap = normalizeTeamData(teamData);
    const teamCumulativeScores = normalizeTeamCumulativeScore(matchupData, relevantMatchupPeriodIds, relevantTeamIds)
    for (const teamId in teamCumulativeScores) {
        teamCumulativeScores[teamId].teamData = teamData.teams.find(team => team.id === parseInt(teamId));
    }
    return teamCumulativeScores;
}