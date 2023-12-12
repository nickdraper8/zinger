import { useQuery } from "@tanstack/react-query"
import { getCumulativeScoreData } from "../services/espn.js";

export const Fantasy = () => {

    // const query = useQuery({
    //     queryKey: ['fantasyScores'],
    //     queryFn: getCumulativeScoreData,
    // })

    // console.log(query)

    return (
        <div>
            <div>Hello! This is the fantasy component</div>
        </div>
    )
}