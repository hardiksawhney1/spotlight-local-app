import React from 'react'
import { List } from './List'
import { Anchor } from './Anchor'
import { Operations } from './Operations'

export const Live = () => {
  return (
    <div>
        {/* Main container */}
        <div>
            {/* left div with 40% width */}
            <List /> 
            {/* List component Show the data from data.json file in three columns
            First column will be serial number which show the index
            Next column is info which will have a div in which name, address, category and language is shown
            Third column is a checkbox which will tick / untick according to checked value in data 
            if we check/uncheck the value, make changes in data.json as well */}
        </div>
        <div>
            {/* Right div with 60% width */}
                <div>
                    {/* Div with 60% height */}
                    <Anchor />
                    {/* In this component, fetch  three numbers, position1,2,3 from positions.json in real time
                    which are the index of items of data.json file and 
                    show those details of those candidates in table form */}

                    {/* Create a Announcement box which is textarea will get the string value of announcement
                    from announcement.json file text and it should get real-timeupdates from announcement.json and
                    a checkbox box with label read  */}

                    {/* another checkbox with label call  */}

                    {/* Also make a stopwatch here and this component will fetch stop and start and reset bool from timer.js in real time updates and will act according to it  */}
                     

                </div>
                <div>
                    {/* Div with 40% height */}
                    <Operations />
                    {/* In this component, make three input fields to enter the number, number entered 
                    are position1, position2 and position3, on save button click save them in positions.json */}

                    {/* Then there are three buttons start timer and stop timer and reset timer and 
                    save them in booleans in timer.json file */}

                    {/* Then there is a textarea box which is for announcement on click of push button that text
                    in the box will be saved in announcement.js file and a button clear will empty the string in that file and 
                    empty the textarea box as well */}

                </div>
        </div>

    </div>
  )
}
