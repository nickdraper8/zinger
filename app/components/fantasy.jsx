"use client"

import { useQuery } from "@tanstack/react-query";
import { getCumulativeScoreData } from "../services/espn.js";
import { useMemo } from "react";

import './fantasy.css';

const Team = ({ cumulativeScore, matchupPeriodScores, teamData }) => {
    return (
        <div className="team_wrapper">
            <img src={teamData.logo} width={100} height={100} />
            <h3>{teamData.name}</h3>
            <p>Total points: {cumulativeScore}</p>
            {Object.keys(matchupPeriodScores).map(key => (
                <p>Week {key} points: {matchupPeriodScores[key]}</p>
            ))}
        </div>
    )
}

export const Fantasy = () => {

    const { isFetching, isPending, isError, data, error } = useQuery({
        queryKey: ['fantasyScores'],
        queryFn: getCumulativeScoreData,
    })

    if (isPending) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <div>
            <div>Hello! This is the fantasy component</div>
            {isFetching &&
                <p>Fetching for up-to-date scores...</p>
            }
            {data && data.map(data => {
                return <Team {...data} />
            })}
        </div>
    )
}