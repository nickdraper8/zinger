"use client"

import { useQuery } from "@tanstack/react-query";
import { getCumulativeScoreData } from "../services/espn.js";
import { useMemo } from "react";
import LoadingSpinner from "./loadingSpinner.js"

import './fantasy.css';
import Image from "next/image.js";
import FallbackImage from "../components/ui/FallbackImage";

const compareCumulativeScores = (a, b) => {
    return b.cumulativeScore - a.cumulativeScore
}

const getPlaceString = (index) => {
    if (index === 0) {
        return '1st';
    } else if (index === 1) {
        return '2nd';
    } else {
        return '3rd';
    }
}

const Team = ({ cumulativeScore, matchupPeriodScores, teamData, idx }) => {
    const placeString = getPlaceString(idx)
    return (
        <div className={`team_item_wrapper team_item_wrapper--${idx}`}>
            <div className="team_item_wrapper__separator">
                <div className="team_item_wrapper__team_identifier">
                    <FallbackImage className="team_image" src={teamData.logo} height={100} width={200} alt={`${teamData.name}-image`}/>
                    <h3 className="team_name sub_header_1">{teamData.name}</h3>
                </div>
                <div className="team_item_wrapper__total_points">
                    <p className="sub_header_1">Total points:</p>
                    <p className="total_points">{cumulativeScore}</p>
                </div>
            </div>
            <div className="team_item_wrapper__separator team_item_wrapper__matchup_score">
                <p className={`place place--${placeString}`}>{placeString}</p>
                <div className="team_item_wrapper__separator team_item_wrapper__matchup_score team_item_wrapper__matchup_score--wrapper">
                    {Object.keys(matchupPeriodScores).map((key, index) => (
                        <div key={`${key}-${index}`} className="team_item_wrapper__matchup_score team_item_wrapper__matchup_score--item">
                            <p className="sub_header_2">Round {index + 1}:</p><p className="matchup_score">{matchupPeriodScores[key]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export const Fantasy = () => {

    const { isFetching, isPending, isError, data, error, refetch } = useQuery({
        queryKey: ['fantasyScores'],
        queryFn: getCumulativeScoreData,
        refetchInterval: 60000,
    })

    const sortedTeams = useMemo(() => {
        if (!data) return null;
        return data.sort(compareCumulativeScores)
    }, [data])

    return (
        <div className="fantasy_wrapper">
            <Image className="header_image" src="/beermiledonut.webp" height={200} width={200} alt="header_image"/>
            <h1 className="header">BEER MILES DONUTS LOSERBOARD</h1>
            <button className="refresh_button" onClick={() => refetch()}>&#8635;</button>
            {isError && <div className='modal'><p>Error: {error.message}</p></div>}
            {isPending && (
                <div className='loading_spinner_box'> 
                    <LoadingSpinner />
                </div>
            )}
            <div className={`loading_text${!isFetching || isPending ? ' loading_text--hide' : ''}`}>
                Getting up to date scores from ESPN...
            </div>
            {data && (
                <div className="team_leaderboard_wrapper">
                    {sortedTeams.map((data, idx) => {
                        return <Team key={idx} {...data} idx={idx} />
                    })}
                </div>
            )}
        </div>
    )
}