import api, { route, fetch } from "@forge/api";

import ForgeUI, { render, Fragment, Text, useState, ProjectPage, StatusLozenge ,Table, Head, Cell, Row, Button, useEffect, Heading, ButtonSet } from "@forge/ui";

// Application Constants
const appConstants =  {
    TABLE_HEADER_CONSTANTS : {
        STORY_NAME : "Story Name",
        DESCRIPTION : "Description/Summary",
        STORY_POINTS : "Estimated Story Points",
        SUGGESTED_DEVELOPER : "Suggested Developer"
    },
    PREDICT_STORY_POINT_URL : "https://ab39-157-51-85-91.ngrok-free.app/predict_spe",
    PREDICT_ASIGNEE_POINT_URL : "https://ab39-157-51-85-91.ngrok-free.app/predict_assignee"
}


const App = () => {

    /**
     * @author Keerthana Ravindran 
     * @description From the list of available sprints on the Jira board, get the current active sprint
     */
    const [currentSprint, setCurrentSprint] = useState('');
    useEffect(async()=>{
        const response = await api.asApp()
        .requestJira(route`/rest/agile/1.0/board/1/sprint`);
        const data = await response.json();
        let values = data.values;
        
        let currentSpr = values.find((x)=>{
            return x.state == 'active'
        })
        setCurrentSprint(currentSpr.name);
    },[])

    /**
     * @author Naveen kumar N
     * @returns Header elements of the table
     */
    const renderTableHeaders = () => {
        return <Fragment>
            <Head>
                <Cell><Text>{appConstants.TABLE_HEADER_CONSTANTS.STORY_NAME}</Text></Cell>
                <Cell><Text>{appConstants.TABLE_HEADER_CONSTANTS.DESCRIPTION}</Text></Cell>
                <Cell><Text>{appConstants.TABLE_HEADER_CONSTANTS.STORY_POINTS}</Text></Cell>
                <Cell><Text>{appConstants.TABLE_HEADER_CONSTANTS.SUGGESTED_DEVELOPER}</Text></Cell>
                </Head>
        </Fragment>
    }
    /**
     * @author Naveen kumar N
     * @param  issueType fetched fron the story
     * @returns task column of the table
     */
    const renderTask= (issueType) =>{
        return <Cell><Text><StatusLozenge text={issueType} appearance="inprogress" /></Text></Cell>
    }

    /**
     * @author Naveen kumar N
     * @param descriptions of the story fetched
     * @returns description column of the table
     */
    const renderDescription = (descriptions) => {
        return <Cell>{descriptions.map(function (desc, i) {
            return <Text> {desc} </Text>
        })}</Cell>
    }

    /**
     * @author Naveen kumar N
     * @param point story points that need to be populated
     * @returns story points column of the table
     */
    const renderPoints = (point) => {
        return <Cell><Text>{point}</Text></Cell>
    }

    /**
     * @author Naveen kumar N
     * @param developer Developer name that need to be populated
     * @returns Developer column of the table
     */
    const renderSuggestedDeveloper = (developer) => {
        return <Cell><Text>{developer}</Text></Cell>
    }

    /**
     * @author Keerthana Ravindran
     * @description For all the Issues related to the current sprint, estimate the Story points
     * @returns Displays an action button called "Estimate Story Point"
     */
    const renderStoryPointButton = () =>{        
        let reqbody = {
            "model": "lr.sav",
            "data": issueData
        };
        const handleStoryPoint = async() => {
            const res = await fetch(appConstants.PREDICT_STORY_POINT_URL,
            {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(reqbody)
            }).then(response => response.text())
                .then(data => {
                    let storyPointArrData = JSON.parse(data)
                    let story_points = storyPointArrData["DATA_PREDICTION"]
                    issueArr.forEach((issue, i)=>{
                        issue.points = story_points[i];
                    })
                    setIssueArr([...issueArr])
                })
        };
        
        return (
            <Button text="Estimate Story Point" onClick={handleStoryPoint} />
        );
    }

    /**
     * @author Keerthana Ravindran
     * @description For all the Issues related to the current sprint, predict the Developer to be assigned
     * @returns Displays an action button called "Suggest Developer"
     */
    const renderSuggestedDeveloperButton = () =>{
        let reqbody = {
            "model": "lr.sav",
            "data": issueData
        };
        const handleSuggestedDeveloper = async() => {
            const res = await fetch(appConstants.PREDICT_ASIGNEE_POINT_URL,
            {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(reqbody)
            }).then(response => response.text())
                .then(data => {
                    let storyPointArrData = JSON.parse(data)
                    let story_points = storyPointArrData["DATA_PREDICTION"]
                    issueArr.forEach((issue, i)=>{
                        issue.suggestedDeveloper = story_points[i];
                    })
                    setIssueArr([...issueArr])
                })
        };
        return (
            <Button text="Suggest Developers" onClick={handleSuggestedDeveloper} />
        );
    }

    const [issueArr,setIssueArr] = useState([]);
    const [issueData,setIssueData] = useState([]);

    /**
     * @author Keerthana Ravindran
     * @description Fetches all issues related to the current active sprint and also populate object for performing other POST requests for prediction calls
     */
    useEffect(async()=>{
        const res = await api
        .asApp()
        .requestJira(route`/rest/api/3/search?jql=project=AEP AND sprint in openSprints()`);
        const events = await res.json();
        let resArray = [];
        events.issues.forEach(issue => {
            var issueDescriptionMap = {}
            if (issue.fields.issuetype.name == 'Task') {
                var descArr = []
                if(issue.fields.description.content!=null ){
                    issue.fields.description.content.forEach(contentElement => {
                        if(contentElement.content!=null){
                            contentElement.content.forEach(content => {
                                if (content.type = "Text") {
                                    descArr.push(content.text)
                                }
                            });
                        }
                    });
                }
                issueDescriptionMap.type = issue.fields.summary;
                issueDescriptionMap.description = descArr
                resArray.push(issueDescriptionMap)
            }   
        });
        setIssueArr([...resArray])
        let issueDataStruct = [];
        events.issues.forEach(issue => {
            let desc = '';
            if(issue.fields.description.content!=null ){
                issue.fields.description.content.forEach(contentElement => {
                    if(contentElement.content!=null){
                        contentElement.content.forEach(content => {
                            if (content.type = "Text") {
                                desc+= content.text+'\n';
                            }
                        });
                    }
                });
            }
            let issueObj = {
                "ISSUE TYPE" : issue.fields.issuetype.name,
                "STORY POINT ESTIMATE" : issue.fields.customfield_10016,
                "STORY POINT" : null,
                "SUMMARY" : issue.fields.summary,
                "DESCRIPTION" : desc,
                "ASSIGNEE" : issue.fields.assignee
            }
            issueDataStruct.push(issueObj);
        })
        setIssueData([...issueDataStruct]);
    },[])

 return (
    <ProjectPage>
        <Heading size="Medium"><Text>{currentSprint}</Text></Heading>
        <ButtonSet>
            {renderStoryPointButton()}
            {renderSuggestedDeveloperButton()}
        </ButtonSet>
        <Table>
            {renderTableHeaders()}
            {issueArr.map(function (issue, i) {
                return <Fragment>
                        <Row>
                            {renderTask(issue.type)}    
                            {renderDescription(issue.description)}
                            {renderPoints(issue.points)}
                            {renderSuggestedDeveloper(issue.suggestedDeveloper)}
                        </Row>
                    </Fragment>
                }) 
             }
        </Table>
    </ProjectPage>
    );
};


export const run = render(<App />);